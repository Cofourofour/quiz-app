// Simple test script to verify quiz functionality
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testQuiz() {
  console.log('🧪 Testing quiz submission...');
  
  const testData = {
    quiz_slug: 'digital-nomad-type',
    email: 'test@example.com',
    answers: {
      'q1': 'A',
      'q2': 'B', 
      'q3': 'C',
      'q4': 'D',
      'q5': 'A',
      'q6': 'B'
    }
  };
  
  try {
    console.log('📤 Sending request with data:', JSON.stringify(testData, null, 2));
    
    const response = await fetch('http://localhost:3004/api/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });
    
    console.log('📥 Response status:', response.status);
    const result = await response.json();
    console.log('📥 Response body:', JSON.stringify(result, null, 2));
    
    if (response.ok) {
      console.log('✅ Quiz submission successful!');
      console.log('🎯 Result:', result.result?.name);
    } else {
      console.log('❌ Quiz submission failed');
    }
    
  } catch (error) {
    console.error('💥 Error:', error.message);
  }
}

testQuiz();
