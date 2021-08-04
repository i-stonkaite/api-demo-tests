import { updatedEmail, headers, bearerToken } from '../../support/commands';

describe('Given the "Update user details" endpoint', () => {
  context('When I send UPDATE request to /users endpoint', () => {
    //the data used for this test is created before it's execution and deleted after the test is finished
    before(() => {
      cy.createUserWithValidData();
    });

    after(() => {
      cy.deleteUserByUpdatedEmail();
    });

    it('Then if a valid token is used, I should be able to UPDATE a user', () => {
      //This part finds an ID of a user created in a previous test
      cy.getUserByRandomisedEmail()
        .then((response) => {
          expect(response.status).eq(200);
          // expect(response.duration).to.not.be.greaterThan(200);
          const getCreatedUserId = cy.get(response.body.data[0].id);
          cy.log(response.body.data.id);
          cy.log(response.body.data.name);
          cy.log(response.body.data.email);
        })
        .then((getCreatedUserId) => {
          // User is updated using it's unique ID
          cy.request({
            method: 'PUT',
            url: `/users/${getCreatedUserId[0]}`,
            auth: bearerToken,
            body: {
              name: 'testNameUpdated',
              email: updatedEmail,
              gender: 'female',
              status: 'inactive',
            },
            headers: headers,
            timeout: 120000,
            failOnStatusCode: false,
          }).should((response) => {
            expect(response.status).eq(200);
            // expect(response.duration).to.not.be.greaterThan(200);
            // Validation that response body provides updated user information
            expect(response.body.data.id).to.be.a('number').and.to.not.be.null
              .and.to.not.be.undefined;
            expect(response.body.data.name).eq('testNameUpdated');
            expect(response.body.data.email).eq(updatedEmail);
            expect(response.body.data.gender).eq('female');
            expect(response.body.data.status).eq('inactive');
          });
        });
    });

    it('Then searching for a user by their old email address should return no results', () => {
      cy.getUserByRandomisedEmail().then((response) => {
        response = JSON.stringify(response.body.data[0]);
        expect(response).to.be.undefined;
      });
    });
  });
});
