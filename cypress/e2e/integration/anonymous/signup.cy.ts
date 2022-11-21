describe("signup", () => {
  it("opens sign up page", () => {
    cy.visit("/signup");
    cy.visit("/signin");
    cy.contains("sign up").click();
    cy.url().should("include", "/signup");
  });

  const clickSignUpButton = () => cy.get("button").contains("Sign up").click();
  const clearAllFields = () => {
    cy.get("input[type=text]").clear();
    cy.get("input[type=email]").clear();
    cy.get("input[type=password]").clear();
  };

  it("displays an error when trying to register with empty fields", () => {
    clickSignUpButton();
    cy.contains("Please fill the form");
    cy.get("input[type=text]").type("test");
    clickSignUpButton();
    cy.contains("Please fill the form");
    cy.get("input[type=email]").type("test");
    clickSignUpButton();
    cy.contains("Please fill the form");
    cy.get("input[type=text]").clear();
    cy.get("input[type=password]").type("test");
    clickSignUpButton();
    cy.contains("Please fill the form");
    clearAllFields();
  });

  it("displays an error when trying to register with existing username", () => {
    cy.get("input[type=text]").type("jerma985");
    cy.get("input[type=email]").type("test");
    cy.get("input[type=password]").type("test");
    clickSignUpButton();
    cy.contains("Username or email already exists");
    clearAllFields();
  });

  it("displays an error when trying to register with existing email", () => {
    cy.get("input[type=text]").type("test");
    cy.get("input[type=email]").type("jerma985@mail.com");
    cy.get("input[type=password]").type("test");
    clickSignUpButton();
    cy.contains("Username or email already exists");
    clearAllFields();
  });
});
