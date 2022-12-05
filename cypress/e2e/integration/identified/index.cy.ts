describe("identified user app actions", () => {
  const signIn = () => {
    cy.clearCookies();
    cy.visit("/signin");
    cy.get("input[type=text]").type("jerma985");
    cy.get("input[type=password]").type("jerma985");
    cy.get("button").contains("Sign in").click();
  };

  const searchForUser = (username: string) => {
    cy.get("#search-bar").should("exist");
    cy.get("form input").type(username);
    cy.get("form a").click();
    cy.get("#main").should("not.exist");
    cy.get("#search").should("exist");
  };

  const returnFromSearch = () => {
    cy.get("#search-bar button").click();
    cy.get("#main").should("exist");
  };

  const existingUsername = "wankeriner";
  const fakeUsername = "randomtextfortesting";

  const openChatFromPreview = (username: string) => {
    cy.get("#main").should("exist");
    cy.contains(username).click();

    cy.get("#chat").should("exist");
    cy.get("#chat-messages").should("exist");
    cy.get("#chat-messages ul").children().should("have.length.at.least", 1);
    cy.get("#chat-message-options").should("exist");
  };

  it("shows chat previews", () => {
    signIn();
    cy.get("#main").children().should("have.length.at.least", 1);
  });

  it("does not let searching with empty input", () => {
    signIn();
    cy.get("#search-bar").should("exist");

    cy.get("input[type=text]").type("{enter}");
    cy.get("#search").should("not.exist");
    cy.get("#main").should("exist");

    cy.get("form a").click();
    cy.get("#search").should("not.exist");
    cy.get("#main").should("exist");
  });

  it("searches for non-existing user", () => {
    signIn();
    searchForUser(fakeUsername);
    cy.get("#search ul").children().should("have.length", 0);
    returnFromSearch();
  });

  it("searches for existing user", () => {
    signIn();
    searchForUser(existingUsername);
    cy.get("#search ul")
      .children()
      .should("have.length.at.least", 1)
      .first()
      .should("contain", existingUsername);
    returnFromSearch();
  });

  it("opens chat via searching for existing user", () => {
    signIn();
    searchForUser(existingUsername);
    cy.contains(existingUsername).click();

    cy.get("#chat").should("exist");
    cy.contains(existingUsername).should("exist");
    cy.get("#chat-messages").should("exist");
    cy.get("#chat-messages ul").children().should("have.length.at.least", 1);
    cy.get("#chat-message-options").should("exist");

    cy.contains("Back").click();
    cy.get("#chat").should("not.exist");
    cy.get("#main").should("exist");
  });

  it("opens chat via clicking on chat preview", () => {
    signIn();
    openChatFromPreview(existingUsername);

    cy.contains("Back").click();
    cy.get("#chat").should("not.exist");
    cy.get("#main").should("exist");
  });

  it("sends message in chat", () => {
    signIn();
    openChatFromPreview(existingUsername);

    cy.get("#chat-message-options")
      .children()
      .first()
      .find("div div p")
      .then((message) => {
        cy.get("#chat-message-options").children().first().click();
        cy.get("#chat-messages")
          .children()
          .last()
          .should("contain", message.text());
      });
  });

  it("tries to send locked message in chat", () => {
    signIn();
    openChatFromPreview(existingUsername);

    cy.get("#chat-messages")
      .children()
      .then((messages) => {
        const initialCount = messages.length;
        cy.get("#chat-message-options").children().last().click();
        cy.get("#chat-messages").should("have.length", initialCount);
      });
  });

  it("signs out", () => {
    signIn();
    cy.get("#search-bar div button").click();
    cy.contains("Sign out").click();
    cy.url().should("include", "/signin");
    cy.getCookie("access_token").should("not.exist");
  });
});
export {}