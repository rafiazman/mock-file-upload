# File Upload UI

This is a mock file upload UI prototyped with the Next.js framework.

## Run

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## FAQ

What did you choose to mock the API and why?
```
MSW was chosen as it is a relatively mature library and
importantly as Next.js was used here, it offers the ability to be
executed server-side or client-side.
```

If you used an AI tool, what parts did it help with?
```
ChatGPT was used to quickly prototype the UI with the code output
manually reviewed and minor corrections made (for e.g some of the syntax
provided was out of date when integrating with Next.js)
```

What tradeoffs or shortcuts did you take?
```
I opted to implement the functionality as soon as possible and
tried to demonstrate sensible code structuring. Testing was conducted
manually live instead of writing up Jest/Cypress/Playwright/RTL tests.
```

What would you improve or add with more time?
```
I would add Jest/Cypress/RTL tests to verify requirements.
```

What was the trickiest part and how did you debug it?
```
The trickiest part to me during this task was setting things
up my dev environment first time on a Windows machine as I typically
develop on a *nix machine and was expecting a VSCode test link to be sent.
```