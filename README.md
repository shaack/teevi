# utiny

Tired of installing 25 dependencies, just to run unit tests? utiny is
the essence of unit testing JavaScript modules.

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
    import {TestMyModule} from "./TestMyModule.js"
    TestMyModule.run()
</script>
</body>
</html>
```

2. Create test classes extending `Test`, in this case `TestMyModule.js`. 
Functions named `test[…]` will be executed automatically, when you call 
`test/index.html` in your Browser.

```javascript
import {Test} from "../src/utiny/Test.js"
import {Assert} from "../src/utiny/Assert.js"

export class TestMyModule extends Test {

    testThisWillNotFail() {
        Assert.true(2 * 2, 4)
    }

    testThisWillFail() {
        Assert.equals(4 + 2, 42)
    }

}
```

## Result

The result will look like this:

![Test Result](http://shaack.com/projekte/assets/img/svjs_test.png)

## Configuration

```javascript
const props = {
    htmlOutput: true, // enable HTML output
    consoleOutput: true, // enable output via console
    onyl: undefined /* 
        set as String to run one specific test only,
        set as array to run multiple specific tests in the test class,
        leave as undefined to run test[…] functions in the test class 
        */ 
}
TestMyModule.run(props)
```

