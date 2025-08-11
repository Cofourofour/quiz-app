import { google } from 'googleapis'

// Google Sheets integration for lead collection
export class GoogleSheetsService {
  private sheets: any
  private auth: any

  constructor() {
    // Use service account authentication
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

  async appendToSheet(data: {
    email: string
    quiz_slug: string
    result_key: string
    result_name: string
    timestamp: Date
  }) {
    try {
      const spreadsheetId = process.env.GOOGLE_SHEET_ID
      
      if (!spreadsheetId) {
        console.error('GOOGLE_SHEET_ID not configured')
        return false
      }

      // Format data for the sheet
      const values = [[
        data.timestamp.toISOString(),
        data.email,
        data.quiz_slug,
        data.result_key,
        data.result_name,
        `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/result/${data.result_key}`
      ]]

      await this.sheets.spreadsheets.values.append({
        spreadsheetId,
        range: 'Sheet1!A:F', // Adjust range as needed
        valueInputOption: 'RAW',
        insertDataOption: 'INSERT_ROWS',
        resource: {
          values
        }
      })

      return true
    } catch (error) {
      console.error('Failed to append to Google Sheet:', error)
      return false
    }
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
      }

      return true
    } catch (error) {
      console.error('Failed to initialize Google Sheet:', error)
      return false
    }
  }
}

export const googleSheets = new GoogleSheetsService()
