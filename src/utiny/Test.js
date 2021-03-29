/**
 * Author and copyright: Stefan Haack (https://shaack.com)
 * Repository: https://github.com/shaack/utiny
 * License: MIT, see file 'LICENSE'
 */

const STYLE = "font-family: sans-serif"

export class Test {

    constructor(props) {
        this.props = {
            htmlOutput: true,
            consoleOutput: true,
            only: undefined
        }
        Object.assign(this.props, props)
        if (this.props.htmlOutput) {
            const testHeadline = document.createElement("h2")
            testHeadline.setAttribute("style", STYLE)
            testHeadline.innerText = this.constructor.name
            document.body.appendChild(testHeadline)
        }
        if (this.props.consoleOutput) {
            console.log("# " + this.constructor.name)
        }
        let functionNames = []
        // find out test functions
        if (this.props.only) {
            if (Array.isArray(this.props.only)) {
                functionNames = this.props.only
            } else {
                functionNames.push(this.props.only)
            }
        } else {
            functionNames = Object.getOwnPropertyNames(this.constructor.prototype)
        }

        functionNames.forEach((functionName) => {
            let failed = false
            const testList = document.createElement("div")
            testList.setAttribute("style", STYLE)
            if (functionName.substr(0, 4) === "test") {
                if (this.props.consoleOutput) {
                    console.log("## " + functionName)
                }
                testList.innerHTML += functionName
                try {
                    this[functionName]()
                } catch (e) {
                    testList.innerHTML += " =&gt; <span style='color: #990000;'>Fail</span>"
                    testList.innerHTML += "<pre style='color: #990000; background-color: #f2f2f2; padding: 5px'>" + e + "</pre>"
                    console.error(e)
                    failed = true
                }
                if (!failed) {
                    testList.innerHTML += " =&gt; <span style='color: #009900;'>OK</span>"
                }
                if (this.props.htmlOutput) {
                    document.body.appendChild(testList)
                }
            }
        })
    }

    static run(functionNameToTest = undefined) {
        new this(functionNameToTest)
    }
}