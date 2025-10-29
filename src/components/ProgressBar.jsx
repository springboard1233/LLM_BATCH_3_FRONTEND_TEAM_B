function ProgressBar({ progress }) {
  return (
    <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
      <div
        className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500"
        style={{ width: `${progress}%` }}
      />
      <div className="text-sm text-center mt-1">{progress}%</div>
    </div>
  )
}

export default ProgressBar