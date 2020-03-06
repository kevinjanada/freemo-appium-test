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
      for (const test in results) {
        if (results[test].result) {
          console.log(`${test} test === 'Success'`)
          continue
        }
        console.log(`${test} test === Failed`)
        console.log(results[test].error)
      }
    }
  }
})()

module.exports = TestSummary