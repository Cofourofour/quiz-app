import nodemailer from 'nodemailer'

// Create Gmail transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER, // Your Gmail address
      pass: process.env.GMAIL_APP_PASSWORD // Your Gmail App Password
    }
  })
}

interface EmailOptions {
  to: string
  subject: string
  html: string
  text?: string
}

export async function sendEmail({ to, subject, html, text }: EmailOptions) {
  try {
    const transporter = createTransporter()
    
    const mailOptions = {
      from: `"Co404 Quiz" <${process.env.GMAIL_USER}>`,
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]*>/g, '') // Strip HTML for text version
    }

    const result = await transporter.sendMail(mailOptions)
    console.log('Email sent successfully:', result.messageId)
    return { success: true, messageId: result.messageId }
  } catch (error) {
    console.error('Email sending failed:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

export function generateResultEmail(email: string, result: any) {
  // Replace template variables with just "Hi" instead of using name
  let emailContent = result.email_template
    .replace(/{{name}}/g, '') // Remove name placeholder
    .replace(/{{email}}/g, email)
  
  // Fix greeting to just say "Hi" instead of "Hi {{name}}"
  emailContent = emailContent.replace(/Hi[,\s]*/i, 'Hi! ')
  
  // Convert markdown-style formatting to HTML
  emailContent = emailContent
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold
    .replace(/\*(.*?)\*/g, '<em>$1</em>') // Italic
    .replace(/\n\n/g, '</p><p>') // Paragraphs
    .replace(/\n/g, '<br>') // Line breaks
    .replace(/^• /gm, '<li>') // List items
  
  // Wrap in HTML structure
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>Your Digital Nomad Type - Co404</title>
      <style>
        body { 
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.6;
          color: #43362d;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f7f5f4;
        }
        .container {
          background-color: #ede8e5;
          border-radius: 12px;
          padding: 30px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 2px solid #b47775;
        }
        .logo {
          font-size: 28px;
          font-weight: bold;
          color: #b47775;
          margin-bottom: 10px;
        }
        .result-name {
          font-size: 24px;
          font-weight: bold;
          color: #b47775;
          margin: 20px 0;
        }
        .content {
          font-size: 16px;
          line-height: 1.7;
        }
        .footer {
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #c48c72;
          text-align: center;
          font-size: 14px;
          color: #666;
        }
        ul {
          padding-left: 0;
          list-style: none;
        }
        li {
          margin: 8px 0;
          padding-left: 20px;
          position: relative;
        }
        li:before {
          content: "•";
          color: #b47775;
          font-weight: bold;
          position: absolute;
          left: 0;
        }
        .cta-button {
          display: inline-block;
          background-color: #b47775;
          color: #f7f5f4;
          padding: 12px 24px;
          text-decoration: none;
          border-radius: 6px;
          font-weight: bold;
          margin: 20px 0;
        }
        .share-section {
          background-color: #e3dbd6;
          border-radius: 8px;
          padding: 20px;
          margin: 20px 0;
          text-align: center;
        }
        .share-buttons {
          display: flex;
          justify-content: center;
          gap: 10px;
          flex-wrap: wrap;
          margin-top: 15px;
        }
        .share-button {
          display: inline-block;
          padding: 10px 15px;
          border-radius: 6px;
          text-decoration: none;
          color: white;
          font-size: 14px;
          font-weight: 500;
          min-width: 100px;
          text-align: center;
        }
        .facebook { background-color: #1877f2; }
        .instagram { background-color: #E4405F; }
        .whatsapp { background-color: #25D366; }
        .twitter { background-color: #1DA1F2; }
        @media (max-width: 600px) {
          .share-buttons {
            flex-direction: column;
            align-items: center;
          }
          .share-button {
            width: 200px;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">Co404</div>
          <div>Your Digital Nomad Quiz Results</div>
        </div>
        
        <div class="result-name">${result.name}</div>
        
        <div class="content">
          <p>${emailContent}</p>
        </div>
        
        <div class="share-section">
          <h3 style="color: #b47775; margin: 0 0 10px 0;">Share Your Results!</h3>
          <p style="margin: 0 0 15px 0; color: #43362d;">Let your friends discover their digital nomad type too!</p>
          <div class="share-buttons">
            <a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3003')}&quote=I%20just%20discovered%20I%27m%20a%20${encodeURIComponent(result.name)}%20%F0%9F%8C%8D%20What%27s%20your%20digital%20nomad%20type%3F%20Take%20the%20quiz%21" target="_blank" class="share-button facebook">📘 Facebook</a>
            <a href="https://wa.me/?text=I%20just%20discovered%20I%27m%20a%20${encodeURIComponent(result.name)}%20%F0%9F%8C%8D%20What%27s%20your%20digital%20nomad%20type%3F%20Take%20the%20quiz%3A%20${encodeURIComponent(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3003')}" target="_blank" class="share-button whatsapp">💬 WhatsApp</a>
            <a href="https://twitter.com/intent/tweet?text=I%20just%20discovered%20I%27m%20a%20${encodeURIComponent(result.name)}%20%F0%9F%8C%8D%20What%27s%20your%20digital%20nomad%20type%3F&url=${encodeURIComponent(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3003')}" target="_blank" class="share-button twitter">🐦 Twitter</a>
            <a href="https://www.instagram.com/" target="_blank" class="share-button instagram">📸 Instagram</a>
          </div>
          <p style="font-size: 12px; color: #666; margin-top: 10px;">Note: Instagram doesn't support direct link sharing, but you can share a screenshot of your results!</p>
        </div>
        
        <div style="text-align: center;">
          <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3003'}" class="cta-button">
            Take Quiz Again
          </a>
        </div>
        
        <div class="footer">
          <p>Thanks for taking our quiz!</p>
          <p>Co404 - Discover Your Digital Nomad Type</p>
        </div>
      </div>
    </body>
    </html>
  `

  return {
    subject: `Your Result: ${result.name} - Co404 Quiz`,
    html,
    text: emailContent
  }
}
