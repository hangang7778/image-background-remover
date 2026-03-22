import { NextRequest, NextResponse } from 'next/server'

const REMOVE_BG_API_KEY = process.env.REMOVE_BG_API_KEY || ''
const REMOVE_BG_API_URL = 'https://api.remove.bg/v1.0/removebg'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const imageFile = formData.get('image') as File

    if (!imageFile) {
      return NextResponse.json(
        { error: 'No image file provided' },
        { status: 400 }
      )
    }

    // Validate file size (10MB max)
    if (imageFile.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size exceeds 10MB limit' },
        { status: 400 }
      )
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (!validTypes.includes(imageFile.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Please upload JPG, PNG, or WebP' },
        { status: 400 }
      )
    }

    if (!REMOVE_BG_API_KEY) {
      return NextResponse.json(
        { error: 'Remove.bg API key not configured' },
        { status: 500 }
      )
    }

    // Convert file to buffer for remove.bg API
    const arrayBuffer = await imageFile.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Call remove.bg API
    const removeBgResponse = await fetch(REMOVE_BG_API_URL, {
      method: 'POST',
      headers: {
        'X-Api-Key': REMOVE_BG_API_KEY,
      },
      body: buffer,
      signal: AbortSignal.timeout(30000),
    })

    if (!removeBgResponse.ok) {
      const errorText = await removeBgResponse.text()
      console.error('Remove.bg API error:', errorText)
      
      if (removeBgResponse.status === 402) {
        return NextResponse.json(
          { error: 'API credits exhausted. Please try again later.' },
          { status: 402 }
        )
      }
      
      return NextResponse.json(
        { error: 'Failed to process image. Please try again.' },
        { status: removeBgResponse.status }
      )
    }

    // Get the result as buffer
    const resultBuffer = await removeBgResponse.arrayBuffer()
    const base64 = Buffer.from(resultBuffer).toString('base64')
    const dataUrl = `data:image/png;base64,${base64}`

    return NextResponse.json({
      success: true,
      resultUrl: dataUrl,
    })
  } catch (error) {
    console.error('Error processing image:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
}
