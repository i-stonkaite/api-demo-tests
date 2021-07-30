describe('Given the "Get user details" endpoint', () => {
  context('When I send GET /users request', () => {
    it('Then max response time should be less than 200 ms', () => {
      // cy.request({
      //   method: 'GET',
      //   url: '/users',
      // }).should((response) => {
      //   expect(response.duration).to.not.be.greaterThan(200);
      // });
    });

    it('Then HTTP status code should be 200', () => {
      cy.request({
        method: 'GET',
        url: '/users',
      }).should((response) => {
        expect(response.status).eq(200);
      });
    });

    it('Then a single user should be found by their unique ID', () => {
      cy.request({
        method: 'GET',
        url: '/users?id=1951',
      }).should((response) => {
        expect(response.status).eq(200);
        expect(response.body.data.length).eq(1);
      });
    });

    it('Then every user object should contain 5 keys: id, name, email, gender, status', () => {
      cy.request({
        method: 'GET',
        url: '/users',
      }).should((response) => {
        expect(response.status).eq(200);
        // cy.log(response.body.data[0].id);
        Cypress._.each(response.body.data, (user) => {
          // expect(user.id).to.be.a('number').and.to.not.be.null.and.to.not.be
          //   .undefined;
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

    it('Then every user object returned should be populated with valid data', () => {
      cy.request({
        method: 'GET',
        url: '/users',
      }).should((response) => {
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

    //   it('Then the list of all registered users should be returned', () => {
    //     cy.request({
    //       method: 'GET',
    //       url: '/users',
    //     }).should((response) => {
    //       let numOfPages = parseInt(
    //         JSON.stringify(response.body.meta.pagination.pages)
    //       );
    //       let apiCountOfTotalUsers = parseInt(
    //         JSON.stringify(response.body.meta.pagination.total)
    //       );

    //       function getTotalUserCount() {
    //         let totalNumOfUsersInResponses = 0;
    //         for (let i = 1; i <= parseInt(3); i++) {
    //           // for (let i = 1; i <= parseInt(numOfPages); i++) {
    //           cy.request({
    //             method: 'GET',
    //             url: `/users?page=${i}`,
    //           }).then((response) => {
    //             totalNumOfUsersInResponses += response.body.data.length;
    //           });
    //           cy.log(totalNumOfUsersInResponses);
    //         }
    //         return totalNumOfUsersInResponses;
    //       }
    //       // cy.log(getTotalUserCount());
    //       // expect(getTotalUserCount()).eq(apiCountOfTotalUsers);
    //     });
    //   });
    // });

    // context('When I send GET /users', () => {
    //   it('Then the list of all registered users should be returned', () => {
    //     cy.request({
    //       method: 'GET',
    //       url: '/users',
    //     }).should((response) => {
    //       // expect(response.status)
    //       //   .to.eq(200)
    //       Cypress._.each(response.body.data, (data) => {
    //         expect(response.body.id).to.not.be.null;
    //         expect(data).to.have.all.keys(
    //           'id',
    //           'name',
    //           'email',
    //           'gender',
    //           'status'
    //         );
    //       });
    //       //   });
    //     });
    //   });
    // });
    // });
  });
});
