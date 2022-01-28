// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add("login", (email, password) => {
  cy.visit("/");
  cy.get(".email")
    .type(email)
    .should("have.value", email);
  cy.get(".password")
    .type(password)
    .should("have.value", password);
  cy.get("input[type=checkbox]").check();
  cy.get(".submitButton").click();
});

Cypress.Commands.add("deleteDrug", () => {
  cy.get("#Search-Input").type("new");
  cy.get(".card-title")
    .contains("new drug")
    .click();
  cy.get(".card-body")
    .contains("habesha")
    .get(".bi-trash")
    .first()
    .click();
  cy.contains("ARE YOU SURE?")
    .get("#Sure-Delet")
    .click();
});

Cypress.Commands.add("createDrug", () => {
  cy.get("#add-button").click();
  cy.get(".show").contains("Add Drug");
  cy.get("#Add-Drug-Input")
    .type("new drug")
    .should("have.value", "new drug");
  cy.get("#Add-Price")
    .type(100)
    .should("have.value", 100);
  cy.get("#Add-Amount")
    .type(12)
    .should("have.value", 12);
  cy.get("input[type=checkbox]").check({ force: true });
  cy.get("#Add-Desc").type("Will cure your death");
  cy.get("#Add-Brand")
    .type("habesha")
    .should("have.value", "habesha");
  cy.get("#Add-Origin")
    .type("eth")
    .should("have.value", "eth");
  cy.get("#Create-Btn").click();
  cy.get(".text-success").contains(
    "Congratulation, The Drug Has been Added to your"
  );
  cy.get("#Cancel-Btn").click();
});
