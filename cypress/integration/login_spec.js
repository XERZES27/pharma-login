/// <reference types="Cypress" />

describe("Login page test", () => {
  beforeEach(function() {
    cy.visit("/");
    cy.get(".password").clear();
    cy.get(".email").clear();
    cy.get("input[type=checkbox]").uncheck();
  });
  it("Is login page", () => {
    cy.contains("Email:");
  });

  it("short password", () => {
    cy.get(".email")
      .type("wrongemail@gmail.com")
      .should("have.value", "wrongemail@gmail.com");
    cy.get(".password")
      .type("shortp")
      .should("have.value", "shortp");
    cy.get("input[type=checkbox]").check();
    cy.get(".showpassword").click();
    cy.get(".showpassword").click();
    cy.get(".submitButton").click();

    cy.get(".error").contains("Password must contain 8 characters");

    // cy.url().should("include", "/commands/actions");
  });

  it("wrong email", () => {
    cy.get(".email")
      .type("wrongemail@gmail.com")
      .should("have.value", "wrongemail@gmail.com");
    cy.get(".password")
      .type("dafdsfdD2%")
      .should("have.value", "dafdsfdD2%");
    cy.get("input[type=checkbox]").check();
    cy.get(".submitButton").click();
    cy.get(".error").contains(
      "This Email Is Not Attached To A Verified Account"
    );
  });
  it("unchecked field", () => {
    cy.get(".email")
      .type("sibtesh@gmail.com")
      .should("have.value", "sibtesh@gmail.com");
    cy.get(".password")
      .type("dafdsfdD2%")
      .should("have.value", "dafdsfdD2%");
    cy.get(".submitButton").click();
    cy.get(".error").contains("Field is Required");
  });
  it("correct login", () => {
    cy.get(".email")
      .type("sibtesh@gmail.com")
      .should("have.value", "sibtesh@gmail.com");
    cy.get(".password")
      .type("dafdsfdD2%")
      .should("have.value", "dafdsfdD2%");
    cy.get("input[type=checkbox]").check();
    cy.get(".submitButton").click();
  });
});
