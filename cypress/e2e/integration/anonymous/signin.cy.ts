describe("signin", () => {
  it("opens sign in page", () => {
    cy.visit("/signin");
    cy.visit("/signup");
    cy.contains("sign in").click();
    cy.url().should("include", "/signin");
  });

  const clearAllFields = () => {
    cy.get("input[type=text]").clear();
    cy.get("input[type=password]").clear();
  };

  const clickSignInButton = () => cy.get("button").contains("Sign in").click();

  it("displays an error when trying to sign in with empty fields", () => {
    clickSignInButton();
    cy.contains("Please enter a username and password");

    cy.get("input[type=text]").type("test");
    clickSignInButton();
    cy.contains("Please enter a username and password");
    clearAllFields();

    cy.get("input[type=password]").type("test");
    clickSignInButton();
    cy.contains("Please enter a username and password");
    clearAllFields();
  });

  it("displays an error when trying to login with incorrect data", () => {
    cy.get("input[type=text]").type("test");
    cy.get("input[type=password]").type("test");
    clickSignInButton();
    cy.contains("Incorrect username or password");
    clearAllFields();
  });

  it("signs in with correct data", () => {
    cy.get("input[type=text]").type("jerma985");
    cy.get("input[type=password]").type("jerma985");
    clickSignInButton();
    cy.url().should("eq", Cypress.config().baseUrl + "/");
    cy.getCookie("access_token").should("exist");
  });
});
