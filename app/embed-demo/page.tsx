'use client'

export default function EmbedDemo() {
  return (
    <div className="min-h-screen p-8" style={{ backgroundColor: '#f0f0f0' }}>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Quiz Popup Integration Demo</h1>
        
        <div className="grid gap-8 md:grid-cols-2">
          {/* Desktop iframe */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Desktop iframe (600px height)</h2>
            <p className="text-gray-600 mb-4">
              Optimized for desktop screens with larger text and spacing:
            </p>
            <div className="border rounded-lg overflow-hidden">
              <iframe
                src="/quiz/digital-nomad-type?popup=true&device=desktop"
                width="100%"
                height="600"
                frameBorder="0"
                style={{ minWidth: '500px' }}
                title="Digital Nomad Quiz - Desktop"
              />
            </div>
          </div>

          {/* Mobile iframe */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Mobile iframe (500px height)</h2>
            <p className="text-gray-600 mb-4">
              Compact version for mobile screens with smaller text:
            </p>
            <div className="border rounded-lg overflow-hidden">
              <iframe
                src="/quiz/digital-nomad-type?popup=true&device=mobile"
                width="100%"
                height="500"
                frameBorder="0"
                style={{ maxWidth: '400px' }}
                title="Digital Nomad Quiz - Mobile"
              />
            </div>
          </div>
        </div>

        {/* Integration Code Examples */}
        <div className="mt-12 bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Integration Code Examples</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">Desktop iframe (600px height)</h3>
              <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
{`<iframe 
  src="https://co404quiz.vercel.app/quiz/digital-nomad-type?popup=true&device=desktop"
  width="500" 
  height="600"
  frameborder="0"
  style="border: none;"
  title="Digital Nomad Quiz">
</iframe>`}
              </pre>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Mobile iframe (500px height)</h3>
              <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
{`<iframe 
  src="https://co404quiz.vercel.app/quiz/digital-nomad-type?popup=true&device=mobile"
  width="400" 
  height="500"
  frameborder="0"
  style="border: none;"
  title="Digital Nomad Quiz">
</iframe>`}
              </pre>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Responsive iframe (auto-adjusts)</h3>
              <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
{`<div style="width: 100%; max-width: 500px;">
  <iframe 
    src="https://co404quiz.vercel.app/quiz/digital-nomad-type?popup=true&device=desktop"
    width="100%" 
    height="600"
    frameborder="0"
    style="border: none; border-radius: 8px;"
    title="Digital Nomad Quiz">
  </iframe>
</div>

@media (max-width: 768px) {
  iframe {
    height: 500px !important;
  }
}`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
