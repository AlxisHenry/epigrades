import time
import os
import json
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import NoSuchElementException
from dotenv import load_dotenv
from datetime import datetime
from .json import Json


class Bot:

    def __init__(self, url):
        load_dotenv()
        self.load(url)

    def load(self, url):
        self.service = Service(os.getenv('CHROMEDRIVER_PATH'))
        self.driver = webdriver.Chrome(
            service=self.service)
        self.driver.maximize_window()
        self.driver.get(url)
        self.wait(2)

    def authenticate(self):
        self.set_credentials()
        self.double_authentication()
        self.driver.find_element(
            By.XPATH, '//*[@id="idSIButton9"]').click()  # Continue

    def set_credentials(self):
        # Click on login with O365
        self.driver.find_element(
            By.XPATH, "/html/body/div[4]/div[1]/div[2]/section/div/div[2]/div/div/div/div/div/div[2]/div[3]/div/a").click()
        self.wait(2)
        # Email
        self.driver.find_element(
            By.XPATH, '//*[@id="i0116"]').send_keys(os.getenv("MICROSOFT_EMAIL"))
        self.driver.find_element(By.XPATH, '//*[@id="idSIButton9"]').click()
        self.wait(10)
        # Password
        self.driver.find_element(
            By.XPATH, '//*[@id="passwordInput"]').send_keys(os.getenv("MICROSOFT_PASSWORD"))
        self.driver.find_element(By.XPATH, '//*[@id="submitButton"]').click()
        self.wait()

    def double_authentication(self):
        self.driver.find_element(
            By.XPATH, '//*[@id="idDiv_SAOTCS_Proofs"]/div[1]').click()
        double_auth_code = ""
        while not double_auth_code:
            double_auth_code = input(
                "Enter the double auth code you received on your phone: ")
        print(
            "Double auth code received, waiting for the page to load... " + double_auth_code)
        self.driver.find_element(
            By.XPATH, '//*[@id="idTxtBx_SAOTCC_OTC"]').send_keys(double_auth_code)
        self.driver.find_element(
            By.XPATH, '//*[@id="idSubmit_SAOTCC_Continue"]').click()
        self.wait(2)

    def retrieve_courses(self):
        courses = self.find_courses()
        for i in range(len(courses)):
            course = self.find_courses()[i]
            self.driver.find_element(
                By.XPATH, '//*[@id="main-navigation0"]').click()
            self.wait(1)
            self.course_name = course.text
            course.click()
            self.wait(1)
            self.driver.find_element(
                By.XPATH, '/html/body/div[5]/header/div[4]/div/div/div/nav/ul/li[5]/a').click()
            self.wait(1)
            if (self.has_assignment()):
                print("Assignments found for this course.")
                self.driver.get(self.find_assignment_link())
                self.save(semester=self.retrieve_semester(
                ), course_name=self.course_name, values=self.retrieve_values_from_table())
                self.wait()
            else:
                print("No assignments found for this course.")
                self.wait(1)

    def find_courses(self):
        return self.driver.find_elements(By.XPATH, '//*[@id="dropdownmain-navigation0"]/li/a')

    def has_assignment(self):
        try:
            item = self.driver.find_element(
                By.PARTIAL_LINK_TEXT, "Assignments")
        except NoSuchElementException as e:
            item = None
        return item is not None and len(item.text) > 0

    def find_assignment_link(self):
        return self.driver.find_element(By.XPATH, '/html/body/div[5]/header/div[4]/div/div/div/nav/ul/li[5]/ul/li[3]/a').get_attribute("href")

    def retrieve_semester(self):
        return self.driver.find_element(By.XPATH, '//*[@id="page-navbar"]/nav/ol/li[4]/span/a/span').text

    def retrieve_values_from_table(self):
        tbody_element = self.driver.find_element(By.TAG_NAME, 'tbody')
        rows = tbody_element.find_elements(By.TAG_NAME, 'tr')
        array = []
        for row in rows:
            columns = row.find_elements(By.TAG_NAME, 'td')
            data = []
            for column in columns:
                data.append(column.text)
            if data != [""]:
                array.append(data)
        return array

    def save(self, semester, course_name, values):
        j = Json("./grades.json").load()
        if not j.public_check_if_semester_exist(semester):
            j.public_add_new_semester(semester)
        if not j.public_check_if_course_exist(semester, course_name):
            j.public_add_new_course(semester, course_name)
        for row in values:
            day_name = row[0]
            j.public_add_or_update_day(
                semester=semester, course_name=course_name, day=day_name, data=row)
        del j

    def push(self):
        os.system(
            'cd .. && git add ./bot/grades.json && git commit -m "Update grades.json" && git push')

    def quit(self):
        self.driver.quit()

    def wait(self, seconds=5):
        time.sleep(seconds)
