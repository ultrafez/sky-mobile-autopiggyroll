import { test, expect } from "@playwright/test";

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
    await page.locator('[data-test-id="roll-data-button"]').click();
    await page.getByLabel("Roll more data").click();
}

type SimSummary = { name: string; number: string; remainingGb: number };
async function getDataBalanceForAllSims(page): Promise<SimSummary[]> {
    await page.goto("https://www.sky.com/productsettings/mobile");
    const simsDataRemaining = await page
        .locator('[data-test-id="sim-tile-container"]')
        .evaluateAll((sims) => {
            const returnSims = sims.map((simContainer) => {
                const nameEl = simContainer.querySelector(
                    '[data-test-id^="sim-card-heading-"]'
                );
                const name = nameEl ? nameEl.innerText : null;
                const numberEl = simContainer.querySelector(
                    '[data-test-id="text-sim-tile-body"] > div > p'
                );
                const number = numberEl ? numberEl.innerText : null;
                const remainingEl = simContainer.querySelector(
                    '[data-test-id^="data-usage-amount-sim-"]'
                );
                const remaining = remainingEl ? remainingEl.innerHTML : null;
                const remainingGb = remaining.endsWith("GB")
                    ? parseFloat(remaining.slice(0, -2))
                    : null;
                return { name, number, remainingGb };
            });
            return returnSims;
        });

    return simsDataRemaining;
}

// test("roll data to one SIM", async ({ page }) => {
//     const skyUsername = process.env.USERNAME;
//     const skyPassword = process.env.PASSWORD;
//     const simName = process.env.SIMNAME;
//     const rollGigabytes = parseInt(process.env.NUMGBTOROLL ?? "1", 10);

//     if (rollGigabytes < 1 || rollGigabytes > 5) {
//         console.log("Invalid number of gigabytes to roll");
//         expect(true).toBe(false);
//         return;
//     }

//     await login(page, skyUsername, skyPassword);
//     await rollBySim(page, simName, rollGigabytes);
// });

test("roll data for all low SIMs", async ({ page }) => {
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
    const sims = await getDataBalanceForAllSims(page);

    for (let i = 0; i < sims.length; i++) {
        const sim = sims[i];
        const simOptionName = `${sim.name} (${sim.number})`;
        if (sim.remainingGb < 2) {
            console.log(
                "Rolling data for " +
                    simOptionName +
                    " as balance is " +
                    sim.remainingGb
            );
            await rollBySim(page, simOptionName, rollGigabytes);
        } else {
            console.log(
                "Not rolling for " +
                    simOptionName +
                    " as balance is " +
                    sim.remainingGb
            );
        }
    }
});
