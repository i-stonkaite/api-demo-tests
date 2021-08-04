import {
  randomisedEmail,
  createUserWithValidData,
  getUserByRandomisedEmail,
} from '../../support/commands';

const errorResponseEmailHasBeenTaken = require('../../fixtures/users.json').data
  .errorResponseEmailHasBeenTaken;
const errorResponseBlankInputFields = require('../../fixtures/users.json').data
  .errorResponseBlankInputFields;

describe('Given the "Create a new user" endpoint', () => {
  context('When I send POST request to /users endpoint', () => {
    //data created for the test is deleted once the test is finished
    after(() => {
      cy.request(getUserByRandomisedEmail)
        .then((response) => {
          expect(response.status).eq(200);
          const userId = cy.get(response.body.data[0].id);
        })
        .then((userId) => {
          userId = userId[0];
          cy.deleteUserById(userId);
        });
    });

    it('Then if an invalid token is used, I should not be able to create a new user', () => {
      cy.createUserWithInvalidToken().should((response) => {
        expect(response.status).eq(401);
        // expect(response.duration).to.not.be.greaterThan(200);
      });
    });

    it('Then if a valid token is used but data fields are left blank, I should not be able to create a new user', () => {
      cy.createUserWithValidTokenAndEmptyData().should((response) => {
        expect(response.status).eq(422);
        // expect(response.duration).to.not.be.greaterThan(200);
        expect(JSON.stringify(response.body.data)).eq(
          JSON.stringify(errorResponseBlankInputFields)
        );
      });
    });

    it('Then if valid token and valid data are used, I should be able to create a new user', () => {
      cy.request(createUserWithValidData)
        .should((response) => {
          expect(response.status).eq(201);
          // expect(response.duration).to.not.be.greaterThan(200);
          // Checks if data in the response body matches the data used to create a new user
          expect(response.body.data.id).to.be.a('number').and.to.not.be.null.and
            .to.not.be.undefined;
          expect(response.body.data.name).eq('testName');
          expect(response.body.data.email).eq(randomisedEmail);
          expect(response.body.data.gender).eq('male');
          expect(response.body.data.status).eq('active');
        })
        .then(() => {
          // Checks if the newly created user can be found in user's list
          cy.getUserByRandomisedEmail().then((response) => {
            expect(response.status).eq(200);
            // expect(response.duration).to.not.be.greaterThan(200);
          });
        });
    });

    it('Then if I attempt to repeatedly create a user with the same data, an error should be displayed', () => {
      cy.request(createUserWithValidData).should((response) => {
        expect(response.status).eq(422);
        expect(JSON.stringify(response.body.data)).eq(
          JSON.stringify(errorResponseEmailHasBeenTaken)
        );
      });
    });
  });
});
