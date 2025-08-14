import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    message: 'Test endpoint working'
  })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    return NextResponse.json({
      status: 'ok',
      message: 'POST received successfully',
      receivedData: body
    })
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: 'Failed to parse JSON',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 400 })
  }
}
