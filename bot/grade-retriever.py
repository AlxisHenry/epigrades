from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By

path = Service('./chromedriver.exe')
driver = webdriver.Chrome(service= path)
driver.get("https://www.google.com/")

search = driver.find_element(By.XPATH, "//*[@id='APjFqb']")
print(search)

