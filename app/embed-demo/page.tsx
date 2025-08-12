'use client'

export default function EmbedDemo() {
  return (
    <div className="min-h-screen p-8" style={{ backgroundColor: '#f0f0f0' }}>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Quiz Popup Integration Demo</h1>
        
        <div className="grid gap-8 md:grid-cols-2">
          {/* Button Popup */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Button Trigger</h2>
            <p className="text-gray-600 mb-4">
              Click the button below to open the quiz in a popup window:
            </p>
            <button
              onClick={() => {
                const popup = window.open(
                  '/quiz/digital-nomad-type?popup=true',
                  'quiz-popup',
                  'width=500,height=650,scrollbars=no,resizable=no,toolbar=no,location=no,directories=no,status=no,menubar=no'
                )
                
                // Listen for messages from popup
                const handleMessage = (event: MessageEvent) => {
                  if (event.data?.type === 'closeQuiz') {
                    popup?.close()
                  }
                }
                window.addEventListener('message', handleMessage)
                
                // Clean up listener when popup closes
                const checkClosed = setInterval(() => {
                  if (popup?.closed) {
                    window.removeEventListener('message', handleMessage)
                    clearInterval(checkClosed)
                  }
                }, 1000)
              }}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Take the Digital Nomad Quiz
            </button>
          </div>

          {/* iframe Embed */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">iframe Embed</h2>
            <p className="text-gray-600 mb-4">
              The quiz embedded directly in your page:
            </p>
            <div className="border rounded-lg overflow-hidden">
              <iframe
                src="/quiz/digital-nomad-type?popup=true"
                width="100%"
                height="600"
                frameBorder="0"
                style={{ minWidth: '400px' }}
                title="Digital Nomad Quiz"
              />
            </div>
          </div>
        </div>

        {/* Integration Code Examples */}
        <div className="mt-12 bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Integration Code Examples</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">Popup Window (JavaScript)</h3>
              <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
{`<button onclick="openQuizPopup()">Take Quiz</button>

<script>
function openQuizPopup() {
  const popup = window.open(
    'https://co404quiz.vercel.app/quiz/digital-nomad-type?popup=true',
    'quiz-popup',
    'width=500,height=650,scrollbars=no,resizable=no'
  );
  
  // Listen for close message
  window.addEventListener('message', (event) => {
    if (event.data?.type === 'closeQuiz') {
      popup?.close();
    }
  });
}
</script>`}
              </pre>
            </div>

            <div>
              <h3 className="font-semibold mb-2">iframe Embed</h3>
              <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
{`<iframe 
  src="https://co404quiz.vercel.app/quiz/digital-nomad-type?popup=true"
  width="500" 
  height="600"
  frameborder="0"
  title="Digital Nomad Quiz">
</iframe>`}
              </pre>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Modal Overlay (CSS + JavaScript)</h3>
              <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
{`<div id="quiz-modal" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.5); z-index:1000;">
  <div style="position:absolute; top:50%; left:50%; transform:translate(-50%,-50%);">
    <iframe 
      src="https://co404quiz.vercel.app/quiz/digital-nomad-type?popup=true"
      width="500" 
      height="600"
      frameborder="0">
    </iframe>
  </div>
</div>

<script>
function showQuizModal() {
  document.getElementById('quiz-modal').style.display = 'block';
}

function hideQuizModal() {
  document.getElementById('quiz-modal').style.display = 'none';
}

// Listen for close message from quiz
window.addEventListener('message', (event) => {
  if (event.data?.type === 'closeQuiz') {
    hideQuizModal();
  }
});
</script>`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
