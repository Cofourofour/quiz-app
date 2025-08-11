// Simple test runner instead of Playwright
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function runFullTest() {
  console.log('🚀 Running Full Quiz Test Suite\n');
  
  // Test 1: Full valid submission
  console.log('📝 Test 1: Complete valid submission');
  await testSubmit({
    quiz_slug: 'digital-nomad-type',
    email: 'test@example.com',
    answers: { q1: 'A', q2: 'B', q3: 'C', q4: 'D', q5: 'A', q6: 'B' }
  }, true);
  
  // Test 2: Missing email
  console.log('\n📧 Test 2: Missing email');
  await testSubmit({
    quiz_slug: 'digital-nomad-type',
    email: '',
    answers: { q1: 'A', q2: 'B', q3: 'C', q4: 'D', q5: 'A', q6: 'B' }
  }, false);
  
  // Test 3: Invalid email
  console.log('\n📧 Test 3: Invalid email format');
  await testSubmit({
    quiz_slug: 'digital-nomad-type',
    email: 'invalid-email',
    answers: { q1: 'A', q2: 'B', q3: 'C', q4: 'D', q5: 'A', q6: 'B' }
  }, false);
  
  // Test 4: Missing questions
  console.log('\n❓ Test 4: Missing some questions');
  await testSubmit({
    quiz_slug: 'digital-nomad-type',
    email: 'test@example.com',
    answers: { q1: 'A', q2: 'B' } // Missing q3, q4, q5, q6
  }, false);
  
  // Test 5: Check all results work
  console.log('\n🎯 Test 5: Testing all result types');
  const resultTypes = ['A', 'B', 'C', 'D'];
  
  for (const type of resultTypes) {
    await testSubmit({
      quiz_slug: 'digital-nomad-type',
      email: 'test@example.com',
      answers: { q1: type, q2: type, q3: type, q4: type, q5: type, q6: type }
    }, true);
  }
  
  console.log('\n✅ All tests completed!');
}

async function testSubmit(data, shouldSucceed) {
  try {
    const response = await fetch('http://localhost:3004/api/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    
    const result = await response.json();
    
    if (shouldSucceed) {
      if (response.ok) {
        console.log(`   ✅ SUCCESS - Result: ${result.result?.name || 'Unknown'}`);
      } else {
        console.log(`   ❌ FAILED - Expected success but got: ${result.error}`);
      }
    } else {
      if (!response.ok) {
        console.log(`   ✅ CORRECTLY FAILED - Error: ${result.error}`);
      } else {
        console.log(`   ❌ UNEXPECTED SUCCESS - Should have failed`);
      }
    }
    
  } catch (error) {
    console.log(`   💥 NETWORK ERROR: ${error.message}`);
  }
}

runFullTest();
