// Test validation with missing fields
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testValidation() {
  console.log('🧪 Testing form validation...');
  
  // Test 1: Missing email
  console.log('\n📧 Test 1: Missing email');
  const testMissingEmail = {
    quiz_slug: 'digital-nomad-type',
    email: '',
    answers: { 'q1': 'A', 'q2': 'B', 'q3': 'C', 'q4': 'D', 'q5': 'A', 'q6': 'B' }
  };
  
  await testSubmission(testMissingEmail);
  
  // Test 2: Invalid email
  console.log('\n📧 Test 2: Invalid email');
  const testInvalidEmail = {
    quiz_slug: 'digital-nomad-type',
    email: 'invalid-email',
    answers: { 'q1': 'A', 'q2': 'B', 'q3': 'C', 'q4': 'D', 'q5': 'A', 'q6': 'B' }
  };
  
  await testSubmission(testInvalidEmail);
  
  // Test 3: Missing answers
  console.log('\n❓ Test 3: Missing answers');
  const testMissingAnswers = {
    quiz_slug: 'digital-nomad-type',
    email: 'test@example.com',
    answers: { 'q1': 'A', 'q2': 'B' } // Only 2 out of 6 questions
  };
  
  await testSubmission(testMissingAnswers);
}

async function testSubmission(data) {
  try {
    const response = await fetch('http://localhost:3004/api/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    
    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ Status:', response.status, '- Success');
    } else {
      console.log('❌ Status:', response.status, '- Error:', result.error);
    }
    
  } catch (error) {
    console.error('💥 Error:', error.message);
  }
}

testValidation();
