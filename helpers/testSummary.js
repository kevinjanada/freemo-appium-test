const chalk = require('chalk')
const fs = require('fs')
const path = require('path')

const TestSummary = (function() {
  let instance = null;

  const createInstance = () =>  ({})

  return {
    getInstance: function() {
      if (instance === null) {
        instance = createInstance()
      }
      return instance
    },
    /**
     * addResult
     * @param {string} testName 
     * @param {boolean} testResult 
     * @param {any} errorMessage 
     */
    addResult: function(testName, testResult, errorMessage) {
      const instance = this.getInstance()
      instance[testName] = {}
      instance[testName].result = testResult
      instance[testName].error = errorMessage
    },
    showResults: function() {
      const results = this.getInstance()
      handleLogResults(results)
    }
  }
})()

/**
 * handleLogResults
 * @param {object} result 
 */
function handleLogResults(results) {
  logToConsole(results)
  logToFile(results)
}

function logToConsole(results) {
  for (const test in results) {
    if (results[test].result) {
      console.log(`+ ${chalk.green(test)} test \t ${chalk.black.bgGreen.bold('Success')}`)
      continue
    }
    console.log(`- ${chalk.red(test)} test \t ${chalk.black.bgRed.bold('Failed')}`)
    console.log(results[test].error)
  }
}

function logToFile(results) {
  const currentDate = Date().toString().split(/ \d+:\d+:\d+/)[0]
  const logFileDir = path.join(process.cwd(), 'logs', `${currentDate}.log`)
  const fileWriter = fs.createWriteStream(logFileDir, {flags: 'a'}) // WriteStream append

  fileWriter.write(Date().toString() + '\n')
  for (const test in results) {
    if (results[test].result) {
      fileWriter.write(`+ ${test} \t Success \n`)
      fileWriter.write('----------------------------------------------------------------------------------- \n')
      continue
    }
    fileWriter.write(`- ${test} \t Failed \n`)
    fileWriter.write(results[test].error + '\n')
    fileWriter.write('----------------------------------------------------------------------------------- \n')
  }
  fileWriter.write('=================================================================================== \n')
  fileWriter.write('\n\n')
}

module.exports = TestSummary