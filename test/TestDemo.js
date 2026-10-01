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
    it("should render <b>HTML</b> in test names & messages as text", () => {
        assert.fail("this <i>tag</i> must be shown literally")
    })
    it("should fail by timeout", () => {
        return new Promise(() => {
            // never resolves, fails because of the timeout passed to teevi.run()
        })
    })
    it.skip("should be skipped", () => {
        assert.fail("never runs")
    })
    it("should detect a rejected promise", async () => {
        await assert.rejects(Promise.reject(new Error("rejected")))
        await assert.rejects(async () => {
            throw new Error("rejected")
        })
    })
    it("should fail when the promise does not reject", () => {
        return assert.rejects(Promise.resolve("fine"), "should have rejected")
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
