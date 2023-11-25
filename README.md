# Devian V2

This project a recreation of [johncovv/devian](http://github.com/johncovv/devian) with newest tools and better code.

## Description

This project is a simple Discord bot developed by John Covv. It's designed to run on Node.js version **20 or higher**.

## Installation

First, clone the repository:

```bash
git clone git@github.com:johncovv/devian-v2.git
```

Then, navigate into the project directory:

```bash
cd devian-v2
```

<br/>

Install the dependencies:

```bash
yarn install
```

or

```bash
npm install
```

## Setup

Copy the .env.example file and create a new `.env.local` file:

```bash
cp .env.example .env.local
```

Open the `.env.local` file and replace the placeholders with your [actual information](https://discordjs.guide/preparations/setting-up-a-bot-application.html#creating-your-bot).

## Starting the Development Server

To start the development server, run:

```bash
yarn dev
```

or

```bash
npm run dev
```

This will start the bot in development mode. You can now make changes to the code and the bot will automatically\* restart when it detects any changes.

\* New `events` or `command` files will only be listen on the fast reload when the first register occours.
