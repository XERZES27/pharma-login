/// <reference types="Cypress" />
describe("Home page", () => {
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
    cy.visit("/inventory");
    // cy.get(".email")
    //   .type("sibtesh@gmail.com")
    //   .should("have.value", "sibtesh@gmail.com");
    // cy.get(".password")
    //   .type("dafdsfdD2%")
    //   .should("have.value", "dafdsfdD2%");
    // cy.get("input[type=checkbox]").check();
    // cy.get(".submitButton").click();
    // cy.login("sibtesh@gmail.com", "dafdsfdD2%");
    // setCookie("machineId", machineId, {
    //   samesite: "strict",
    //   "Max-Age": `${maxAge}`,
    // });
  });

  //   it("set cookie", () => {
  //     // https://on.cypress.io/clearcookie
  //     window.localStorage.setItem(
  //       "token",
  //       "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MTMzNDQzZGFjOTVjNjQ1YjQ5ZTQyODIiLCJtYWNoaW5lSWRzIjpbIjA2OWE1ODliLWE1ZTMtNGVhZi04NWQ1LWJkOTEwNjBkMmU4YiIsIjNmMWZjNjlmLTIxYmYtNGNiYi05N2JjLTQ4ZDhhMDQ2OWFmYyJdLCJlbWFpbCI6Im1pbGt5d29yazk5QGdtYWlsLmNvbSIsImhhc1Byb2ZpbGUiOnRydWUsInBoYXJtYWN5SWQiOiI2MTM1ZjJlZjFkY2MzMDU0Zjg0NDcyMmYiLCJpYXQiOjE2NDMyMTEyNDUsImV4cCI6MTY0MzI5NzY0NX0.n8DHXcoizyaZhC8XhQmW8egYyqtb70CSx1wV1ZTOIVM"
  //     );
  //     window.sessionStorage.setItem("hasProfile", "true");
  //     window.sessionStorage.setItem("tokenIsValid", "true");
  //     window.sessionStorage.setItem("deviceIsKnow", "true");
  //     window.sessionStorage.setItem("id", "6133443dac95c645b49e4282");
  //     window.sessionStorage.setItem("lastUrl", "InventoryHome");
  //     // cy.setLocalStorage("accessToken", "body.accessToken");
  //     cy.visit("/inventory");
  //   });
  it("add drug", () => {
    cy.get("#add-button").click();
    cy.contains("Add Drug");
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

  it("add existing drug", () => {
    cy.get("#add-button").click();
    cy.contains("Add Drug");
    cy.get("#Add-Drug-Input")
      .type("existing drug")
      .should("have.value", "existing drug");
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
    // Enter drug again
    cy.visit("/inventory");
    cy.get("#add-button")
      .scrollIntoView()
      .click({ force: true });
    cy.contains("Add Drug");
    cy.get("#Add-Drug-Input")
      .type("existing drug")
      .should("have.value", "existing drug");
    cy.get("#Add-Price")
      .type(100)
      .should("have.value", 100);
    cy.get("#Add-Amount")
      .type(30)
      .should("have.value", 30);
    cy.get("input[type=checkbox]").check({ force: true });
    cy.get("#Add-Desc").type("Will cure your death");
    cy.get("#Add-Brand")
      .type("habesha")
      .should("have.value", "habesha");
    cy.get("#Add-Origin")
      .type("eth")
      .should("have.value", "eth");
    cy.get("#Create-Btn").click();
    cy.contains("This Drug Already Exists In Your Database");
    cy.wait(2000);
    cy.get("#Cancel-Btn").click();
  });

  it("Delete drug", () => {
    cy.createDrug();
    cy.wait(1000);
    cy.get("#Search-Input").type("new");
    cy.get(".card-title")
      .contains("new drug")
      .click();
    cy.get(".card-body")
      .contains("habesha")
      .get(".bi-trash")
      .first()
      .click();
    cy.wait(1000);
    cy.contains("ARE YOU SURE?")
      .get("#Sure-Delet")
      .click();
  });

  it("Edit drug", () => {
    // cy.createDrug();
    cy.get("#Search-Input").type("new");
    cy.get(".card-title")
      .contains("new drug")
      .click();
    cy.get("#Search-Input").clear();
    cy.get("#Search-Input").type("new");
    cy.get(".card-title")
      .contains("new drug")
      .click();
    cy.get("#expandButton").click();
    cy.get(".bi-pen")
      .first()
      .click({ scrollBehavior: "center" });
    cy.get("#Edit-Price").clear();
    cy.get("#Edit-Price").type(Math.floor(Math.random() * 1001) + 20);
    cy.get("#Edit-Amount").clear();
    cy.get("#Edit-Amount").type(Math.floor(Math.random() * 100) + 1);
    cy.get(".btn-success").click();
  });

  it.only("Upload drugs excel", () => {
    cy.get("#upload-button").click();
    cy.wait(500);
    cy.get("input[type=file]").selectFile(
      "cypress/fixtures/DrugInventoryForm.xlsx",
      {
        force: true,
      }
    );
  });
});
