# Epitech grades and statistics 📈

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
$ pnpm i
```

### Configure the bot

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

#### Now you just need to run the `main.py` ! 🐡

```bash
$ py main.py
```

During the script, you will be asked for an OTP code, which you should normally receive by phone. Your Microsoft account must be linked to your telephone number if you turn on 2FA. So you just need to enter the code in your terminal when asked.

#### Launch the web application

```bash
$ cd ..
$ pnpm run dev
```

## Technologies

![](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&color=20232a)
![](https://img.shields.io/badge/next.js-%2320232a?style=for-the-badge&logo=nextdotjs)
![](https://img.shields.io/badge/python-%2320232a.svg?style=for-the-badge&logo=python&color=20232a)

## Authors

- [@AlxisHenry](https://github.com/AlxisHenry)
