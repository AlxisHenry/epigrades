from utils.bot import Bot

bot = Bot(url="https://gandalf.epitech.eu/login/index.php")

bot.authenticate()
bot.retrieve_courses()
bot.quit()
