# Teevi

Tired of installing 25 dependencies, just to run unit tests? Teevi is
the essence of unit testing for JavaScript modules.

It allows unit testing of ES6 modules without additional dependencies, right in your browser.

Demo: [http://shaack.com/projekte/teevi/test/](http://shaack.com/projekte/teevi/test/)

## Usage

1. Create the test module `TestMyModule.js`

```javascript
import {describe, it, assert} from "../src/teevi.js";

describe("Teevi test demo", () => {
    it("will not fail", () => {
        assert.true(2 * 2 === 4)
    })
    it("will fail", () => {
        assert.equals(4 + 2, 42)
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
    import "./TestMyModule.js"
</script>
</body>
</html>
```

![bootstrap-input-spinner](https://shaack.com/projekte/assets/img/teevi-test-demo.png?v=1)

## it.only

Use `it.only(condition, testMethod)` to run only these tests in your test module. 

