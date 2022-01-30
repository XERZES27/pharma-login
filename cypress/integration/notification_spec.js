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
  it("Restock drug", () => {
    cy.get("button")
      .get("#Restock-Input")
      //   .should("have.class", ".me-2")
      .clear({ force: true });
    cy.wait(200);
    cy.get("button")
      .get("#Restock-Input")
      //   .should("have.class", ".me-2")
      .type(Math.floor(Math.random() * 100) + 1, { force: true });
    cy.wait(400);
    cy.get("#Restock-Btn").click();
    cy.wait(400);
    cy.get("h5").contains("ARE YOU SURE?");
    cy.get(".btn-success")
      .contains("RESTOCK")
      .click();
  });

  it("Submit Request", () => {
    cy.get("label")
      .contains("REQUESTS")
      .click();
    cy.get(".submitADrug")
      .contains("SUBMIT A DRUG")
      .click();
    cy.get(".searchDrugInputForSubmit").clear();
    cy.get(".searchDrugInputForSubmit").type("chl");
    cy.get(".card-title")
      .first()
      .click({ force: true });
    cy.get(".submitDrugToRequestButton").click();
  });

  it("Decline Submitted Request", () => {
    cy.get("label")
      .contains("REQUESTS")
      .click();
    cy.get(".declineRequestButton")
      .first()
      .click();
    cy.get(".declineReplyBox").clear();
    cy.get(".declineReplyBox").type("Some reason");
    cy.contains("Submit Decline").click();
    cy.get(".confirmDeclineRequestButton").click();
  });

  it.only("Delete decline", () => {
    cy.get("label")
      .contains("REQUESTS")
      .click();
    cy.get(".deleteRequestDeclineButton")
      .first()
      .click();
    cy.wait(500);
    cy.get(".confirmDeleteDeclineRequestButton").click();
    cy.wait(500);
    cy.scrollTo("top");
  });
});
