If you wish to contribute then make sure to follow these steps (note that we use [Yarn classic](https://classic.yarnpkg.com/lang/en/docs/install/#windows-stable) in this project):

Install [pnpm](https://pnpm.io/installation) globally or run it through `npx pnpm` since it is used in all `package.json` scripts

```sh
# step 1, install with npm install from the oort
pnpm install

# step 2, run in dev and test your code change
pnpm run start

# step 3.a, build plugin (lib)
pnpm run build

# step 3.b, optional website build as well
pnpm run build:demo

# step 4, to test the E2E tests with Cypress the E2E tests
pnpm run cypress:open # open Cypress UI then click on "Run All Specs" or choose dedicated Example to test
```
