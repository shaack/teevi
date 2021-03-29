/**
 * Author and copyright: Stefan Haack (https://shaack.com)
 * Repository: https://github.com/shaack/svjs-test
 * License: MIT, see file 'LICENSE'
 */

import {Test} from "../src/utiny/Test.js"
import {Assert} from "../src/utiny/Assert.js";

export class TestDemo extends Test {

    testThisWillNotFail() {
        Assert.true(true);
    }

    testThisWillFail() {
        Assert.equals(1 + 2, 42);
    }

}