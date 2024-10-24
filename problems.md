# Some unsolved problems with this boilerplate

- [x] Unable to run tests with `wrapito` due to incompatibilities with `vitest` and the way `wrapito` was designed.
      The problem arises because `wrapito` uses Jest's mocking capabilities, they are also part of `vitest` but the namespaces are different.
      A possible solution to this will be to migrate `wrapito` to `vite` and `vitest`. Some advantages to do that will be:
  - TS support without `babel`, `ts-jest`, etc.
  - Compatibility with this boilerplate.
  - Less dependencies.
    Of course, we must consider the disadvantages too, they are:
  - We will break all our projects using `wrapito`. (easily solvable by releasing `wrapito@next` or similar)
  - Migration could take some time because we need to understand how to integrate it with `vitest`.(As far as API goes it's identical to `Jest`)
- [] We must upgrade to, at least, Node v16
- [] "Weird" import syntax. (We may need to tune `alias` property in `vite.config.ts`)

## TODO

- [x] Do testing using HttpClient
