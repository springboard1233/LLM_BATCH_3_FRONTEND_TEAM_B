import LiveToggle from './LiveToggle'

function Topbar({ currentPage, isLiveStream, setIsLiveStream }) {
  return (
    <header className="bg-gray-800 p-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button className="sm:hidden" onClick={() => document.querySelector('nav').classList.toggle('-translate-x-full')}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <h2 className="text-xl font-semibold">{currentPage}</h2>
      </div>
      <LiveToggle isLiveStream={isLiveStream} setIsLiveStream={setIsLiveStream} />
    </header>
  )
}

export default Topbar