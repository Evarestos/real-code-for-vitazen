describe('Accessibility Tests', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.injectAxe();
  });

  it('Has no detectable accessibility violations on load', () => {
    cy.checkA11y();
  });

  it('Has no detectable accessibility violations on the login page', () => {
    cy.visit('/login');
    cy.checkA11y();
  });

  it('Has no detectable accessibility violations on the dashboard', () => {
    // Υποθέτουμε ότι έχουμε ήδη συνδεθεί
    cy.login('testuser@example.com', 'password123');
    cy.visit('/dashboard');
    cy.checkA11y();
  });
});
