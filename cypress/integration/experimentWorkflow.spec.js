describe('Experiment Workflow', () => {
  beforeEach(() => {
    cy.login('testuser@example.com', 'password123');
  });

  it('creates, edits, and shares an experiment', () => {
    // Δημιουργία πειράματος
    cy.visit('/experiments');
    cy.get('button').contains('Νέο Πείραμα').click();
    cy.get('input[name="experimentName"]').type('Test Experiment');
    cy.get('textarea[name="experimentDescription"]').type('This is a test experiment');
    cy.get('button').contains('Δημιουργία').click();

    // Επεξεργασία πειράματος
    cy.get('table').contains('Test Experiment').parent().find('button').contains('Επεξεργασία').click();
    cy.get('input[name="experimentName"]').clear().type('Updated Test Experiment');
    cy.get('button').contains('Αποθήκευση').click();

    // Κοινοποίηση πειράματος
    cy.get('table').contains('Updated Test Experiment').parent().find('button').contains('Κοινοποίηση').click();
    cy.get('input[name="shareEmail"]').type('collaborator@example.com');
    cy.get('select[name="permissions"]').select('edit');
    cy.get('button').contains('Κοινοποίηση').click();

    // Επαλήθευση
    cy.get('div').contains('Το πείραμα κοινοποιήθηκε επιτυχώς').should('be.visible');
    cy.get('table').contains('Updated Test Experiment').should('be.visible');
  });
});
