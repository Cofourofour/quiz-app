// 🚀 Copy-paste this into any component for instant debugging

export const quickDebug = {
  // Log everything about an API call
  apiCall: (label: string, requestData: any, responseData: any) => {
    console.log(`=== ${label} API DEBUG ===`)
    console.log('1. Request:', requestData)
    console.log('2. Response:', responseData)
    console.log('3. Types:', {
      request: typeof requestData,
      response: typeof responseData,
      responseKeys: Object.keys(responseData || {})
    })
    console.log('=== END API DEBUG ===')
  },

  // Log data flow through functions
  dataFlow: (step: number | string, data: any) => {
    console.log(`STEP ${step}:`, {
      data,
      type: typeof data,
      isArray: Array.isArray(data),
      keys: Object.keys(data || {})
    })
  },

  // Compare expected vs actual
  compare: (expected: any, actual: any, label: string = 'COMPARISON') => {
    console.log(`${label}:`, {
      expected,
      actual,
      match: expected === actual,
      expectedType: typeof expected,
      actualType: typeof actual
    })
  },

  // Nuclear option - log everything
  nuclear: (context: any) => {
    console.log('🚨 NUCLEAR DEBUG 🚨', {
      context,
      timestamp: new Date().toISOString(),
      url: typeof window !== 'undefined' ? window?.location?.href : 'server',
      userAgent: typeof navigator !== 'undefined' ? navigator?.userAgent : 'server'
    })
  }
}

// Usage examples:
// quickDebug.apiCall('SUBMIT QUIZ', requestData, responseData)
// quickDebug.dataFlow(1, inputData)
// quickDebug.compare('A', result.key, 'RESULT KEY CHECK')
// quickDebug.nuclear({ props, state, anyOtherData })
