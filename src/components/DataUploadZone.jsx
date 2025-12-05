import { useRef, useState } from 'react'
import ProgressBar from './ProgressBar'
import useResponsive from '../hooks/useResponsive'

function DataUploadZone({ uploadedFile, setUploadedFile, uploadProgress, setUploadProgress, setToast }) {
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef()
  const { isMobile } = useResponsive()

  const handleFile = (file) => {
    if (!file) return
    
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

  // Handle touch events for mobile devices
  const handleTouchStart = (e) => {
    // Prevent default to allow custom handling
    if (e.touches.length === 1) {
      setIsDragging(true)
    }
  }

  const handleTouchEnd = () => {
    setIsDragging(false)
  }

  return (
    <div
      className={`border-2 border-dashed rounded-lg transition-colors
        ${isMobile ? 'p-4 sm:p-6' : 'p-8'}
        text-center
        ${isDragging ? 'border-blue-500 bg-blue-500 bg-opacity-10' : 'border-gray-600 dark:border-gray-500'}`}
      onDragOver={e => {
        e.preventDefault()
        setIsDragging(true)
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={e => {
        e.preventDefault()
        setIsDragging(false)
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
          handleFile(e.dataTransfer.files[0])
        }
      }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <input
        type="file"
        className="hidden"
        ref={fileInputRef}
        onChange={e => handleFile(e.target.files[0])}
        accept=".csv,.json,.xlsx,.xls"
      />
      
      {uploadedFile && uploadProgress < 100 ? (
        <div className="max-w-md mx-auto">
          <p className={`mb-4 ${isMobile ? 'text-sm' : 'text-base'} truncate px-2`}>
            Uploading: {uploadedFile.name}
          </p>
          <ProgressBar progress={uploadProgress} />
        </div>
      ) : (
        <div className="space-y-3 md:space-y-4">
          <p className={`${isMobile ? 'text-sm' : 'text-base'} text-gray-700 dark:text-gray-300`}>
            {isMobile ? 'Tap to upload a file' : 'Drag & drop a file here or'}
          </p>
          <button
            onClick={() => fileInputRef.current.click()}
            className={`${isMobile ? 'min-h-[44px] min-w-[44px] px-6 py-3 text-sm' : 'px-4 py-2'} 
              bg-blue-600 rounded-lg hover:bg-blue-700 active:bg-blue-800 
              transition-colors font-medium text-white`}
          >
            Browse Files
          </button>
          {!isMobile && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Supported formats: CSV, JSON, Excel
            </p>
          )}
        </div>
      )}
    </div>
  )
}

export default DataUploadZone