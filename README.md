# Epigrades 🎓

This project is a more glamorous and faster **Gandalf** (the intranet of Epitech). On this website you can retrieve my own grades ordered by semesters and also by modules, and the possibility for you student to see your grades easily !

## Table of contents

1. [How to use it ?](#how-to-use-it-)
2. [Technical guide](#technical-guide)
3. [Technologies](#technologies)
4. [Authors](#authors)

## How to use it ?

Go to [epigrades](https://epigrades.alexishenry.eu/online), enter your Microsoft Epitech credentials, give your authentication code and that's it !

***Tips**: if you do not receive any notification, open your authenticator app and refresh the home screen to check for notifications.*

> For more confidentiality you will have a **private token** linked to your account.

## Technical guide

First, you need to clone the repository.

```bash
$ git clone https://github.com/AlxisHenry/epigrades.git
$ cd epigrades
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

**Note:** the bot is supporting SMS 2FA authentication and Microsoft Authenticator application usage.

You need to install the apt packages with the following command:

```bash
cd scraper
bash packages.sh
```

#### Testing

```bash
$ node scraper/index.js <email> <password> <uuid>
```

##### Using SMS A2F

When you run the script, you will be asked for an OTP code, which you should normally receive by phone.

You just need to run the `otp.sh` script using the following command:

```bash
$ bash scraper/otp.sh <uuid> <code>
```

##### Using Microsoft Authenticator

When you run the script, your A2F app will ask for a code of two digits, you can retrieve this code in the `scraper/temp` folder, in `png` format in a file named `authenticator-<uuid>.png`.

#### Access to your report

When the script is finished, you can access with the web application to your grades with the following url:

`http://localhost:3000/online/<uuid>`

For example, the default file is named `me.json`, so the url will be:

`http://localhost:3000/online/me`

### API usage

**The `uuid` parameter is the name of the file in the `scraper/reports` folder.**

You can use the API to get your report in JSON format with the following command:

```bash
$ curl -X GET http://localhost:3000/api/online/<uuid>
```

#### Average

You can get the average of all your grades with the following endpoint:

```bash
$ curl -X GET http://localhost:3000/api/average?uuid=<uuid>
```

Without the `uuid` parameter, the API will return by default the average of the `me.json` file.

**Note:** If the given `uuid` is not found, the API will return `-1`.

#### Report (in PDF format)

You can get your report (in PDF format) encoded in base64 using the following endpoint:

```bash
$ curl -X GET http://localhost:3000/api/online/<uuid>/pdf
```

**Note:** If the given `uuid` is not found, the API will return null instead of the base64.

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
