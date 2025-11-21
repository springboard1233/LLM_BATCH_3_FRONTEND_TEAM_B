import { useEffect } from 'react'

function Toast({ toast, clearToast }) {
  useEffect(() => {
    const timer = setTimeout(clearToast, 2500)
    return () => clearTimeout(timer)
  }, [toast])

  const bgColor = {
    success: 'bg-green-600',
    info: 'bg-blue-600',
    error: 'bg-red-600'
  }[toast.type]

  return (
    <div className={`fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg ${bgColor} text-white`}>
      {toast.message}
    </div>
  )
}

export default Toast