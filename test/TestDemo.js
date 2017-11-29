/**
 * Author: shaack
 * Date: 29.11.2017
 */

import {assert, Test} from "../src/svjs/Test.js"

export class TestDemo extends Test {

    testWhatisThree() {
        assert(3 === 1 + 2);
    }

    testThisWillFail() {
        assert(false);
    }

}