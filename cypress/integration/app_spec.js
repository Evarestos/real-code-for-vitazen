describe('Wellness App', () => {
  it('Loads the dashboard', () => {
    cy.visit('/');
    cy.contains('Welcome');
    cy.get('[data-testid="weekly-schedule"]').should('be.visible');
    cy.get('[data-testid="meal-plan"]').should('be.visible');
    cy.get('[data-testid="progress-tracker"]').should('be.visible');
    cy.get('[data-testid="ai-assistant"]').should('be.visible');
  });

  it('Interacts with AI Assistant', () => {
    cy.visit('/');
    cy.get('[data-testid="ai-assistant-input"]').type('Hello AI');
    cy.get('[data-testid="ai-assistant-send"]').click();
    cy.get('[data-testid="ai-assistant-response"]').should('be.visible');
  });
});
