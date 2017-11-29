/**
 * Author: shaack
 * Date: 29.11.2017
 */

import {Test} from "../src/svjs/Test.js"

export class TestDemo extends Test {

    testThisWillNotFail() {
        Test.assert(true);
    }

    testThisWillFail() {
        Test.assertEquals(42, 1 + 2);
    }

}