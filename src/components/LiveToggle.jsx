function LiveToggle({ isLiveStream, setIsLiveStream }) {
  return (
    <button
      onClick={() => setIsLiveStream(!isLiveStream)}
      className={`flex items-center gap-2 px-4 py-2.5 rounded-full transition-colors min-h-[44px] min-w-[44px]
        ${isLiveStream ? 'bg-green-600 text-white' : 'bg-gray-600'}`}
    >
      <div className={`w-3 h-3 rounded-full flex-shrink-0 ${isLiveStream ? 'bg-green-300' : 'bg-gray-400'}`} />
      <span className="text-sm font-medium whitespace-nowrap">Live Stream: {isLiveStream ? 'ON' : 'OFF'}</span>
    </button>
  )
}

export default LiveToggle