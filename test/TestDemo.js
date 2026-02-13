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
                // `resolve`, if test succeeds
                resolve()
            }, 500)
        })
    })
    it("should detect a thrown error", () => {
        assert.throws(() => {
            throw new Error("this is an error")
        }, "should have thrown an error")
    })
    it("should fail when no error is thrown", () => {
        assert.throws(() => {
            // does not throw
        }, "should have thrown an error")
    })
    it("should fail async", () => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // in Promises use `reject()`, not `assert`
                reject("failed, because of testing")
            }, 500)
        })
    })
})
