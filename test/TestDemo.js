/**
 * Author and copyright: Stefan Haack (https://shaack.com)
 * Repository: https://github.com/shaack/svjs-test
 * License: MIT, see file 'LICENSE'
 */

import {Test} from "../src/svjs-test/Test.js"

export class TestDemo extends Test {

    testThisWillNotFail() {
        Test.assert(true);
    }

    testThisWillFail() {
        Test.assertEquals(42, 1 + 2);
    }

}