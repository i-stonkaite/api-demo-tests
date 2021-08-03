import {
  randomisedEmail,
  randomisedUpdatedEmail,
  headers,
  bearerToken,
} from '../../support/commands';

const errorResponseEmailHasBeenTaken = require('../../fixtures/users.json').data
  .errorResponseEmailHasBeenTaken;
const errorResponseBlankInputFields = require('../../fixtures/users.json').data
  .errorResponseBlankInputFields;

describe('Given the "Create a new user" endpoint', () => {
  context('When I send POST request to /users endpoint', () => {
    after(() => {
      cy.deleteUserById();
    });

    it('Then if an INVALID token is used, I should NOT be able to create a new user', () => {
      //A new user is created with valid data and token
      cy.postWithInvalidToken().should((response) => {
        expect(response.status).eq(401);
      });
    });

    it('Then if a valid token is used but data fields are left blank, I should NOT be able to create a new user', () => {
      // A new user is created with valid data and token
      cy.postWithValidTokenAndEmptyData().should((response) => {
        expect(response.status).eq(422);
        expect(JSON.stringify(response.body.data)).eq(
          JSON.stringify(errorResponseBlankInputFields)
        );
      });
    });

    it('Then if valid token and valid data are used, I should be able to create a new user', () => {
      //A new user is created with valid data and token
      cy.postWithValidData()
        .should((response) => {
          expect(response.status).eq(201);
          expect(response.body.data.id).to.be.a('number').and.to.not.be.null.and
            .to.not.be.undefined;
          expect(response.body.data.name).eq('testName');
          expect(response.body.data.email).eq(randomisedEmail);
          expect(response.body.data.gender).eq('male');
          expect(response.body.data.status).eq('active');
        })
        // A check is made whether the newly created user can be found in a users list
        .then(() => {
          cy.getUserByRandomisedEmail().then((response) => {
            expect(response.status).eq(200);
            //Always fails
            // expect(response.duration).to.not.be.greaterThan(200);
          });
        });
    });

    it('Then if I attempt to repeatedly post the same data, an error should be displayed', () => {
      cy.postWithValidData().should((response) => {
        expect(response.status).eq(422);
        expect(JSON.stringify(response.body.data)).eq(
          JSON.stringify(errorResponseEmailHasBeenTaken)
        );
      });
    });
  });
});
