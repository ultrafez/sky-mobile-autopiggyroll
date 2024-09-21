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

async function rollBySim(page, simName, numGb) {
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
    const skyUsername = process.env.USERNAME;
    const skyPassword = process.env.PASSWORD;
    const simName = process.env.SIMNAME;
    const rollGigabytes = parseInt(process.env.NUMGBTOROLL ?? "1", 10);

    if (rollGigabytes < 1 || rollGigabytes > 5) {
        console.log("Invalid number of gigabytes to roll");
        expect(true).toBe(false);
        return;
    }

    await login(page, skyUsername, skyPassword);
    await rollBySim(page, simName, rollGigabytes);
});
