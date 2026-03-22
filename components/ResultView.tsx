'use client'

import { useState } from 'react'

interface ResultViewProps {
  originalImage: string | null
  resultImage: string | null
  status: 'success' | 'error'
  error: string | null
  onReset: () => void
}

export default function ResultView({ 
  originalImage, 
  resultImage, 
  status, 
  error,
  onReset 
}: ResultViewProps) {
  const [isDownloading, setIsDownloading] = useState(false)

  const handleDownload = async () => {
    if (!resultImage) return
    
    setIsDownloading(true)
    try {
      const response = await fetch(resultImage)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'removed-background.png'
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (err) {
      console.error('Download failed:', err)
    } finally {
      setIsDownloading(false)
    }
  }

  if (status === 'error') {
    return (
      <div className="text-center">
        <div className="mb-6">
          <div className="w-20 h-20 mx-auto bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-10 h-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        </div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">Processing Failed</h3>
        <p className="text-red-500 mb-6">{error || 'Something went wrong. Please try again.'}</p>
        <button onClick={onReset} className="btn-secondary">
          Try Another Image
        </button>
      </div>
    )
  }

  return (
    <div className="text-center">
      {/* Comparison View */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div>
          <p className="text-sm text-gray-500 mb-2 font-medium">Original</p>
          <div className="relative bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%3E%3Crect%20width%3D%2216%22%20height%3D%2216%22%20fill%3D%22%23e5e7eb%22%2F%3E%3Crect%20x%3D%220%22%20y%3D%220%22%20width%3D%228%22%20height%3D%228%22%20fill%3D%22%23fff%22%2F%3E%3Crect%20x%3D%228%22%20y%3D%228%22%20width%3D%228%22%20height%3D%228%22%20fill%3D%22%23fff%22%2F%3E%3C%2Fsvg%3E')] rounded-xl overflow-hidden">
            <img
              src={originalImage!}
              alt="Original"
              className="max-h-64 mx-auto"
            />
          </div>
        </div>
        <div>
          <p className="text-sm text-gray-500 mb-2 font-medium">Background Removed</p>
          <div className="relative bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%3E%3Crect%20width%3D%2216%22%20height%3D%2216%22%20fill%3D%22%23e5e7eb%22%2F%3E%3Crect%20x%3D%220%22%20y%3D%220%22%20width%3D%228%22%20height%3D%228%22%20fill%3D%22%23fff%22%2F%3E%3Crect%20x%3D%228%22%20y%3D%228%22%20width%3D%228%22%20height%3D%228%22%20fill%3D%22%23fff%22%2F%3E%3C%2Fsvg%3E')] rounded-xl overflow-hidden">
            <img
              src={resultImage!}
              alt="Result"
              className="max-h-64 mx-auto"
            />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button 
          onClick={handleDownload}
          disabled={isDownloading}
          className="btn-primary flex items-center justify-center gap-2"
        >
          {isDownloading ? (
            <>
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Downloading...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download PNG
            </>
          )}
        </button>
        <button onClick={onReset} className="btn-secondary">
          Process Another Image
        </button>
      </div>
    </div>
  )
}
