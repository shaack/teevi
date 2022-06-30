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
        assert.equal(4 + 2, 42)
    })
    it("should test async", () => {
        return new Promise((resolve) => {
            setTimeout(() => {
                assert.true(true)
                resolve()
            }, 500)
        })
    })
    it("should fail async", () => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                assert.true(true)
                reject("failed, because of testing")
            }, 500)
        })
    })
})
