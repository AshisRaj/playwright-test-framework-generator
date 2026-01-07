import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['tests/**/*.spec.ts'], // ✅ explicitly include test specs
    exclude: ['node_modules', 'dist'], // optional
    testTimeout: 120_000, // allow scaffold runs
    hookTimeout: 120_000,
    reporters: ['html', 'default'], // you can also add 'junit' etc.
    globals: true, // optional, if using expect without imports
  },
});
