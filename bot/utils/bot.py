import time
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
import os
from dotenv import load_dotenv

class Bot:

		def __init__(self, url):
				load_dotenv()
				self.service = Service(os.getenv('CHROMEDRIVER_PATH'))
				self.driver = webdriver.Chrome(service= self.service)
				self.driver.get(url)
				self.wait(2)

		def authenticate(self):
			username = os.getenv("MICROSOFT_EMAIL")
			password = os.getenv("MICROSOFT_PASSWORD")
			
			# Click on login with O365
			self.driver.find_element(By.XPATH, "/html/body/div[4]/div[1]/div[2]/section/div/div[2]/div/div/div/div/div/div[2]/div[3]/div/a").click()
			self.wait(2)

			# Email
			self.driver.find_element(By.XPATH, '//*[@id="i0116"]').send_keys(os.getenv("MICROSOFT_EMAIL"))
			self.driver.find_element(By.XPATH, '//*[@id="idSIButton9"]').click()
			self.wait(10)
			# Password
			self.driver.find_element(By.XPATH, '//*[@id="passwordInput"]').send_keys(os.getenv("MICROSOFT_PASSWORD"))
			self.driver.find_element(By.XPATH, '//*[@id="submitButton"]').click()

			self.wait()

			# Receive double auth code on phone and enter it
			self.driver.find_element(By.XPATH, '//*[@id="idDiv_SAOTCS_Proofs"]/div[1]').click()
			doubleAuthCode = ""
			while not doubleAuthCode:
				doubleAuthCode = input("Enter the double auth code you received on your phone: ")
			print("Double auth code received, waiting for the page to load... " + doubleAuthCode)
			self.driver.find_element(By.XPATH, '//*[@id="idTxtBx_SAOTCC_OTC"]').send_keys(doubleAuthCode)
			self.driver.find_element(By.XPATH, '//*[@id="idSubmit_SAOTCC_Continue"]').click()

			self.wait(2)

			# Remember me and continue
			self.driver.find_element(By.XPATH, '//*[@id="KmsiCheckboxField"]').click()
			self.driver.find_element(By.XPATH, '//*[@id="idSIButton9"]').click()

		def retrieveCourses(self):
			self.courses = []
			courses = self.driver.find_element(By.XPATH, '//*[@id="dropdownmain-navigation0"]').find_elements(By.TAG_NAME, "li")
			for course in courses:
				link = course.find_element(By.TAG_NAME, "a")
				self.courses.append(link.get_attribute("href"))
				print(link.get_attribute("href"))
			self.wait(100)
				
		def wait(self, seconds = 5):
				time.sleep(seconds)

