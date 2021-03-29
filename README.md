# utiny

Tired of installing 25 dependencies, just to run unit tests? utiny is
the essence of unit testing for JavaScript modules.

It allows unit testing of ES6 modules without additional dependencies, right in your browser.

Demo: [http://shaack.com/projekte/utiny/test/](http://shaack.com/projekte/utiny/test/)

## Works like this

1. Create a `test/index.html`:

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

2. Create the test module `TestMyModule.js`.

```javascript
import {describe, it, assert} from "../src/utiny.js";

describe("utiny", () => {
    it("will not fail", () => {
        assert.true(2 * 2 === 4)
    })
    it("will fail", () => {
        assert.equals(4 + 2, 42)
    })
})
```

