import { useRef, useState } from 'react'
import ProgressBar from './ProgressBar'

function DataUploadZone({ uploadedFile, setUploadedFile, uploadProgress, setUploadProgress, setToast }) {
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef()

  const handleFile = (file) => {
    setUploadedFile(file)
    setUploadProgress(0)
    
    // Simulate upload
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setToast({
            type: 'success',
            message: 'File uploaded successfully!'
          })
          return 100
        }
        return prev + 10
      })
    }, 200)
  }

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors
        ${isDragging ? 'border-blue-500 bg-blue-500 bg-opacity-10' : 'border-gray-600'}`}
      onDragOver={e => {
        e.preventDefault()
        setIsDragging(true)
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={e => {
        e.preventDefault()
        setIsDragging(false)
        handleFile(e.dataTransfer.files[0])
      }}
    >
      <input
        type="file"
        className="hidden"
        ref={fileInputRef}
        onChange={e => handleFile(e.target.files[0])}
      />
      
      {uploadedFile && uploadProgress < 100 ? (
        <div className="max-w-md mx-auto">
          <p className="mb-4">Uploading: {uploadedFile.name}</p>
          <ProgressBar progress={uploadProgress} />
        </div>
      ) : (
        <div>
          <p className="mb-4">Drag & drop a file here or</p>
          <button
            onClick={() => fileInputRef.current.click()}
            className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Browse Files
          </button>
        </div>
      )}
    </div>
  )
}

export default DataUploadZone