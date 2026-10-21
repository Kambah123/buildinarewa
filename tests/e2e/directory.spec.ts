import {expect, test} from '@playwright/test';

test('visitor can browse the seed directory and open a listing', async ({page}) => {
  await page.goto('/en/products');
  await expect(page.getByRole('heading', {name: 'The directory'})).toBeVisible();
  await page.getByPlaceholder('Search products, states, categories or alternatives').fill('Zipa');
  await expect(page.getByRole('heading', {name: 'Zipa'})).toBeVisible();
  await page.getByRole('link', {name: /View product/i}).first().click();
  await expect(page.getByRole('heading', {name: 'Zipa'})).toBeVisible();
});

test('visitor can switch to Hausa', async ({page}) => {
  await page.goto('/en');
  await page.getByRole('link', {name: 'HA'}).click();
  await expect(page).toHaveURL(/\/ha$/);
  await expect(page.getByText('Gano manhajojin da')).toBeVisible();
});

test('a signed-out visitor is asked to sign in before submitting', async ({page}) => {
  await page.goto('/en/submit');
  await expect(page.getByRole('heading', {name: 'Sign in to submit'})).toBeVisible();
});

test('visitor can read a story and find an alternative page', async ({page}) => {
  await page.goto('/en/stories');
  await page.getByRole('link', {name: /A directory starts by making room/i}).click();
  await expect(page.getByRole('heading', {name: 'A directory starts by making room'})).toBeVisible();
  await page.goto('/en/alternatives/shopify');
  await expect(page.getByRole('heading', {name: 'Alternatives to shopify'})).toBeVisible();
});

test('visitor can open the newsletter subscription page', async ({page}) => {
  await page.goto('/en/newsletter');
  await expect(page.getByRole('heading', {name: 'Keep up with what Arewa is building.'})).toBeVisible();
  await expect(page.getByLabel('Email address')).toBeVisible();
});
