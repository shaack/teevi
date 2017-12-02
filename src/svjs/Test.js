/**
 * Author: shaack
 * Date: 29.11.2017
 */

const DEFAULT_MESSAGE = "Assertion failed";
const STYLE = "font-family: sans-serif";

export class Test {
    constructor(config) {
        this.config = {
            htmlOutput: true,
            consoleOutput: true,
            functionName: null
        };
        Object.assign(this.config, config);
        if (this.config.htmlOutput) {
            const testHeadline = document.createElement("h1");
            testHeadline.setAttribute("style", STYLE);
            testHeadline.innerText = this.constructor.name;
            document.body.appendChild(testHeadline);
        }
        if (this.config.consoleOutput) {
            console.log("# " + this.constructor.name);
        }
        let functionNames = [];
        // find out test functions
        if (this.config.functionName) {
            if (Array.isArray(this.config.functionName)) {
                functionNames = this.config.functionName;
                console.log("IS ARRAY!", functionNames);
            } else {
                functionNames.push(this.config.functionName);
            }
        } else {
            functionNames = Object.getOwnPropertyNames(this.constructor.prototype);
        }

        functionNames.forEach((functionName) => {
            let failed = false;
            if (functionName.substr(0, 4) === "test") {
                console.log("## " + functionName);
                Test.appendHtml("<span style='font-family: sans-serif'>" + functionName + "</span>");
                try {
                    this[functionName]();
                } catch (e) {
                    Test.appendHtml(" =&gt; <span style='color: #990000; font-family: sans-serif;'>Fail</span>");
                    Test.appendHtml("<pre style='color: #990000'>" + e.stack + "</pre>");
                    console.error(e);
                    failed = true;
                }
                if (!failed) {
                    Test.appendHtml(" =&gt; <span style='color: #009900; font-family: sans-serif;'>OK</span>");
                }
                Test.appendHtml("<br/>");
            }
        });
    }

    static assert(condition, message = DEFAULT_MESSAGE) {
        if (!condition) {
            throw new Error(message);
        }
    }

    static assertEquals(expected, value, message = DEFAULT_MESSAGE) {
        if (expected !== value) {
            throw new Error(message + " – expected: " + expected + ", result: " + value);
        }
    }

    static appendHtml(html) {
        document.body.innerHTML = document.body.innerHTML + html;
    }

    static run(functionNameToTest = null) {
        new this(functionNameToTest);
    }
}