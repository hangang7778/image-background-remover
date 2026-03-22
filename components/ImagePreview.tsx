'use client'

interface ImagePreviewProps {
  originalImage: string
  status: string
}

export default function ImagePreview({ originalImage, status }: ImagePreviewProps) {
  return (
    <div className="text-center">
      <div className="mb-6">
        <div className="relative inline-block">
          <img
            src={originalImage}
            alt="Original"
            className="max-h-80 rounded-xl shadow-lg"
          />
          <div className="absolute inset-0 bg-black/20 rounded-xl flex items-center justify-center">
            <div className="bg-white/90 backdrop-blur px-6 py-3 rounded-full shadow-lg">
              <div className="flex items-center gap-3">
                <svg className="animate-spin h-5 w-5 text-indigo-600" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span className="font-medium text-gray-700">{status}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <p className="text-gray-500">Processing your image...</p>
    </div>
  )
}
