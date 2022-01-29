/// <reference types="Cypress" />
describe("Notifiaction Page", () => {
  function setCookie(name, value, options = {}) {
    options = {
      path: "/",
      // add other defaults here if necessary
      ...options,
    };

    if (options.expires instanceof Date) {
      options.expires = options.expires.toUTCString();
    }

    let updatedCookie =
      encodeURIComponent(name) + "=" + encodeURIComponent(value);

    for (let optionKey in options) {
      updatedCookie += "; " + optionKey;
      let optionValue = options[optionKey];
      if (optionValue !== true) {
        updatedCookie += "=" + optionValue;
      }
    }
    // console.log(updatedCookie)
    document.cookie = updatedCookie;
  }

  beforeEach(() => {
    // Cypress starts out with a blank slate for each test
    // so we must tell it to visit our website with the `cy.visit()` command.
    // Since we want to visit the same URL at the start of all our tests,
    // we include it in our beforeEach function so that it runs before each test
    // cy.login("sibtesh@gmail.com", "dafdsfdD2%");
    cy.visit("/notification");
  });
  it.only("Restock drug", () => {
    cy.get("button")
      .get("#Restock-Input")
      //   .should("have.class", ".me-2")
      .clear({ force: true });
    cy.wait(200);
    cy.get("button")
      .get("#Restock-Input")
      //   .should("have.class", ".me-2")
      .type(Math.floor(Math.random() * 100) + 1, { force: true });
    cy.get("#Restock-Btn").click();
    cy.get("h5").contains("ARE YOU SURE?");
    cy.get(".btn-success")
      .contains("RESTOCK")
      .click();
  });

  it("Reply to review", () => {
    // cy.get("#Reply-Btn").click();
    cy.get("#Reply-Btn").click();
    cy.scrollTo("top");
    cy.wait(1000);
    cy.get(".text-dark").type(
      "Response " + Math.floor(Math.random() * 100) + 1
    );
    cy.get("#Send-Btn").click();
  });

  it("Edit Reply to review", () => {
    // cy.get("#Reply-Btn").click();
    cy.get("#Edit-Reply-Btn").click();
    // cy.scrollTo("top");
    cy.wait(1000);
    cy.get(".text-dark").clear();
    cy.wait(1000);
    cy.get(".text-dark")
      .scrollIntoView()
      .type("Response " + Math.floor(Math.random() * 100) + 1);
    cy.wait(1000);
    cy.get("#Send-Btn")
      .scrollIntoView()
      .click();
  });
});
