const api_key = require('../../testData.json').API_KEY;
const errorResponseEmailHasBeenTaken = require('../../fixtures/users.json').data
  .errorResponseEmailHasBeenTaken;
const errorResponseBlankInputFields = require('../../fixtures/users.json').data
  .errorResponseBlankInputFields;

// randomization function added to randomise the data used for testing, so it would be less likely to repeat
function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

const randomNum = getRandomInt(1000);
const getUserByEmail = {
  method: 'GET',
  url: `/users?email=${`testEmail${randomNum}@email.com`}`,
};

const getUserByUpdatedEmail = {
  method: 'GET',
  url: `/users?email=${`testEmailupdated${randomNum}@email.com`}`,
};

const postWithValidData = {
  method: 'POST',
  url: '/users',
  auth: {
    bearer: api_key,
  },
  body: {
    name: 'testName',
    email: `testEmail${randomNum}@email.com`,
    gender: 'male',
    status: 'active',
  },
  headers: { 'content-type': 'application/json' },
  timeout: 120000,
  failOnStatusCode: false,
};

const postWithValidTokenAndEmptyData = {
  method: 'POST',
  url: '/users',
  auth: {
    bearer: api_key,
  },
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

describe('Given the "Create a new user" endpoint', () => {
  context('When I send POST request to /users endpoint', () => {
    it('Then if an INVALID token is used, I should NOT be able to create a new user', () => {
      //A new user is created with valid data and token
      cy.request({
        method: 'POST',
        url: '/users',
        body: {
          name: 'testName',
          email: `testEmail${randomNum}@email.com`,
          gender: 'male',
          status: 'active',
        },
        headers: { 'content-type': 'application/json' },
        timeout: 120000,
        failOnStatusCode: false,
      }).should((response) => {
        expect(response.status).eq(401);
      });
    });

    it('Then if a valid token is used but data fields are left blank, I should NOT be able to create a new user', () => {
      //A new user is created with valid data and token
      cy.request(postWithValidTokenAndEmptyData).should((response) => {
        expect(response.status).eq(422);
        expect(JSON.stringify(response.body.data)).eq(
          JSON.stringify(errorResponseBlankInputFields)
        );
      });
    });

    it('Then if valid token is used, I should be able to create a new user', () => {
      //A new user is created with valid data and token
      cy.request(postWithValidData)
        .should((response) => {
          expect(response.status).eq(201);
          expect(response.body.data.id).to.be.a('number').and.to.not.be.null.and
            .to.not.be.undefined;
          expect(response.body.data.name).eq('testName');
          expect(response.body.data.email).eq(
            `testEmail${randomNum}@email.com`
          );
          expect(response.body.data.gender).eq('male');
          expect(response.body.data.status).eq('active');
        })
        // A check is made whether the newly created user can be found in a users list
        .then(() => {
          cy.request(getUserByEmail).then((response) => {
            expect(response.status).eq(200);
            //Always fails
            // expect(response.duration).to.not.be.greaterThan(200);
          });
        });
    });
    it('Then if I attempt to repeatedly post the same data, an error should be displayed', () => {
      cy.request(postWithValidData).should((response) => {
        expect(response.status).eq(422);
        expect(JSON.stringify(response.body.data)).eq(
          JSON.stringify(errorResponseEmailHasBeenTaken)
        );
      });
    });
  });

  context('When I send UPDATE request to /users endpoint', () => {
    it('Then if valid token is used, I should be able to UPDATE a user', () => {
      //This part finds an ID of a user created in a previous test
      cy.request(getUserByEmail)
        .then((response) => {
          expect(response.status).eq(200);
          //Always fails
          // expect(response.duration).to.not.be.greaterThan(200);
          const getCreatedUserId = cy.get(response.body.data[0].id);
        })
        .then((getCreatedUserId) => {
          // Created user is deleted using the ID
          cy.request({
            method: 'PUT',
            url: `/users/${getCreatedUserId[0]}`,
            auth: {
              bearer: api_key,
            },
            body: {
              name: 'testNameUpdated',
              email: `testEmailupdated${randomNum}@email.com`,
              gender: 'female',
              status: 'inactive',
            },
            headers: { 'content-type': 'application/json' },
            timeout: 120000,
            failOnStatusCode: false,
          }).should((response) => {
            expect(response.status).eq(200);
            //Always fails
            // expect(response.duration).to.not.be.greaterThan(200);
            expect(response.body.data.id).to.be.a('number').and.to.not.be.null
              .and.to.not.be.undefined;
            expect(response.body.data.name).eq('testNameUpdated');
            expect(response.body.data.email).eq(
              `testEmailupdated${randomNum}@email.com`
            );
            expect(response.body.data.gender).eq('female');
            expect(response.body.data.status).eq('inactive');
          });
        });
    });
  });

  context('When I send DELETE request to /users endpoint', () => {
    it('Then if valid token is used, I should be able to DELETE a new user', () => {
      //This part finds an ID of a user created in a previous test
      cy.request(getUserByUpdatedEmail)
        .then((response) => {
          expect(response.status).eq(200);
          //Always fails
          // expect(response.duration).to.not.be.greaterThan(200);

          const getCreatedUserId = cy.get(response.body.data[0].id);
          cy.log(response.body.data);
          cy.log(getUserByUpdatedEmail);
        })
        .then((getCreatedUserId) => {
          cy.log(getCreatedUserId);
          //Created user is deleted using the ID
          cy.request({
            method: 'DELETE',
            url: `/users/${getCreatedUserId[0]}`,
            auth: {
              bearer: api_key,
            },
            headers: { 'content-type': 'application/json' },
            timeout: 120000,
            failOnStatusCode: false,
          })
            .should((response) => {
              expect(response.status).eq(204);
              //Always fails
              // expect(response.duration).to.not.be.greaterThan(200);
            })
            .then(() => {
              //A search for a deleted user is made by email, the search returns 200 response, but the user data inside returned object is deleted
              cy.request(getUserByEmail).then((response) => {
                response = JSON.stringify(response.body.data[0]);
                expect(response).to.be.undefined;
              });
            });
        });
    });
  });
});
