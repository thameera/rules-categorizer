'use strict';

const Promise = require('bluebird');
const rest = require('restler');

const makeAuth0Request = (url, query) => {
  return new Promise((resolve, reject) => {

    rest.get(url, {
      accessToken: process.env.AUTH0_API_TOKEN,
      query
    })
    .on('complete', (data, response) => {
      console.log(data);

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

const getApplications = () => {
  const url = `https://${process.env.AUTH0_DOMAIN}/api/v2/clients`;
  const query = {
    fields: 'name,client_id',
    include_fields: true
  };
  return makeAuth0Request(url, query);
};

const getRules = () => {
  const url = `https://${process.env.AUTH0_DOMAIN}/api/v2/rules`;
  const query = {
    fields: 'id,name,script',
    include_fields: true
  };
  return makeAuth0Request(url, query);
};

const getCategorizedRules = () => {
  return Promise.all([getApplications(), getRules()])
    .then((res) => {
      return [];
    });
};

module.exports = {
  getCategorizedRules
};
