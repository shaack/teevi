# Teevi

Tired of installing hundreds of dependencies just to run unit tests? Teevi is the essence of unit testing in JavaScript.

It allows unit testing of ES6 modules without additional dependencies, right in your browser. Teevi has almost the same syntax as Mocha with Chai but is a hundred times smaller. The whole framework is one file, `src/teevi.js`, with about 200 lines of plain ES6.

Demo: [http://shaack.com/projekte/teevi/test/](http://shaack.com/projekte/teevi/test/)

## Why Teevi

- **Zero dependencies.** Teevi has no dependencies, not even dev dependencies. Nothing to install, nothing to update, no `node_modules` with thousands of files.
- **No build step.** Tests are plain ES6 modules that run as they are. No bundler, no transpiler, no config file.
- **Runs in the browser.** Your code is tested in the environment it is written for, with a real DOM, real events and real timers.
- **Familiar syntax.** `describe`, `it` and `assert` work like in Mocha and Chai, so there is nothing new to learn.
- **Headless if you want.** The same tests run in headless Chrome for CI, see [Running tests headless](#running-tests-headless).

## Installation

Via npm:

```bash
npm install --save-dev teevi
```

In the browser, import it by path, for example `../node_modules/teevi/src/teevi.js`. Bundlers and Node resolve the bare specifier `teevi` through the `exports` field in `package.json`.

Or just copy `src/teevi.js` into your project. It is a single file without imports.

## Quick start

1. Create a test script, for example `test/MyTest.js`

```javascript
import {describe, it, assert} from "../node_modules/teevi/src/teevi.js"

describe("Teevi test demo", () => {
    it("will not fail", () => {
        assert.true(2 * 2 === 4)
    })
    it("will fail", () => {
        assert.equal(4 + 2, 42)
    })
})
```

2. Create a `test/index.html` that imports your test scripts and runs them

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Tests</title>
</head>
<body>
<script type="module">
    import {teevi} from "../node_modules/teevi/src/teevi.js"
    import "./MyTest.js"
    teevi.run()
</script>
</body>
</html>
```

3. Open `test/index.html` in your browser

Browsers do not load ES6 modules from `file://` URLs, so serve the project over http. Any static server will do, for example `npx serve` or the one built into your IDE.

![teevi](https://shaack.com/projekte/assets/img/teevi-test-demo.png?v=1)

## How it works

Importing a test script queues its tests. `describe()` runs its callback immediately, which calls `it()` for every test case, and `it()` pushes the test to an internal list. Nothing is executed yet.

`teevi.run()` then walks through that list and runs the tests one after the other. Every test is awaited, so an async test has finished before the next one starts. Results are rendered to `document.body` and mirrored to the browser console.

When all tests are done, Teevi appends a summary line to the page, green "All N tests passed" or red "N tests, X passed, Y failed", and `teevi.run()` resolves with `{total, passed, failed, skipped}`. While tests stream in, the viewport scrolls to the latest result, so long suites stay readable.

## API

### teevi.run(options)

Runs all queued tests and returns a Promise that resolves with `{total, passed, failed, skipped}` when the last test is done. `total` counts the tests that ran, skipped tests are not included. Calling it a second time logs a warning and returns the Promise of the first run instead of running everything twice.

| Option | Default | Meaning |
|---|---|---|
| `timeout` | `0` | Fail a test that takes longer than this many milliseconds. `0` disables the timeout. |

Without a timeout, an async test that never resolves blocks the whole run without any output. In CI it is a good idea to set one.

```javascript
const result = await teevi.run({timeout: 5000})
console.log(result.failed === 0 ? "green" : "red")
```

### describe(name, fn)

Groups tests under a heading. `fn` is called immediately and should contain the `it()` calls of the group.

```javascript
describe("Chessboard", () => {
    it("should create a board", () => {
        // ...
    })
})
```

You can use as many `describe()` blocks as you like, also across multiple test files.

### it(name, fn)

Defines a test case. The test passes when `fn` returns without throwing. If `fn` returns a Promise, Teevi waits for it, see [Testing async code](#testing-async-code).

### it.only(name, fn)

Works like `it()`, but once at least one `it.only()` exists, only the tests defined with `it.only()` are run. All other tests are skipped. This is useful while working on a single failing test.

```javascript
it.only("the test I am working on", () => {
    // only this test runs
})
```

Do not forget to change it back to `it()` afterwards.

### it.skip(name, fn)

Defines a test that is not run. It shows up grey as "skipped" in the output and in the summary, so it is not forgotten like a commented out test would be.

```javascript
it.skip("drag and drop on touch devices", () => {
    // not implemented yet
})
```

### assert

All comparisons are strict (`===` and `!==`). The `message` parameter is optional and defaults to "Assertion failed".

| Assertion | Passes when |
|---|---|
| `assert.fail(message)` | never, always fails |
| `assert.true(condition, message)` | `condition` is truthy |
| `assert.false(condition, message)` | `condition` is falsy |
| `assert.equal(actual, expected, message)` | `actual === expected` |
| `assert.notEqual(actual, notExpected, message)` | `actual !== notExpected` |
| `assert.throws(fn, message)` | calling `fn()` throws |
| `assert.rejects(promiseOrFn, message)` | the Promise rejects, or calling the async function throws. Returns a Promise, so `await` it |

`assert.equal()` and `assert.notEqual()` print both values in the failure output, so you see what went wrong without adding a message. Objects and arrays are printed as JSON, not as `[object Object]`.

```javascript
it("should compare values", () => {
    assert.equal(board.getPiece("e1"), "wk", "white king on e1")
    assert.notEqual(board.getPiece("e2"), undefined)
    assert.throws(() => JSON.parse("{"), "invalid JSON should throw")
})
```

Because `assert.equal()` is strict, objects and arrays are compared by reference. To compare their content, compare a serialized form, for example `assert.equal(JSON.stringify(actual), JSON.stringify(expected))`.

## Testing async code

Return a Promise from the test, or make the test function `async`. Teevi awaits it before running the next test.

With an `async` function, `assert` works as usual. A thrown assertion rejects the Promise and the test fails.

```javascript
it("should load a position", async () => {
    await board.setPosition("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR")
    assert.equal(board.getPiece("e1"), "wk")
})
```

To check that async code fails, use `assert.rejects()`. It takes a Promise or a function that returns one and must be awaited.

```javascript
it("should reject an invalid FEN", async () => {
    await assert.rejects(board.setPosition("not a fen"), "invalid FEN should reject")
    await assert.rejects(() => board.setPosition("not a fen"))
})
```

If you construct the Promise yourself and the check happens in a callback, for example in `setTimeout` or an event handler, an exception thrown there is not caught by the Promise. Call `reject()` instead of `assert` in that case.

```javascript
it("should test async", () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            // `resolve`, if test succeeds
            resolve()
        }, 500)
    })
})
it("should fail async", () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // in callbacks use `reject()`, not `assert`
            reject("failed, because of testing")
        }, 500)
    })
})
```

## Testing DOM components

Because the tests run in a real browser, you can test components that render to the DOM. Put a container into `test/index.html` and let your test create the component in it.

```html
<div id="TestBoard"></div>
<script type="module">
    import {teevi} from "../node_modules/teevi/src/teevi.js"
    import "./TestChessboard.js"
    teevi.run()
</script>
```

```javascript
import {describe, it, assert} from "../node_modules/teevi/src/teevi.js"
import {Chessboard} from "../src/Chessboard.js"

describe("Chessboard", () => {
    it("should render an svg into the container", () => {
        new Chessboard(document.getElementById("TestBoard"))
        assert.true(document.querySelector("#TestBoard svg") !== null)
    })
})
```

[cm-chessboard](https://github.com/shaack/cm-chessboard) uses Teevi this way, its test suite is a good real-world example.

## Running tests headless

The same `test/index.html` can run in headless Chrome, for example in CI or in a pre-commit hook. Teevi itself stays dependency-free, the headless runner is an optional script that uses [puppeteer](https://pptr.dev).

To keep your project free of dependencies too, install puppeteer globally instead of adding it to `package.json`:

```bash
npm install -g puppeteer
```

Then copy [`test/headless.mjs`](test/headless.mjs) from this repository into your `test/` folder and add a script to your `package.json`:

```json
{
  "scripts": {
    "test:headless": "node test/headless.mjs"
  }
}
```

Run it with

```bash
npm run test:headless
```

The runner

1. starts a tiny static http server on a free port, serving your project root, because ES6 modules do not load from `file://`
2. resolves puppeteer from the global npm root (or from the project, if it is installed there) and launches headless Chrome
3. opens `test/index.html` and waits for the element `#teevi-summary` that `teevi.run()` appends when all tests are done
4. prints the summary and the failed tests to the console and exits with code 0 when all tests passed, code 1 when a test failed, and code 2 when puppeteer or its Chrome is not available

Example output:

```
10 tests, 4 passed, 6 failed, 1 skipped
  FAIL: will fail → fail Error: Assertion failed actual: 6 expected: 42
  FAIL: should fail when no error is thrown → fail Error: should have thrown an error
  FAIL: should render <b>HTML</b> in test names & messages as text → fail Error: this <i>tag</i> must be shown literally
  FAIL: should fail by timeout → fail Error: timeout after 2000ms
  FAIL: should fail when the promise does not reject → fail Error: should have rejected
  FAIL: should fail async → fail failed, because of testing
```

The runner takes two environment variables:

| Variable | Default | Meaning |
|---|---|---|
| `TEEVI_TEST_PAGE` | `/test/index.html` | path of the test page, relative to the project root |
| `TEEVI_TIMEOUT` | `30000` | milliseconds to wait for the page to load and for the summary to appear |

```bash
TEEVI_TEST_PAGE=/test/other.html TEEVI_TIMEOUT=60000 npm run test:headless
```

When the summary does not appear in time, for example because a test module has a syntax error, an import returns 404 or a test never resolves, the runner prints what it collected on the page, uncaught errors, failed requests and console errors, and exits with code 1:

```
No test summary after 30000ms. The test page did not load, or a test never finished.
Hint: pass a timeout to teevi.run({timeout}) to make hanging tests fail with their name.
  HTTP 404: http://127.0.0.1:54313/test/DoesNotExist.js
  request failed: http://127.0.0.1:54313/test/DoesNotExist.js net::ERR_ABORTED
```

If puppeteer is installed but its Chrome download is missing, the runner says so and points you to `npx puppeteer browsers install chrome`. Pass a `timeout` to `teevi.run()` in your test page, otherwise a hanging test only shows up as a timeout of the runner itself, without the name of the test.

### DOM markers for your own tooling

If you prefer to write your own runner, for example with Playwright, Teevi marks its output in the DOM:

| Selector | Meaning |
|---|---|
| `h2.teevi-describe` | a `describe()` heading |
| `div.teevi-test.teevi-pass` | a passed test |
| `div.teevi-test.teevi-fail` | a failed test, contains a `pre` with the error |
| `div.teevi-test.teevi-skip` | a test defined with `it.skip()` |
| `#teevi-summary` | the summary line, present once all tests are done, with `data-total`, `data-passed`, `data-failed` and `data-skipped` |

### Example: GitHub Actions

```yaml
name: tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
      - run: npm ci
      - run: npm install -g puppeteer
      - run: npm run test:headless
```

## Running the Teevi tests

Teevi tests itself with `test/TestDemo.js`. Open [`test/index.html`](test/index.html) in your browser, or run `npm run test:headless` with a global puppeteer. Six of the ten demo tests fail on purpose and one is skipped, to show how that looks.

## Projects using Teevi

- [cm-chessboard](https://github.com/shaack/cm-chessboard), a lightweight SVG chessboard
- [cm-chess](https://github.com/shaack/cm-chess), a chess library with PGN and variations support
- [cm-pgn](https://github.com/shaack/cm-pgn), a PGN parser

## Changelog

- **2.6.0** `it.skip()` shows a test as skipped instead of running it. `assert.rejects()` as async counterpart of `assert.throws()`. The summary and the result of `teevi.run()` include the skipped count. Favicon for the test page.
- **2.5.1** Headless runner reports page errors, failed requests and console errors when the test page never finishes, and exits with code 2 when Chrome is missing. `TEEVI_TEST_PAGE` and `TEEVI_TIMEOUT`. A second `teevi.run()` call is ignored with a warning. `assert.equal()` and `assert.notEqual()` print objects and arrays as JSON. `exports` field and corrected repository links in `package.json`.
- **2.5.0** `teevi.run()` returns `{total, passed, failed}` and accepts `{timeout}`. Test names and error messages are rendered as text, HTML in them is no longer interpreted. Results carry CSS classes and the summary has the id `teevi-summary` with data attributes, for headless runners. New optional headless runner `test/headless.mjs`.
- **2.4.0** Summary line at the end of the run, auto-scroll while tests stream in.

## License

MIT, see [LICENSE](LICENSE). Author: [Stefan Haack](https://shaack.com)
