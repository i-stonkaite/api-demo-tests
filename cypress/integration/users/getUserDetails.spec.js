const getUsersEndpoint = require('../../fixtures/users.json').data.getUsers;

describe('Given the "Get user details" endpoint', () => {
  context('When I send GET /users request', () => {
    it('Then max response time should be less than 200 ms', () => {
      cy.request(getUsersEndpoint).should((response) => {
        expect(response.duration).to.not.be.greaterThan(200);
      });
    });

    it('Then HTTP status code should be 200', () => {
      cy.request(getUsersEndpoint).should((response) => {
        expect(response.status).eq(200);
      });
    });

    // an ID of a valid already existing value is taken for the test to avoid hardcoding
    it('Then a single user should be found by their unique ID', () => {
      cy.request(getUsersEndpoint)
        .should((response) => {
          expect(response.status).eq(200);
          var idOfTheFirstUser = cy.get(response.body.data[1].id);
        })
        .then((idOfTheFirstUser) => {
          cy.request({
            method: 'GET',
            url: `/users?id=${idOfTheFirstUser[0]}`,
          }).should((response) => {
            expect(response.status).eq(200);
            expect(response.body.data.length).eq(1);
          });
        });
    });

    // an email of a valid already existing value is taken for the test to avoid hardcoding
    it('Then a single user should be found by their unique email address', () => {
      cy.request(getUsersEndpoint)
        .should((response) => {
          expect(response.status).eq(200);
          cy.log(response.body.data[1].email);
          var emailOfTheFirstUser = cy.get(response.body.data[1]);
        })
        .then((emailOfTheFirstUser) => {
          emailOfTheFirstUser = emailOfTheFirstUser[0].email;
          cy.request({
            method: 'GET',
            url: `/users?email=${emailOfTheFirstUser}`,
          }).should((response) => {
            expect(response.status).eq(200);
            expect(response.body.data.length).eq(1);
          });
        });
    });

    it('Then every user object should contain 5 keys: id, name, email, gender, status', () => {
      cy.request(getUsersEndpoint).should((response) => {
        expect(response.status).eq(200);
        Cypress._.each(response.body.data, (user) => {
          expect(user).to.have.all.keys(
            'id',
            'name',
            'email',
            'gender',
            'status'
          );
        });
      });
    });

    // iterated though the every object returned to make sure it is populated with data of a chosen type
    it('Then every user object returned should be populated with valid data', () => {
      cy.request(getUsersEndpoint).should((response) => {
        expect(response.status).eq(200);
        Cypress._.each(response.body.data, (user) => {
          expect(user.id).to.be.a('number').and.to.not.be.null.and.to.not.be
            .undefined;
          expect(user.name).to.be.a('string').and.to.not.be.null.and.to.not.be
            .undefined;
          expect(user.email).to.be.a('string').and.to.not.be.null.and.to.not.be
            .undefined;
          expect(user.email).to.include('@');
          expect(user.gender).to.be.a('string').and.to.not.be.null.and.to.not.be
            .undefined;
          expect(user.gender).to.be.oneOf(['male', 'female']);
          expect(user.status).to.be.a('string').and.to.not.be.null.and.to.not.be
            .undefined;
          expect(user.status).to.be.oneOf(['active', 'inactive']);
        });
      });
    });
  });
});
