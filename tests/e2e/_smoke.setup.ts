import { test, expect } from '@playwright/test';

test.beforeAll(async ({ request, baseURL }) => {
  const res = await request.get(`${baseURL}/__ready.txt`);
  expect(res.ok()).toBeTruthy();
  expect(await res.text()).toBe('OK');
});
