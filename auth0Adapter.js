'use strict';

const Promise = require('bluebird');
let rest = require('restler');

/**
 * Makes a GET request to Auth0 management API
 * @param {string} url - URL endpoint to call
 * @param {Object} query - Parameters to be passed with the API call
 * @returns {Promise}
 */
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

/**
 * Retrieves the list of all applications from Auth0
 * @returns {Promise}
 */
let getApplications = () => {
  const url = `https://${process.env.AUTH0_DOMAIN}/api/v2/clients`;
  const query = {
    fields: 'name,client_id,global',
    include_fields: true
  };
  return makeAuth0Request(url, query);
};

/**
 * Retrieves the list of all rules from Auth0
 * @returns {Promise}
 */
let getRules = () => {
  const url = `https://${process.env.AUTH0_DOMAIN}/api/v2/rules`;
  const query = {
    fields: 'id,name,script,enabled',
    include_fields: true
  };
  return makeAuth0Request(url, query);
};

/**
 * Returns a new rule object with only the parameters that need to be sent to frontend
 * @param {Object} rule - rule
 * @returns {Object} - stripeed down rule
 */
let getStrippedRule = (rule) => {
  return {
    name: rule.name,
    enabled: rule.enabled
  };
};

/**
 * Returns an array of categorized apps and rules
 * @param {Array} apps - Array of apps retrieved from Auth0
 * @param {Array} rules - Array of rules retrieved from Auth0
 * @returns {Array}
 */
let categorize = (apps, rules) => {
  // Remove the 'All applications' object
  apps = apps.filter((app) => !app.global);

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

/**
 * Returns the categorized array of apps/rules that should be sent to the frontend
 * @returns {Promise}
 */
let getCategorizedRules = () => {
  return Promise.all([getApplications(), getRules()])
    .spread(categorize);
};

module.exports = {
  getCategorizedRules
};
