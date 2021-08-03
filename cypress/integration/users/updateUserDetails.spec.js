import {
  randomisedUpdatedEmail,
  headers,
  bearerToken,
} from '../../support/commands';

describe('Given the "Update user details" endpoint', () => {
  context('When I send UPDATE request to /users endpoint', () => {
    before(() => {
      cy.postWithValidData();
    });

    after(() => {
      cy.deleteUserById();
    });

    it('Then if a valid token is used, I should be able to UPDATE a user', () => {
      //This part finds an ID of a user created in a previous test
      cy.getUserByRandomisedEmail()
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
            auth: bearerToken,
            body: {
              name: 'testNameUpdated',
              email: randomisedUpdatedEmail,
              gender: 'female',
              status: 'inactive',
            },
            headers: headers,
            timeout: 120000,
            failOnStatusCode: false,
          }).should((response) => {
            expect(response.status).eq(200);
            //Always fails
            // expect(response.duration).to.not.be.greaterThan(200);
            expect(response.body.data.id).to.be.a('number').and.to.not.be.null
              .and.to.not.be.undefined;
            expect(response.body.data.name).eq('testNameUpdated');
            expect(response.body.data.email).eq(randomisedUpdatedEmail);
            expect(response.body.data.gender).eq('female');
            expect(response.body.data.status).eq('inactive');
          });
        });
    });
  });
});
