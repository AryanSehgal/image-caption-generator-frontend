import { useState, useRef, type DragEvent, type ChangeEvent } from 'react'
import './App.css'

const API_URL = import.meta.env.VITE_API_URL as string

interface CaptionResult {
  image: string
  caption: string
}

const SAMPLE_IMAGES = [
  '/samples/sample1.jpg',
  '/samples/sample2.jpg',
  '/samples/sample3.jpg',
  '/samples/sample4.jpg',
  '/samples/sample5.jpg',
  '/samples/sample6.jpg',
]

function App() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<CaptionResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFile = (file: File) => {
    setSelectedFile(file)
    setPreviewUrl(URL.createObjectURL(file))
    setResult(null)
    setError(null)
  }

  const handleSampleClick = async (path: string) => {
    const response = await fetch(path)
    const blob = await response.blob()
    const filename = path.split('/').pop() || 'sample.jpg'
    const file = new File([blob], filename, { type: blob.type })
    handleFile(file)
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) handleFile(file)
  }

  const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  const handleSubmit = async () => {
    if (!selectedFile) return
    setIsLoading(true)
    setError(null)
    setResult(null)

    try {
      const formData = new FormData()
      formData.append('userfile', selectedFile)

      const response = await fetch(`${API_URL}/caption`, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errData = await response.json().catch(() => null)
        throw new Error(errData?.error || `Server error (${response.status})`)
      }

      const data: CaptionResult = await response.json()
      setResult(data)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Something went wrong. Please try again.'
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setSelectedFile(null)
    setPreviewUrl(null)
    setResult(null)
    setError(null)
  }

  return (
    <div className="app">
      <header className="header">
        <h1>📸 Caption Bot</h1>
        <p>Upload a photo and let AI describe what it sees!</p>
      </header>

      <main className="main">
        {!result && (
          <div
            className={`dropzone ${isDragging ? 'dropzone--active' : ''}`}
            onDragOver={(e) => {
              e.preventDefault()
              setIsDragging(true)
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileInput}
              hidden
            />
            {previewUrl ? (
              <img src={previewUrl} alt="Preview" className="preview-img" />
            ) : (
              <>
                <span className="format-badge">JPG ONLY</span>
                <div className="dropzone-emoji">🖼️</div>
                <p className="dropzone-text">
                  Drag & drop an JPG image here, or click to browse
                </p>
                <p className="dropzone-hint">
                  Works best with photos of people, dogs, and everyday outdoor scenes
                </p>
              </>
            )}
          </div>
        )}

        {!selectedFile && !result && (
          <div className="samples">
            <p className="samples-label">Or try a sample:</p>
            <div className="samples-grid">
              {SAMPLE_IMAGES.map((path) => (
                <img
                  key={path}
                  src={path}
                  alt="Sample"
                  className="sample-thumb"
                  onClick={() => handleSampleClick(path)}
                />
              ))}
            </div>
          </div>
        )}

        {selectedFile && !result && (
          <button
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? '✨ Generating caption...' : '🚀 Generate Caption'}
          </button>
        )}

        {isLoading && (
          <p className="hint">
            First request can take up to a minute while the server wakes up —
            hang tight!
          </p>
        )}

        {error && <div className="error-box">⚠️ {error}</div>}

        {result && (
          <div className="result-card">
            <img src={result.image} alt="Captioned" className="result-img" />
            <p className="caption-text">"{result.caption}"</p>
            <button className="btn btn-secondary" onClick={handleReset}>
              🔄 Try Another Image
            </button>
          </div>
        )}
      </main>

      <footer className="footer">Built with React, TypeScript & a dash of AI ✨</footer>
    </div>
  )
}

export default App