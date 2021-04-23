/**
 * Author and copyright: Stefan Haack (https://shaack.com)
 * Repository: https://github.com/shaack/svjs-test
 * License: MIT, see file 'LICENSE'
 */

import {describe, it, assert} from "../src/teevi.js";

describe("Teevi test demo", () => {
    it("will not fail", () => {
        assert.true(2 * 2 === 4)
    })
    it("will fail", () => {
        assert.equals(4 + 2, 42)
    })
    /*
    it("should test async", (done) => {
        setTimeout(() => {
            assert.true(true)
            done()
        }, 1000)
    })
    */
})