import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export interface EmailTemplate {
  subject: string
  html: string
}

export interface PersonaResult {
  name: string
  headline: string | null
  description: string | null
}

/**
 * Replace template tokens in email content
 */
export function replaceEmailTokens(
  template: string,
  result: PersonaResult,
  ctaUrl: string = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
): string {
  return template
    .replace(/\{\{RESULT_NAME\}\}/g, result.name)
    .replace(/\{\{RESULT_HEADLINE\}\}/g, result.headline || '')
    .replace(/\{\{RESULT_DESCRIPTION\}\}/g, result.description || '')
    .replace(/\{\{CTA_URL\}\}/g, ctaUrl)
}

/**
 * Send quiz result email using Resend
 */
export async function sendQuizResultEmail(
  to: string,
  emailTemplate: EmailTemplate,
  result: PersonaResult
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    const fromEmail = process.env.RESEND_FROM
    if (!fromEmail) {
      throw new Error('RESEND_FROM environment variable is not set')
    }

    // Replace tokens in both subject and HTML content
    const processedSubject = replaceEmailTokens(emailTemplate.subject, result)
    const processedHtml = replaceEmailTokens(emailTemplate.html, result)

    const response = await resend.emails.send({
      from: fromEmail,
      to: [to],
      subject: processedSubject,
      html: processedHtml,
    })

    if (response.error) {
      console.error('Resend API error:', response.error)
      return {
        success: false,
        error: response.error.message || 'Failed to send email'
      }
    }

    return {
      success: true,
      messageId: response.data?.id
    }
  } catch (error) {
    console.error('Email sending error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown email error'
    }
  }
}

/**
 * Validate email address format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Generate a simple text version from HTML for better email client compatibility
 */
export function htmlToText(html: string): string {
  return html
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/&nbsp;/g, ' ') // Replace &nbsp; with space
    .replace(/&amp;/g, '&') // Replace &amp; with &
    .replace(/&lt;/g, '<') // Replace &lt; with <
    .replace(/&gt;/g, '>') // Replace &gt; with >
    .replace(/&quot;/g, '"') // Replace &quot; with "
    .replace(/&#39;/g, "'") // Replace &#39; with '
    .replace(/\s+/g, ' ') // Replace multiple whitespace with single space
    .trim()
}
