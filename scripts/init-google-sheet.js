// Script to initialize Google Sheet with proper headers
// Run this once after setting up your Google Sheets integration

require('dotenv').config({ path: '.env.local' })
const { google } = require('googleapis')

class GoogleSheetsService {
  constructor() {
    this.auth = new google.auth.GoogleAuth({
      credentials: {
        type: 'service_account',
        project_id: process.env.GOOGLE_PROJECT_ID,
        private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        client_id: process.env.GOOGLE_CLIENT_ID,
        auth_uri: 'https://accounts.google.com/o/oauth2/auth',
        token_uri: 'https://oauth2.googleapis.com/token',
        auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
        client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/${process.env.GOOGLE_CLIENT_EMAIL}`
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets']
    })

    this.sheets = google.sheets({ version: 'v4', auth: this.auth })
  }

  async initializeSheet() {
    try {
      const spreadsheetId = process.env.GOOGLE_SHEET_ID
      
      if (!spreadsheetId) {
        console.error('GOOGLE_SHEET_ID not configured')
        return false
      }

      // Add headers if the sheet is empty
      const headers = [
        'Timestamp',
        'Email',
        'Quiz',
        'Result Key',
        'Result Name',
        'Result URL'
      ]

      // Check if headers exist
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId,
        range: 'Sheet1!A1:F1'
      })

      if (!response.data.values || response.data.values.length === 0) {
        // Add headers
        await this.sheets.spreadsheets.values.update({
          spreadsheetId,
          range: 'Sheet1!A1:F1',
          valueInputOption: 'RAW',
          resource: {
            values: [headers]
          }
        })
        console.log('✅ Headers added to Google Sheet')
      } else {
        console.log('✅ Headers already exist in Google Sheet')
      }

      return true
    } catch (error) {
      console.error('Failed to initialize Google Sheet:', error.message)
      return false
    }
  }
}

async function initializeGoogleSheet() {
  console.log('Initializing Google Sheet with headers...')
  
  try {
    const sheetsService = new GoogleSheetsService()
    const success = await sheetsService.initializeSheet()
    
    if (success) {
      console.log('✅ Google Sheet initialized successfully!')
      console.log('📊 Headers added: Timestamp, Email, Quiz, Result Key, Result Name, Result URL')
      console.log(`📋 Sheet ID: ${process.env.GOOGLE_SHEET_ID}`)
      console.log('🎉 Your quiz submissions will now be automatically saved to Google Sheets!')
    } else {
      console.error('❌ Failed to initialize Google Sheet')
      console.log('💡 Make sure you:')
      console.log('   1. Added all environment variables to .env.local')
      console.log('   2. Shared the Google Sheet with your service account email')
      console.log('   3. Enabled Google Sheets API in Google Cloud Console')
    }
  } catch (error) {
    console.error('❌ Error:', error.message)
    console.log('💡 Troubleshooting:')
    console.log('   - Check your .env.local file has all required variables')
    console.log('   - Verify the Google Sheet ID is correct')
    console.log('   - Ensure the service account has access to the sheet')
  }
}

initializeGoogleSheet()
