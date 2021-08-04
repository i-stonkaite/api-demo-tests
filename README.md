# API test automation demo project for gorest (https://gorest.co.in)

## Description

The goal of the project is to demonstrate the ability to perform API testing and it's automation.

## Prerequisites

1. Install node.js (https://nodejs.org/en/download/current/)
2. Install cypress (preferably via npm) (https://docs.cypress.io/guides/getting-started/installing-cypress#System-requirements)
3. Text editor (e.g. Visual Studio Code)

## Installation

1. Download repo
2. Install node_modules in project's root directory:
   npm install

## Scripts

First script runs all the tests in the browser via Cypress GUI:

1. Navigate to a project's directory
2. Paste the following to the terminal: npm run cy:open
3. Once a UI window opens, click on single test file to see it run, or click on "Run 4 integration specs" to run all the tests

Second script runs all tests via the command line:

1. Navigate to a project's directory
2. Paste the following to the terminal: npm run cy:run
3. If you're using VSC, please use the following command:
   <!--- npx cypress run --spec 'cypress/integration/**/*.spec.js' --->
   (the command is commented out to avoid Markdown)

## Support

Email: i.stonkaite@protonmail.com
or https://www.linkedin.com/in/ieva-stonkaite-541941167/
