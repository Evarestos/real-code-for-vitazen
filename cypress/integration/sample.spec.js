describe('Sample Test', () => {
  it('Visits the app', () => {
    cy.visit('/');
    cy.contains('Wellness App').should('exist');
  });
});
