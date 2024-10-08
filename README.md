# Sky Mobile AutoPiggyRoll

Automatically roll data back from your Sky Mobile Piggybank to your SIM cards when their remaining data allowance runs low. For each SIM card in your Sky account, if the remaining allowance gets below a certain threshold, it will roll an amount of data back to that SIM.

## Setup

Copy `.env.example` to `.env` and set configuration values:

* `USERNAME` - Your Sky username
* `PASSWORD` - Your Sky password
* `GB_TO_ROLL` - The number of gigabytes to roll when the balance is below the threshold
* `MIN_GB_BEFORE_ROLLING` - The minimum amount of data a SIM card must have remaining before rolling

## Usage with Node

Using Node 20 (may work on other versions, untested) - `npm install`

Configuration values from `.env` are used when running.

`npx playwright test`

## Usage with Docker

Pull the image from Docker Hub:

`docker pull ultrafez/sky-mobile-autopiggyroll`

Run the image:

This assumes that you have a `.env` file in the current directory

`docker run --rm --env-file .env ultrafez/sky-mobile-autopiggyroll`

## Development

Utilises the Playwright automation test framework to screenscrape the Sky website using Chromium to get SIM card data balances, and roll data back to each SIM if needed.

Follows a standard Playwright project as generated by the Playwright npm init script.

Checking balances and rolling where required is all performed as a single "test case".

### Versioning strategy

Keeping it simple for the moment and just publishing a `latest` Docker tag whenever I push a change.

## Aspirations

* Run periodically on cloud infra (for my personal use)
* Make easy for others to run on their own/cloud infra (for their personal use)

## Limitations

* This runs against a single Sky account
* This will roll data for all SIM cards in your account - it isn't possible to roll data for a specific SIM card
* You can't set different threshold and roll amounts per SIM card - it's one config setting for all SIMs.
* It's a bit slow. It automates a browser performing these actions as it was faster than me reverse-engineering the API calls for it.
