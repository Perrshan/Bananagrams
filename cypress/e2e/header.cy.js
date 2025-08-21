describe('Homepage Test', () => {
    beforeEach(() => {
      
      cy.visit('/') 
    });

    it('Check Header', () => {
      // Replace '.your-element-selector' with an actual CSS selector
      // of an element that should be present on your homepage.
      cy.get('#header').should('be.visible');
    });

    it('Check Welcome Message', () => {
      // Replace '.your-element-selector' with an actual CSS selector
      // of an element that should be present on your homepage.
      cy.get('#welcome').should('be.visible').should('contain', 'Welcome to the Bananagrams game!'); 
    });
  }); 