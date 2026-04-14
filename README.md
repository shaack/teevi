# Teevi

Tired of installing 1000 dependencies, just to run unit tests? Teevi is
the essence of unit testing in JavaScript.

It allows unit testing of JS without additional dependencies, right in your browser.
Teevi has almost the same syntax as Mocha with Chai but is a hundred times smaller.

Demo: [http://shaack.com/projekte/teevi/test/](http://shaack.com/projekte/teevi/test/)

## Usage

1. Create the test script `MyTest.js`

```javascript
import {describe, it, assert} from "../src/teevi.js"

describe("Teevi test demo", () => {
    it("will not fail", () => {
        assert.true(2 * 2 === 4)
    })
    it("will fail", () => {
        assert.equal(4 + 2, 42)
    })
})
```

2. Create a `test/index.html` to run the tests in your browser

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Tests</title>
</head>
<body>
<script type="module">
    import {teevi} from "./src/teevi.js"
    import "./MyTest.js"
    teevi.run()
</script>
</body>
</html>
```

![teevi](https://shaack.com/projekte/assets/img/teevi-test-demo.png?v=1)

When `teevi.run()` finishes it appends a summary line to the bottom of the page
(green "All N tests passed" or red "N tests, X passed, Y failed") and scrolls the
viewport to the latest result while tests stream in, so long suites stay readable.

## it.only

Use `it.only(condition, testMethod)` to run only these tests in your test module.

## possible assertions

- `assert.fail(message)`
- `assert.true(condition, message)`
- `assert.false(condition, message)`
- `assert.equal(actual, expected, message)`
- `assert.notEqual(actual, notExpected, message)`
- `assert.throws(fn, message)` — passes when `fn()` throws
- use `reject(message)` from an async `Promise` (see example below)

## Testing async calls

You can also test async calls, with the use of promises.

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
            // in Promises use `reject()`, not `assert`
            reject("failed, because of testing")
        }, 500)
    })
})
```
