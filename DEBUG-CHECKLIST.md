# 🚀 Lightning-Fast Debug Checklist

## ⚡ THE 2-MINUTE RULE
If we can't identify the problem in 2 minutes using this checklist, we're doing it wrong.

## 🎯 STEP 1: INSTANT PROBLEM CATEGORY (30 seconds)

Add ALL of these logs immediately to narrow down the problem:

### Frontend Issues:
```javascript
// Add to any failing component/function:
console.log('=== FRONTEND DEBUG START ===')
console.log('Props/Data received:', props)
console.log('State:', state)
console.log('Expected vs Actual:', { expected: 'X', actual: actualValue })
console.log('Data types:', typeof data)
console.log('=== FRONTEND DEBUG END ===')
```

### API Issues:
```javascript
// Add to ANY API call (frontend):
console.log('=== API DEBUG START ===')
console.log('1. Sending to API:', requestData)
console.log('2. Response status:', response.status)
const responseData = await response.json()
console.log('3. Received from API:', responseData)
console.log('4. Expected format vs Actual:', {
  expected: 'describe what you expect',
  actual: responseData,
  dataType: typeof responseData.result
})
console.log('=== API DEBUG END ===')
```

### Backend Issues:
```javascript
// Add to ANY API route:
export async function POST(request) {
  console.log('=== BACKEND DEBUG START ===')
  const body = await request.json()
  console.log('1. Received request:', body)
  console.log('2. Data types:', Object.keys(body).map(k => ({ [k]: typeof body[k] })))
  
  // Your logic here...
  const result = yourCalculation()
  
  console.log('3. Calculated result:', result)
  console.log('4. Sending response:', { success: true, result })
  console.log('=== BACKEND DEBUG END ===')
  
  return NextResponse.json({ success: true, result })
}
```

## 🔥 STEP 2: THE "SHOTGUN APPROACH" (60 seconds)

Run ALL of these checks simultaneously:

### A. Network Check:
- Open DevTools → Network tab
- Look for red errors (404, 500, etc.)
- Check request/response bodies

### B. Console Check:
```javascript
// Add this EVERYWHERE that handles data:
console.log('TYPE CHECK:', {
  value: yourValue,
  type: typeof yourValue,
  isArray: Array.isArray(yourValue),
  isObject: yourValue && typeof yourValue === 'object',
  keys: Object.keys(yourValue || {}),
  length: yourValue?.length
})
```

### C. Data Flow Check:
```javascript
// Trace data through the entire flow:
console.log('DATA FLOW:')
console.log('1. Input:', input)
console.log('2. Processed:', processed)
console.log('3. Sent:', sent)
console.log('4. Received:', received)
console.log('5. Final:', final)
```

## 🎯 STEP 3: COMMON CULPRITS (30 seconds)

Check these 90% bug causes instantly:

### Data Type Mismatches:
```javascript
// Are you comparing string vs object vs number?
console.log('MISMATCH CHECK:', {
  frontendExpects: typeof frontendValue,
  backendSends: typeof backendValue,
  equal: frontendValue === backendValue,
  strictEqual: frontendValue === backendValue
})
```

### Object vs Primitive Issues:
```javascript
// Are you sending {key: 'A'} when expecting 'A'?
console.log('OBJECT vs PRIMITIVE:', {
  isObject: typeof value === 'object',
  needsPrimitive: 'check if you need value.key instead of value'
})
```

### Array vs Object Issues:
```javascript
// Are you using .map() on an object or .find() wrong?
console.log('ARRAY vs OBJECT:', {
  isArray: Array.isArray(value),
  hasLength: value?.length,
  keys: Object.keys(value || {})
})
```

## 🚀 STEP 4: RAPID TESTING

### Quick API Test:
```javascript
// Test API directly in browser console:
fetch('/api/your-endpoint', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ test: 'data' })
})
.then(r => r.json())
.then(data => console.log('DIRECT API TEST:', data))
```

### Quick Component Test:
```javascript
// Add temporary hardcoded values:
const testData = { hardcoded: 'test values' }
console.log('COMPONENT TEST with hardcoded data:', testData)
```

## 🎯 BUG CATEGORY DECISION TREE

**If you see:**
- ❌ Network errors (404, 500) → **Backend issue**
- ❌ "undefined" or "null" → **Data not reaching destination**
- ❌ Type errors → **Data format mismatch**
- ❌ Can't find property → **Object structure mismatch**
- ❌ Function not found → **Import/export issue**

## 🔧 QUICK FIXES

### Fix Data Type Mismatches:
```javascript
// Instead of: if (result === expectedValue)
// Use: if (result?.key === expectedValue) or if (String(result) === expectedValue)
```

### Fix Object/Primitive Issues:
```javascript
// Backend sends object: return { result: resultValue } 
// Frontend expects primitive: return { result: resultValue.key }
```

### Fix Array Issues:
```javascript
// Make sure you're using right method:
// .find() for objects in array
// .map() for transforming arrays
// Object.keys() for object properties
```

## 🚨 EMERGENCY DEBUGGING

If all else fails, add this NUCLEAR DEBUG option:

```javascript
// NUCLEAR OPTION - Log everything:
console.log('🚨 NUCLEAR DEBUG 🚨')
console.log('All variables in scope:', Object.keys(this))
console.log('All props:', props)
console.log('All state:', state)
console.log('Request data:', JSON.stringify(requestData, null, 2))
console.log('Response data:', JSON.stringify(responseData, null, 2))
console.log('Environment:', process.env.NODE_ENV)
console.log('🚨 END NUCLEAR DEBUG 🚨')
```

## ✅ SUCCESS CRITERIA

**We know we're done when:**
1. ✅ All console.logs show expected data
2. ✅ Network tab shows 200 OK responses
3. ✅ No red errors in console
4. ✅ Feature works as expected

## 📝 POST-DEBUG CLEANUP

After fixing:
1. Remove all console.log statements
2. Commit with clear message explaining the fix
3. Add comment explaining the bug for future reference

---

**Remember: 90% of bugs are at the boundaries where data moves between systems. Check the boundaries first!**
