/**
 * Author and copyright: Stefan Haack (https://shaack.com)
 * Repository: https://github.com/shaack/utiny
 * License: MIT, see file 'LICENSE'
 */

const DEFAULT_MESSAGE = "Assertion failed"

class TestError extends Error {
    constructor(message) {
        super(message)
        this.stack = this.stack.split("\n")
        this.stack.splice(1, 1)
        this.stack = this.stack.join("\n")
    }
}

export class Assert {

    static true(condition, message = DEFAULT_MESSAGE) {
        if (!condition) {
            throw new TestError(message)
        }
    }

    static equals(actual, expected, message = DEFAULT_MESSAGE) {
        if (expected !== actual) {
            throw new TestError(message + " – expected: " + expected + ", result: " + actual)
        }
    }
}