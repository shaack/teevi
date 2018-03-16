# svjs-test

Allows unit testing of ES6 modules without additional dependencies, right in your browser.

Demo: [http://shaack.com/projekte/svjs-test/test/](http://shaack.com/projekte/svjs-test/test/)

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
    TestMyModule.run();
</script>
</body>
</html>
```

2. Create test classes extending `Test`, in this case `TestMyModule.js`. 
Functions named `test[…]` will be executed automatically, when you call 
`test/index.html` in your Browser.

```javascript
import {Test} from "../src/svjs/Test.js"

export class TestMyModule.js extends Test {

    testThisWillNotFail() {
        Test.assert(true);
    }

    testThisWillFail() {
        Test.assertEquals(42, 1 + 2);
    }

}
```

## Result

The result will look like this:

![Test Result](http://shaack.com/projekte/assets/img/svjs_test.png)

## Configuration

```javascript
const config = {
    htmlOutput: true, // enable HTML output
    consoleOutput: true, // enable output via console
    functionName: null /* 
        set as String for running one test function,
        as array for multiple specific functions in the test class,
        null for all test[…] functions in the test class 
        */ 
};
TestMyModule.run(config);
```

