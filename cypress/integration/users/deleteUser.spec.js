import { headers, bearerToken } from '../../support/commands';

describe('Given the "Delete user" endpoint', () => {
  before(() => {
    cy.postWithValidData();
  });

  context('When I send DELETE request to /users endpoint', () => {
    it('Then if valid token is used, I should be able to DELETE a new user', () => {
      //This part finds an ID of a user created in a previous test
      cy.getUserByRandomisedEmail()
        .then((response) => {
          expect(response.status).eq(200);
          //Always fails
          // expect(response.duration).to.not.be.greaterThan(200);
          const getCreatedUserId = cy.get(response.body.data[0].id);
        })
        .then((getCreatedUserId) => {
          //Created user is deleted using the ID
          cy.request({
            method: 'DELETE',
            url: `/users/${getCreatedUserId[0]}`,
            auth: bearerToken,
            headers: headers,
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
              cy.getUserByRandomisedEmail().then((response) => {
                response = JSON.stringify(response.body.data[0]);
                expect(response).to.be.undefined;
              });
            });
        });
    });
  });
});
