'use client'

import { useState, useCallback, useRef } from 'react'
import ImageUploader from '@/components/ImageUploader'
import ImagePreview from '@/components/ImagePreview'
import ResultView from '@/components/ResultView'

type ProcessStatus = 'idle' | 'uploading' | 'processing' | 'success' | 'error'

export default function Home() {
  const [originalImage, setOriginalImage] = useState<string | null>(null)
  const [resultImage, setResultImage] = useState<string | null>(null)
  const [status, setStatus] = useState<ProcessStatus>('idle')
  const [error, setError] = useState<string | null>(null)
  const [remainingCredits, setRemainingCredits] = useState(5)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file (JPG, PNG, or WebP)')
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB')
      return
    }

    // Read and display original image
    const reader = new FileReader()
    reader.onload = (e) => {
      setOriginalImage(e.target?.result as string)
    }
    reader.readAsDataURL(file)

    // Process image
    setStatus('uploading')
    setError(null)

    try {
      setStatus('processing')
      
      const formData = new FormData()
      formData.append('image', file)

      const response = await fetch('/api/remove-bg', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to process image')
      }

      const data = await response.json()
      
      if (data.error) {
        throw new Error(data.error)
      }

      setResultImage(data.resultUrl)
      setRemainingCredits(prev => prev - 1)
      setStatus('success')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setStatus('error')
    }
  }, [])

  const handleReset = useCallback(() => {
    setOriginalImage(null)
    setResultImage(null)
    setStatus('idle')
    setError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }, [])

  return (
    <main className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
            BG Remover
          </h1>
          <p className="text-gray-600 text-lg">
            Remove image backgrounds instantly with AI
          </p>
          <div className="mt-4 text-sm text-gray-500">
            {remainingCredits > 0 ? (
              <span className="text-green-600">{remainingCredits} free credits remaining today</span>
            ) : (
              <span className="text-red-500">No credits remaining. Come back tomorrow!</span>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12">
          {status === 'idle' && (
            <ImageUploader onFileSelect={handleFileSelect} />
          )}

          {(status === 'uploading' || status === 'processing') && originalImage && (
            <ImagePreview 
              originalImage={originalImage} 
              status={status === 'uploading' ? 'Uploading...' : 'Removing background...'}
            />
          )}

          {(status === 'success' || status === 'error') && originalImage && (
            <ResultView
              originalImage={originalImage}
              resultImage={resultImage}
              status={status}
              error={error}
              onReset={handleReset}
            />
          )}
        </div>

        {/* Footer Info */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>Supports JPG, PNG, WebP • Max 10MB per image</p>
          <p className="mt-2">Images are processed in memory and not stored anywhere</p>
        </div>
      </div>
    </main>
  )
}
