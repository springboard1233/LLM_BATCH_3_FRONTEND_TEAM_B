function LiveToggle({ isLiveStream, setIsLiveStream }) {
  return (
    <button
      onClick={() => setIsLiveStream(!isLiveStream)}
      className={`flex items-center gap-2 px-3 py-1 rounded-full transition-colors
        ${isLiveStream ? 'bg-green-600 text-white' : 'bg-gray-600'}`}
    >
      <div className={`w-3 h-3 rounded-full ${isLiveStream ? 'bg-green-300' : 'bg-gray-400'}`} />
      <span>Live Stream: {isLiveStream ? 'ON' : 'OFF'}</span>
    </button>
  )
}

export default LiveToggle