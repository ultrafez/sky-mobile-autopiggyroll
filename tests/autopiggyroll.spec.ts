import { test, expect } from "@playwright/test";

// test("logs in", async ({ page }) => {
//     await page.goto("https://www.sky.com/hub/mobile/piggybank");
// });

async function login(page, username, password) {
    await page.goto(
        "https://www.sky.com/signin?area=mysky&successUrl=https%3A%2F%2Fwww.sky.com%2Fhub%2Fmobile%2Fpiggybank"
    );
    await expect(page).toHaveTitle(/Sign in/);
    await page
        .locator('iframe[title="SP Consent Message"]')
        .contentFrame()
        .getByLabel("Accept all")
        .click();
    // await page
    //     .locator(
    //         'iframe[name^="__zoid__sign_in_iframe__"]'
    //     )
    //     .contentFrame()
    //     .getByTestId("AUTHN__INPUT")
    //     .click();
    await page
        .locator('iframe[name^="__zoid__sign_in_iframe__"]')
        .contentFrame()
        .getByTestId("AUTHN__INPUT")
        .fill(username);
    await page
        .locator('iframe[name^="__zoid__sign_in_iframe__"]')
        .contentFrame()
        .getByTestId("AUTHN__INPUT")
        .press("Enter");
    // await page
    //   .locator(
    //     'iframe[name^="__zoid__sign_in_iframe__"]'
    //   )
    //   .contentFrame()
    //   .getByTestId("PASSWORD__INPUT")
    //   .fill("");
    // await page
    //   .locator(
    //     'iframe[name^="__zoid__sign_in_iframe__"]'
    //   )
    //   .contentFrame()
    //   .getByTestId("PASSWORD__INPUT")
    //   .click();
    await page
        .locator('iframe[name^="__zoid__sign_in_iframe__"]')
        .contentFrame()
        .getByTestId("PASSWORD__INPUT")
        .fill(password);
    await page
        .locator('iframe[name^="__zoid__sign_in_iframe__"]')
        .contentFrame()
        .getByTestId("PASSWORD__INPUT")
        .press("Enter");

    // Verify the signin was successful
    await expect(page).toHaveTitle(/My Account/);
}

type RolloverGigabytes = 1 | 2 | 3 | 4 | 5;
async function rollBySim(page, simName, numGb: RolloverGigabytes) {
    await page
        .locator('[data-test-id="toolkit-select-input-dropdown"]')
        .selectOption({ label: simName });

    for (let i = 2; i <= numGb; i++) {
        await page.getByLabel(`Increase to ${i} GB`).click();
    }
    // await page.getByLabel("Increase to 2 GB").click();
    // await page.getByLabel("Increase to 3 GB").click();
    // await page.getByLabel("Increase to 4 GB").click();
    // await page.getByLabel("Increase to 5 GB").click();
    // await page.getByLabel("Decrease to 4 GB").click();
    // await page.getByLabel("Decrease to 3 GB").click();
    // await page.getByLabel("Decrease to 2 GB").click();
    // await page.getByLabel("Decrease to 1 GB").click();
    await page.locator('[data-test-id="roll-data-button"]').click();
    await page.getByLabel("Roll more data").click();
}

test("test", async ({ page }) => {
    const USERNAME = "placeholder";
    const PASSWORD = "";

    await login(page, USERNAME, PASSWORD);
    await rollBySim(page, "Me (07XXXXXXXXXXXXXX)", 1);
});
