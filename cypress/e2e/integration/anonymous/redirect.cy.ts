describe("redirect", () => {
  it("redirects to the sign in page if user is not logged in", () => {
    cy.visit("/");
    cy.url().should("include", "/signin");
  });
});
