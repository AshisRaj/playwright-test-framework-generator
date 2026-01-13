import { expect, test } from '@fixtures';

test.describe('sauceDemo Inventory Tests', () => {
  test('add items to cart', { tag: ['@smoke', '@regression'] }, async ({ page, inventoryPage }) => {
    await test.step('Navigate to dashboard', async () => {
      await inventoryPage.navigation.goToInventoryPage();
      await expect(page.getByText('Products')).toBeVisible();
    });

    await test.step('Add an item to cart', async () => {
      await inventoryPage.actions.clickAddToCartButton('sauce-labs-backpack'); // Use specific item ID
    });

    await test.step('Verify cart count is 1', async () => {
      const cartBadge = inventoryPage.elements.visualElements.cartBadge();
      await expect(cartBadge).toBeVisible();
      await expect(cartBadge).toHaveText('1');
    });
  });

  test(
    'remove items from cart',
    { tag: ['@smoke', '@regression'] },
    async ({ page, inventoryPage }) => {
      await test.step('Navigate to dashboard', async () => {
        await inventoryPage.navigation.goToInventoryPage();
        await expect(page.getByText('Products')).toBeVisible();
      });

      await test.step('Add an item to cart', async () => {
        await inventoryPage.actions.clickAddToCartButton('sauce-labs-backpack'); // Use specific item ID
      });

      await test.step('Remove item from cart', async () => {
        await inventoryPage.actions.clickRemoveFromCartButton('sauce-labs-backpack'); // Use specific item ID
      });

      await test.step('Verify cart is empty', async () => {
        const cartBadge = inventoryPage.elements.visualElements.cartBadge();
        await expect(cartBadge).toBeHidden(); // Validate the absence of the cart badge
      });
    },
  );
});
