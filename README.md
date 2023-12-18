# Notes and statistics at Epitech 🎓

This is a web application to have a global view and some statistics about my studies at Epitech.

## Table of contents

1. [How to use it ?](#how-to-use-it-)
2. [Technologies](#technologies)
3. [Authors](#authors)

## How to use it ?

First, you need to clone the repository.

```bash
$ git clone https://github.com/AlxisHenry/epitech-grades.git
$ cd epitech-grades
```

### Install javascript dependencies

> Note that I'm using pnpm instead of npm

```
$ pnpm install
$ pnpm run build
$ pnpm start
```

The web application is now running on `http://localhost:3000`.

### Configure the puppeteer bot

The puppeteer bot is used to scrap the grades from the intranet. You can use it to scrap your grades and then use the web application to see your statistics.

**Note:** you need to disable 2FA with the Microsoft Authenticator app to use the puppeteer bot.

You need to install the apt packages with the following command:

```bash
cd scraper
bash packages.sh
```

#### Testing

```bash
$ node index.js <email> <password> <uuid>
```

When you run the script, you will be asked for an OTP code, which you should normally receive by phone. Your Microsoft account must be linked to your telephone number if you turn on 2FA. So you just need to run the `otp.sh` script like this:

```bash
$ bash otp.sh <email> <password> <code>
```

#### Access to your grades

When the script is finished, you can access with the web application to your grades with the following url:

`http://localhost:3000/online/<uuid>`

For example, the default file is named `me.json`, so the url will be:

`http://localhost:3000/online/me`

### API usage

You can use the API to get your grades in JSON format with the following command:

```bash	
$ curl -X GET http://localhost:3000/api/online/uuid?uuid=<uuid>
```

The `uuid` parameter is the name of the file in the `scraper/reports` folder.

### Configure the selenium bot (deprecated)

**Note:** this bot is not maintained anymore, but you can still use it if you want. (I recommend you to use the puppeteer bot)

```bash
$ cd bot
$ cp .env.example .env
$ cat .env
MICROSOFT_EMAIL="example@gmail.com"
MICROSOFT_PASSWORD="password"
CHROMEDRIVER_PATH="./drivers/chromedriver.exe"
WEBSITE_URL="https://www.microsoft.com/en-us/software-download/windows10ISO"
```

- Replace the `MICROSOFT_EMAIL` and `MICROSOFT_PASSWORD` environments variables with your microsoft credentials.
- Replace `WEBSITE_URL` with the link to gandalf login page.

#### Reset the `grades.json` file using the sample.

```
$ cp grades.sample.json grades.json
```

#### Optionally you can use a python virtual environment to run the bot.

```bash
$ python3 -m venv venv
$ venv/Scripts/activate
```

#### Install the needed packages

```bash
$ pip install -r requirements.txt
```

#### Install the chromedriver

Go to `https://googlechromelabs.github.io/chrome-for-testing/#stable` and download the chromedriver for your version of chrome. Then put it in the `drivers` folder (name it `chromedriver.exe`).

#### Now you just need to run the `main.py` ! 🐡

```bash
$ py main.py
```

During the script, you will be asked for an OTP code, which you should normally receive by phone. Your Microsoft account must be linked to your telephone number if you turn on 2FA. So you just need to enter the code in your terminal when asked.

## Technologies

![](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&color=20232a)
![](https://img.shields.io/badge/next.js-%2320232a?style=for-the-badge&logo=nextdotjs)
![](https://img.shields.io/badge/python-%2320232a.svg?style=for-the-badge&logo=python&color=20232a)

## Authors

- [@AlxisHenry](https://github.com/AlxisHenry)
