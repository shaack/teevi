/**
 * Author: shaack
 * Date: 29.11.2017
 */

export function assert(condition, message = "Assertion failed") {
    if (!condition) {
        throw new Error(message);
    }
}

export class Test {
    constructor() {
        document.head.innerHTML = "<style type='text/css'>body { font-family: sans-serif; background-color: #f2f2f2; color: #333 }</style>";
        Test.appendHtml("<h1>" + this.constructor.name + "</h1>");
        // find out test functions
        const functionNames = Object.getOwnPropertyNames(this.constructor.prototype);
        functionNames.forEach((functionName) => {
            let failed = false;
            if (functionName.substr(0, 4) === "test") {
                console.log(functionName);
                Test.appendHtml(functionName);
                try {
                    this[functionName]();
                } catch (e) {
                    Test.appendHtml(" =&gt; <span style='color: #990000'>Fail</span>");
                    Test.appendHtml("<pre style='color: #990000'>" + e.stack + "</pre>");
                    console.error(e);
                    failed = true;
                }
                if(!failed) {
                    Test.appendHtml(" =&gt; <span style='color: #009900'>OK</span>");
                }
                Test.appendHtml("<br/>");
            }
        });
    }

    static appendHtml(html) {
        document.body.innerHTML =  document.body.innerHTML + html;
    }

    static run() {
        new this;
    }
}