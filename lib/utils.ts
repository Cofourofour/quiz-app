import { createHash } from 'crypto'

/**
 * Hash an IP address using SHA-256 for privacy-friendly storage
 */
export function hashIP(ip: string): string {
  return createHash('sha256').update(ip).digest('hex')
}

/**
 * Get the client IP address from request headers
 */
export function getClientIP(request: Request): string {
  // Check various headers that might contain the real IP
  const forwarded = request.headers.get('x-forwarded-for')
  const realIP = request.headers.get('x-real-ip')
  const cfConnectingIP = request.headers.get('cf-connecting-ip')
  
  if (forwarded) {
    // x-forwarded-for can contain multiple IPs, get the first one
    return forwarded.split(',')[0].trim()
  }
  
  if (realIP) {
    return realIP
  }
  
  if (cfConnectingIP) {
    return cfConnectingIP
  }
  
  // Fallback - this won't work in production behind a proxy
  return '127.0.0.1'
}

/**
 * Simple rate limiting - for now just return allowed
 * In production you'd want to implement proper rate limiting
 */
export async function checkRateLimit(ipHash: string): Promise<{ allowed: boolean; submissions: number; limit: number }> {
  // For SQLite version, we'll implement a simple in-memory rate limiter
  // In production, you'd want to use Redis or similar
  return { allowed: true, submissions: 0, limit: 5 }
}

/**
 * Extract user agent and referrer from request headers
 */
export function extractRequestMetadata(request: Request): {
  userAgent: string | null
  referrer: string | null
} {
  return {
    userAgent: request.headers.get('user-agent'),
    referrer: request.headers.get('referer') || request.headers.get('referrer')
  }
}

/**
 * Validate that the submission data looks legitimate
 */
export function validateSubmissionData(data: {
  email: string
  consent: boolean
  answers: Array<{ question_id: string; selected_label: string }>
}): { valid: boolean; errors: string[] } {
  const errors: string[] = []
  
  // Check email format
  if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push('Invalid email address format')
  }
  
  // Check consent
  if (!data.consent) {
    errors.push('Consent is required')
  }
  
  // Check answers
  if (!Array.isArray(data.answers) || data.answers.length === 0) {
    errors.push('No answers provided')
  } else {
    // Validate each answer
    data.answers.forEach((answer, index) => {
      if (!answer.question_id || typeof answer.question_id !== 'string') {
        errors.push(`Answer ${index + 1}: Invalid question_id`)
      }
      
      if (!answer.selected_label || !['A', 'B', 'C', 'D'].includes(answer.selected_label.toUpperCase())) {
        errors.push(`Answer ${index + 1}: Invalid selected_label`)
      }
    })
  }
  
  return {
    valid: errors.length === 0,
    errors
  }
}
