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
    static run() {
        run()
    }
}

let testStack = []

export function describe(object, tests) {
    testStack.push({describe: object})
    tests()
}

let onlyMode = false
const it = function it(condition, testMethod) {
    testStack.push({it: condition, testMethod: testMethod, only: false})
}
it.only = function it(condition, testMethod) {
    testStack.push({it: condition, testMethod: testMethod, only: true})
    onlyMode = true
}
export {it}

function run() {
    for (const test of testStack) {
        if (test.describe) {
            const testHeadline = document.createElement("h2")
            testHeadline.setAttribute("style", STYLE)
            testHeadline.innerText = test.describe
            document.body.appendChild(testHeadline)
            console.log(test.describe + ":")
        } else if (test.it) {
            if (onlyMode && !test.only) {
                continue
            }
            let failed = false
            const testList = document.createElement("div")
            testList.setAttribute("style", STYLE)
            console.log("- " + test.it)
            testList.innerHTML += test.it
            try {
                const paramNames = getParamNames(test.testMethod)
                if(paramNames.length > 0 && paramNames[0] === "done") {
                    // todo using "done()"
                }
                test.testMethod(() => {
                    console.log("done()")
                })
            } catch (e) {
                testList.innerHTML += " =&gt; <span style='color: #990000;'>fail</span>"
                testList.innerHTML += "<pre style='color: #990000; background-color: #f2f2f2; padding: 5px'>" + e + "</pre>"
                console.error(e)
                failed = true
            }
            if (!failed) {
                testList.innerHTML += " =&gt; <span style='color: #009900;'>ok</span>"
            }
            document.body.appendChild(testList)
        }
    }
}

const STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg
const ARGUMENT_NAMES = /([^\s,]+)/g

function getParamNames(func) {
    const fnStr = func.toString().replace(STRIP_COMMENTS, '')
    let result = fnStr.slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')')).match(ARGUMENT_NAMES)
    if (result === null)
        result = []
    return result
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

    static equals(actual, expected, message = DEFAULT_MESSAGE) {
        if (expected !== actual) {
            throw new TestError(message + " - actual: " + actual + ", expected: " + expected)
        }
    }

}