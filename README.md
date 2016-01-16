# Auth0 Rules Categorizer

This app generates a list of Auth0 rules, categorized by the applications they apply to.

## Assumptions

* If a rule applies to all the apps, it should not mention the client ID of any application in the script.
* If a rule applies to only one or more applications, the client IDs of those application(s) should be mentioned in the script.

## System requirements

* [Node.js](https://nodejs.org/en/download/) v4.2 or higher

## Prerequisites

1. In the [Auth0 dashboard](https://manage.auth0.com), create a new app.
1. In the [Auth0 Management API](https://auth0.com/docs/api/v2), generate a new token for the `read:clients` and `read:rules` scopes.

## How to setup

There are two ways to setup the app: deploying to Heroku using the Heroku button below or manually installing in your own server.

### Deploying to Heroku

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

### Manual install

1. Clone the repo and `cd` to the cloned directory.
1. Install gulp globally with `npm install -g gulp`.
1. Install dependencies with `npm install`.
1. Create a `.env` file based on the `.env.sample` in the project and add the credentials of the new app you created in step 1 and the token you generated in step 2.
1. Go to the cloned directory and run `npm start`.
1. Now visit `http://localhost:8000` in the browser and login to access the app.

**Tip**: If you're running the app in a server and want to make sure that the app runs continuously, you can use [forever](https://www.npmjs.com/package/forever).

## Whitelisting only specific users to the app

1. Go to [Rules section](https://manage.auth0.com/#/rules) in the Auth0 dashboard.
1. Choose 'Whitelist for a specific app' under Access Control.
1. Replace `NameOfTheAppWithWhiteList` with the name of the app created for this project.
1. Replace the `whitelist` array with the emails of users you want to whitelist.
1. Save the rule.

## Using the app

Once you are logged in to the webapp, the list of applications and the rules that apply to them will be shown.

The 'All Applications' list at the top includes the rules that apply to all your applications.

If you have a large collection of applications or rules, you can filter them by name by using the two search boxes at the top.

If you want to see only the rules that are currently enabled, check the 'Show enabled rules only' checkbox.

## Development

### Running the app in dev mode

Run `gulp`.

`gulp` will watch for file changes and restart the node app when necessary.

### Running the tests

Run `gulp test`
