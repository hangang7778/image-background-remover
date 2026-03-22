/**
 * Cloudflare Worker for Image Background Removal
 * 
 * Deploy with:
 * 1. Create worker: npx wrangler init worker
 * 2. Configure in wrangler.toml
 * 3. Deploy: npx wrangler deploy
 */

const REMOVE_BG_API_URL = 'https://api.remove.bg/v1.0/removebg'

interface Env {
  REMOVE_BG_API_KEY: string
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    // Only accept POST requests
    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 })
    }

    try {
      // Parse form data
      const formData = await request.formData()
      const imageFile = formData.get('image') as File | null

      if (!imageFile) {
        return jsonResponse({ error: 'No image file provided' }, 400)
      }

      // Validate file size (10MB max)
      if (imageFile.size > 10 * 1024 * 1024) {
        return jsonResponse({ error: 'File size exceeds 10MB limit' }, 400)
      }

      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/webp']
      if (!validTypes.includes(imageFile.type)) {
        return jsonResponse({ error: 'Invalid file type' }, 400)
      }

      // Get API key
      const apiKey = env.REMOVE_BG_API_KEY
      if (!apiKey) {
        return jsonResponse({ error: 'Remove.bg API key not configured' }, 500)
      }

      // Call remove.bg API
      const removeBgResponse = await fetch(REMOVE_BG_API_URL, {
        method: 'POST',
        headers: {
          'X-Api-Key': apiKey,
        },
        body: imageFile,
      })

      if (!removeBgResponse.ok) {
        const errorText = await removeBgResponse.text()
        console.error('Remove.bg API error:', errorText)
        
        if (removeBgResponse.status === 402) {
          return jsonResponse({ error: 'API credits exhausted' }, 402)
        }
        
        return jsonResponse({ error: 'Failed to process image' }, removeBgResponse.status)
      }

      // Return the result image
      const resultBuffer = await removeBgResponse.arrayBuffer()
      
      return new Response(resultBuffer, {
        status: 200,
        headers: {
          'Content-Type': 'image/png',
          'Cache-Control': 'no-store',
        },
      })
    } catch (error) {
      console.error('Worker error:', error)
      return jsonResponse({ error: 'Internal server error' }, 500)
    }
  },
}

function jsonResponse(data: object, status: number): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}
