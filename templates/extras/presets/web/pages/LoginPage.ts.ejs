import { BasePage } from '@pages';
import { Page } from '@playwright/test';

export class LoginPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // Define page elements
  elements = {
    actionElements: {
      submitButton: () => this.getByRole('button', { name: 'Login' }),
    },

    inputElements: {
      userName: () => this.getByRole('textbox', { name: 'Username' }),
      password: () => this.getByRole('textbox', { name: 'Password' }),
    },

    visualElements: {
      pageTitle: () => this.getByText('Swag Labs'),
    },
  };

  // Define page actions

  actions = {
    fillUserName: async (userName: string): Promise<void> => {
      const usernameField = this.elements.inputElements.userName();
      await this.fill(usernameField, userName);
    },

    fillPassword: async (password: string): Promise<void> => {
      const passwordField = this.elements.inputElements.password();
      await this.fill(passwordField, password);
    },

    clickSubmitButton: async (): Promise<void> => {
      const button = this.elements.actionElements.submitButton();
      await this.click(button);
    },
  };

  async login(username: string, password: string): Promise<void> {
    // Wait for the post-login URL change & click in one step to avoid races
    await Promise.all([
      (async () => {
        await this.actions.fillUserName(username);
        await this.actions.fillPassword(password);
        await this.actions.clickSubmitButton();
      })(),
    ]);
  }

  // Define page navigation
  navigation = {
    goToLoginPage: async (): Promise<void> => {
      await this.navigateTo(process.env.APP_BASE_URL || 'https://www.saucedemo.com/');
    },

    goToInventoryPage: async (): Promise<void> => {
      await this.navigateTo(
        process.env.APP_BASE_URL
          ? `${process.env.APP_BASE_URL}inventory.html`
          : 'https://www.saucedemo.com/inventory.html',
      );
    },
  };
}
