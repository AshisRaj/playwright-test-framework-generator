import { expect, test } from '@fixtures';

test.describe('sauceDemo Cart Tests', () => {
  test(
    'navigate to cart',
    { tag: ['@smoke', '@regression'] },
    async ({ page, inventoryPage, cartPage }) => {
      await test.step('Navigate to dashboard', async () => {
        await inventoryPage.navigation.goToInventoryPage();
        await expect(page.getByText('Products')).toBeVisible();
      });

      await test.step('Add an item to cart', async () => {
        await inventoryPage.actions.clickAddToCartButton('sauce-labs-backpack'); // Use specific item ID
      });

      await test.step('Click on cart icon', async () => {
        await inventoryPage.actions.clickShoppingCartLink();
      });

      await test.step('Verify cart page is displayed', async () => {
        await expect(cartPage.elements.visualElements.cartTitle()).toBeVisible();
        await expect(cartPage.elements.visualElements.cartTitle()).toHaveText('Your Cart');
      });
    },
  );
});
