describe('Usability Tests', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('Should navigate through main pages', () => {
    cy.get('a[href="/login"]').click();
    cy.url().should('include', '/login');
    cy.get('a[href="/register"]').click();
    cy.url().should('include', '/register');
  });

  it('Should register a new user', () => {
    cy.visit('/register');
    cy.get('input[name="username"]').type('newuser');
    cy.get('input[name="email"]').type('newuser@example.com');
    cy.get('input[name="password"]').type('password123');
    cy.get('input[name="confirmPassword"]').type('password123');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/dashboard');
  });

  it('Should login and access dashboard', () => {
    cy.visit('/login');
    cy.get('input[name="email"]').type('newuser@example.com');
    cy.get('input[name="password"]').type('password123');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/dashboard');
    cy.contains('Καλώς ήρθες').should('be.visible');
  });

  it('Should create and edit a personal program', () => {
    cy.login('testuser@example.com', 'password123');
    cy.visit('/programs');
    cy.get('[data-testid="create-program-button"]').click();
    cy.get('[data-testid="program-name-input"]').type('My New Program');
    cy.get('[data-testid="program-description-input"]').type('This is a test program');
    cy.get('[data-testid="save-program-button"]').click();
    cy.contains('My New Program').should('be.visible');
    
    cy.contains('My New Program').click();
    cy.get('[data-testid="edit-program-button"]').click();
    cy.get('[data-testid="program-name-input"]').clear().type('Updated Program');
    cy.get('[data-testid="save-program-button"]').click();
    cy.contains('Updated Program').should('be.visible');
  });

  it('Should interact with AI Assistant', () => {
    cy.login('testuser@example.com', 'password123');
    cy.visit('/ai-assistant');
    cy.get('[data-testid="ai-input"]').type('How can I improve my diet?');
    cy.get('[data-testid="ai-submit-button"]').click();
    cy.get('[data-testid="ai-response"]').should('be.visible');
  });
});
