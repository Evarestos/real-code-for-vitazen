describe('User Journey', () => {
  it('allows a user to register, login, and create a program', () => {
    // Εγγραφή
    cy.visit('/register');
    cy.get('input[name="username"]').type('testuser');
    cy.get('input[name="email"]').type('testuser@example.com');
    cy.get('input[name="password"]').type('password123');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/dashboard');

    // Αποσύνδεση
    cy.get('button').contains('Αποσύνδεση').click();
    cy.url().should('include', '/login');

    // Σύνδεση
    cy.get('input[name="email"]').type('testuser@example.com');
    cy.get('input[name="password"]').type('password123');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/dashboard');

    // Δημιουργία προγράμματος
    cy.get('button').contains('Νέο Πρόγραμμα').click();
    cy.get('input[name="programName"]').type('Πρόγραμμα Άσκησης');
    cy.get('textarea[name="programDescription"]').type('Ένα εβδομαδιαίο πρόγραμμα άσκησης');
    cy.get('button').contains('Αποθήκευση').click();
    cy.contains('Πρόγραμμα Άσκησης').should('be.visible');
  });
});
