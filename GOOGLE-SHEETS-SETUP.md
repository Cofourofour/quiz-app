# Google Sheets Integration Setup

This guide will help you set up Google Sheets integration to automatically save all quiz submissions to a Google Sheet owned by co404coliving@gmail.com.

## Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Sign in with co404coliving@gmail.com
3. Click "Create Project" or use an existing project
4. Name your project (e.g., "Quiz App Lead Collection")
5. Note your Project ID

## Step 2: Enable Google Sheets API

1. In Google Cloud Console, go to "APIs & Services" > "Library"
2. Search for "Google Sheets API"
3. Click on it and click "Enable"

## Step 3: Create a Service Account

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "Service Account"
3. Name it "quiz-app-sheets" or similar
4. Click "Create and Continue"
5. For roles, add "Editor" role (or create custom role with Sheets access)
6. Click "Done"

## Step 4: Generate Service Account Key

1. In the Credentials page, find your service account
2. Click on it to open details
3. Go to "Keys" tab
4. Click "Add Key" > "Create New Key"
5. Choose "JSON" format
6. Download the JSON file - **KEEP THIS SECURE!**

## Step 5: Create Your Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Sign in with co404coliving@gmail.com
3. Create a new spreadsheet
4. Name it "Quiz App Leads" or similar
5. Copy the Sheet ID from the URL:
   - URL: `https://docs.google.com/spreadsheets/d/SHEET_ID_HERE/edit`
   - Copy the SHEET_ID_HERE part

## Step 6: Share Sheet with Service Account

1. In your Google Sheet, click "Share" button
2. Add the service account email (from the JSON file, looks like: xxx@projectname.iam.gserviceaccount.com)
3. Give it "Editor" permissions
4. Click "Send"

## Step 7: Add Environment Variables

Add these to your `.env.local` file:

```bash
# Google Sheets Integration
GOOGLE_PROJECT_ID=your-project-id
GOOGLE_PRIVATE_KEY_ID=from-json-file
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nyour-private-key-here\n-----END PRIVATE KEY-----"
GOOGLE_CLIENT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_CLIENT_ID=from-json-file
GOOGLE_SHEET_ID=your-google-sheet-id
```

**Important**: The private key should be in quotes and keep the actual line breaks as `\n`.

## Step 8: Test the Integration

1. Restart your development server: `npm run dev`
2. Submit a test quiz
3. Check your Google Sheet - you should see a new row with:
   - Timestamp
   - Email
   - Quiz name
   - Result key
   - Result name
   - Result URL

## Security Notes

- Never commit the service account JSON file to version control
- The service account has access only to sheets you explicitly share with it
- Consider using different service accounts for development and production
- Regularly rotate service account keys

## Troubleshooting

### "Permission denied" errors
- Make sure you shared the Google Sheet with the service account email
- Check that the service account has Editor permissions

### "Invalid credentials" errors
- Verify all environment variables are correctly set
- Make sure the private key includes the header/footer and `\n` characters
- Check that the Google Sheets API is enabled in Google Cloud Console

### "Sheet not found" errors
- Verify the GOOGLE_SHEET_ID is correct
- Make sure the sheet is shared with the service account

## Data Format

Your Google Sheet will automatically collect these columns:
- **Timestamp**: When the quiz was submitted
- **Email**: User's email address
- **Quiz**: Quiz identifier/slug
- **Result Key**: The calculated result (A, B, C, D)
- **Result Name**: The personality type name
- **Result URL**: Direct link to view the result

This gives you a complete lead database with personality insights for follow-up marketing!
