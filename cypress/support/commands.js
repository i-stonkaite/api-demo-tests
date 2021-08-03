// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// randomization function added to randomise the data used for testing, so it would be less likely to repeat
function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

const randomNum = getRandomInt(1000);
const headers = { 'content-type': 'application/json' };
const randomisedEmail = `testEmail${randomNum}@email.com`;
const randomisedUpdatedEmail = `updated${randomisedEmail}`;

const bearerToken = {
  bearer: Cypress.env('API_KEY'),
};

const getUserByRandomisedEmail = {
  method: 'GET',
  url: `/users?email=${randomisedEmail}`,
};

const getUserByUpdatedEmail = {
  method: 'GET',
  url: `/users?email=${randomisedUpdatedEmail}`,
};

const postWithValidTokenAndEmptyData = {
  method: 'POST',
  url: '/users',
  auth: bearerToken,
  body: {
    name: '',
    email: '',
    gender: '',
    status: '',
  },
  headers: { 'content-type': 'application/json' },
  timeout: 120000,
  failOnStatusCode: false,
};

const postWithValidData = {
  method: 'POST',
  url: '/users',
  auth: bearerToken,
  body: {
    name: 'testName',
    email: randomisedEmail,
    gender: 'male',
    status: 'active',
  },
  headers: { 'content-type': 'application/json' },
  timeout: 120000,
  failOnStatusCode: false,
};

const postWithInvalidToken = {
  method: 'POST',
  url: '/users',
  body: {
    name: 'testName',
    email: randomisedEmail,
    gender: 'male',
    status: 'active',
  },
  headers: { 'content-type': 'application/json' },
  timeout: 120000,
  failOnStatusCode: false,
};

Cypress.Commands.add('postWithValidTokenAndEmptyData', () => {
  cy.request(postWithValidTokenAndEmptyData);
});

Cypress.Commands.add('postWithValidData', () => {
  cy.request(postWithValidData);
});

Cypress.Commands.add('getUserByRandomisedEmail', () => {
  cy.request(getUserByRandomisedEmail);
});

Cypress.Commands.add('getUserByUpdatedEmail', () => {
  cy.request(getUserByUpdatedEmail);
});

Cypress.Commands.add('postWithInvalidToken', () => {
  cy.request(postWithInvalidToken);
});

Cypress.Commands.add('deleteUserById', () => {
  cy.getUserByRandomisedEmail()
    .then((response) => {
      expect(response.status).eq(200);
      const getCreatedUserId = cy.get(response.body.data[0].id);
    })
    .then((getCreatedUserId) => {
      cy.request({
        method: 'DELETE',
        url: `/users/${getCreatedUserId[0]}`,
        auth: bearerToken,
        headers: headers,
        timeout: 120000,
        failOnStatusCode: false,
      }).should((response) => {
        expect(response.status).eq(204);
      });
    });
});

module.exports = {
  randomisedEmail,
  randomisedUpdatedEmail,
  headers,
  bearerToken,
};
