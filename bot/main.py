import os
from utils.bot import Bot
from dotenv import load_dotenv

load_dotenv()

bot = Bot(url=os.getenv('WEBSITE_URL'))

bot.authenticate()
bot.retrieve_courses()
bot.quit()
bot.push()
