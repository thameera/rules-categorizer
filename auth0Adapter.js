'use strict';

const Promise = require('bluebird');
let rest = require('restler');

let makeAuth0Request = (url, query) => {
  return new Promise((resolve, reject) => {

    rest.get(url, {
      accessToken: process.env.AUTH0_API_TOKEN,
      query
    })
    .on('complete', (data, response) => {
      if (data instanceof Error) {
        reject(data);
        return;
      }

      if (response.statusCode !== 200) {
        reject(new Error(`Auth0 responded with ${response.statusCode} status code`));
        return;
      }

      if (!data) {
        reject(new Error(`Auth0 responded with empty message`));
        return;
      }

      resolve(data);
    });

  });
};

let getApplications = () => {
  const url = `https://${process.env.AUTH0_DOMAIN}/api/v2/clients`;
  const query = {
    fields: 'name,client_id,global',
    include_fields: true
  };
  return makeAuth0Request(url, query);
};

let getRules = () => {
  const url = `https://${process.env.AUTH0_DOMAIN}/api/v2/rules`;
  const query = {
    fields: 'id,name,script,enabled',
    include_fields: true
  };
  return makeAuth0Request(url, query);
};

let getStrippedRule = (rule) => {
  return {
    name: rule.name,
    enabled: rule.enabled
  };
};

let categorize = (apps, rules) => {
  // Remove the 'All applications' object
  apps = apps.filter((app) => !app.global);
  console.log( rules);

  // Create a list of apps and rules that mention them
  const result = apps.map((app) => {
    const rulesForApp = rules
      .filter((rule) => rule.script.indexOf(app.client_id) >= 0 )
      .map((rule) => getStrippedRule(rule));

    return {
      name: app.name,
      client_id: app.client_id,
      rules: rulesForApp
    };
  });

  // Determine rules that concern all apps
  const rulesForAllApps = rules
    .filter((rule) => {
      return apps.every((app) => rule.script.indexOf(app.client_id) < 0);
    })
    .map((rule) => getStrippedRule(rule));

  // Prepend an entry for all apps to the beginning
  result.splice(0, 0, {
    name: 'All Applications',
    client_id: '0',
    rules: rulesForAllApps
  });

  return result;
};

let getCategorizedRules = () => {
  return Promise.all([getApplications(), getRules()])
    .spread(categorize);
};

module.exports = {
  getCategorizedRules
};
