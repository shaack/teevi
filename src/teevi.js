/**
 * Author and copyright: Stefan Haack (https://shaack.com)
 * Repository: https://github.com/shaack/teevi
 * License: MIT, see file 'LICENSE'
 */

const DEFAULT_MESSAGE = "Assertion failed"
const STYLE = "font-family: sans-serif"

class TestError extends Error {
    constructor(message) {
        super(message)
        if (this.stack) {
            this.stack = this.stack.split("\n")
            this.stack.splice(1, 1)
            this.stack = this.stack.join("\n")
        }
    }
}

export class teevi {
    /**
     * Runs all queued tests. Resolves with {total, passed, failed, skipped} when done.
     * @param {Object} [options]
     * @param {number} [options.timeout=0] fail a test that takes longer than this many ms, 0 disables the timeout
     */
    static run(options = {}) {
        if (runPromise) {
            console.warn("teevi.run() was already called, ignoring this call")
            return runPromise
        }
        runPromise = run(options)
        return runPromise
    }
}

let runPromise = null

let testStack = []

export function describe(object, tests) {
    testStack.push({describe: object})
    tests()
}

let onlyMode = false
const it = function it(condition, testMethod) {
    testStack.push({it: condition, testMethod: testMethod, only: false, skip: false})
}
it.only = function it(condition, testMethod) {
    testStack.push({it: condition, testMethod: testMethod, only: true, skip: false})
    onlyMode = true
}
it.skip = function it(condition, testMethod) {
    testStack.push({it: condition, testMethod: testMethod, only: false, skip: true})
}
export {it}

function withTimeout(result, timeout) {
    if (!timeout) {
        return result
    }
    let timer
    const timeoutPromise = new Promise((resolve, reject) => {
        timer = setTimeout(() => reject(new TestError("timeout after " + timeout + "ms")), timeout)
    })
    return Promise.race([result, timeoutPromise]).finally(() => clearTimeout(timer))
}

async function run({timeout = 0} = {}) {
    let passed = 0
    let failed = 0
    let skipped = 0
    for (const test of testStack) {
        if (test.describe) {
            const testHeadline = document.createElement("h2")
            testHeadline.className = "teevi-describe"
            testHeadline.setAttribute("style", STYLE)
            testHeadline.textContent = test.describe
            document.body.appendChild(testHeadline)
            console.log(test.describe + ":")
        } else if (test.it) {
            if (onlyMode && !test.only) {
                continue
            }
            const testLine = document.createElement("div")
            testLine.setAttribute("style", STYLE)
            testLine.appendChild(document.createTextNode(test.it + " → "))
            const result = document.createElement("span")
            if (test.skip) {
                console.log("- " + test.it + " (skipped)")
                testLine.className = "teevi-test teevi-skip"
                result.setAttribute("style", "color: #999999")
                result.textContent = "skipped"
                testLine.appendChild(result)
                document.body.appendChild(testLine)
                skipped++
                continue
            }
            console.log("- " + test.it)
            try {
                await withTimeout(test.testMethod(), timeout)
                testLine.className = "teevi-test teevi-pass"
                result.setAttribute("style", "color: #009900")
                result.textContent = "ok"
                testLine.appendChild(result)
                passed++
            } catch (e) {
                testLine.className = "teevi-test teevi-fail"
                result.setAttribute("style", "color: #990000")
                result.textContent = "fail"
                testLine.appendChild(result)
                const details = document.createElement("pre")
                details.setAttribute("style", "color: #990000; background-color: #f2f2f2; padding: 5px")
                details.textContent = String(e)
                testLine.appendChild(details)
                console.error(e)
                failed++
            }
            document.body.appendChild(testLine)
            window.scrollTo(0, document.body.scrollHeight)
        }
    }
    const total = passed + failed
    const summary = document.createElement("div")
    const color = failed > 0 ? "#990000" : "#009900"
    summary.id = "teevi-summary"
    summary.className = failed > 0 ? "teevi-fail" : "teevi-pass"
    summary.dataset.total = String(total)
    summary.dataset.passed = String(passed)
    summary.dataset.failed = String(failed)
    summary.dataset.skipped = String(skipped)
    summary.setAttribute("style",
        STYLE + ";margin-top:1.5rem;padding:0.75rem 0;" +
        "border-top:1px solid " + color + ";color:" + color)
    summary.textContent = failed > 0
        ? total + " tests, " + passed + " passed, " + failed + " failed"
        : "All " + total + " tests passed"
    if (skipped > 0) {
        summary.textContent += ", " + skipped + " skipped"
    }
    document.body.appendChild(summary)
    window.scrollTo(0, document.body.scrollHeight)
    console.log(summary.textContent)
    return {total, passed, failed, skipped}
}

// objects and arrays would otherwise show up as [object Object] in failure messages
function format(value) {
    if (value !== null && typeof value === "object") {
        try {
            return JSON.stringify(value)
        } catch (e) {
            return String(value)
        }
    }
    return String(value)
}

export class assert {

    static fail(message = DEFAULT_MESSAGE) {
        throw new TestError(message)
    }

    static true(condition, message = DEFAULT_MESSAGE) {
        if (!condition) {
            throw new TestError(message)
        }
    }

    static false(condition, message = DEFAULT_MESSAGE) {
        if (condition) {
            throw new TestError(message)
        }
    }

    static equal(actual, expected, message = DEFAULT_MESSAGE) {
        if (expected !== actual) {
            throw new TestError(message + "\nactual:\n" + format(actual) + "\nexpected:\n" + format(expected))
        }
    }

    static notEqual(actual, notExpected, message = DEFAULT_MESSAGE) {
        if (notExpected === actual) {
            throw new TestError(message + "\nactual:\n" + format(actual) + "\nnot expected:\n" + format(notExpected))
        }
    }

    static throws(fn, message = DEFAULT_MESSAGE) {
        try {
            fn()
        } catch (e) {
            return
        }
        throw new TestError(message)
    }

    // async counterpart of throws(), must be awaited or returned from the test
    static async rejects(promiseOrFn, message = DEFAULT_MESSAGE) {
        try {
            await (typeof promiseOrFn === "function" ? promiseOrFn() : promiseOrFn)
        } catch (e) {
            return
        }
        throw new TestError(message)
    }

}
