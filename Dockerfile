FROM mcr.microsoft.com/playwright:v1.47.2-noble

WORKDIR /code

# Install deps
COPY package.json package-lock.json /code
RUN npm ci

# Copy app code
COPY playwright.config.ts /code/
COPY tests/ /code/tests/

ENV CI=true

ENTRYPOINT ["/code/node_modules/.bin/playwright", "test"]
