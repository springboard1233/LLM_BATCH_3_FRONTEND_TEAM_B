import { useState } from 'react'

const navItems = [
  'Dashboard',
  'Analytics',
  'Transaction Management',
  'Risk Analysis',
  'Activity Map',
  'Export',
  'Settings'
]

function Sidebar({ currentPage, setCurrentPage }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <div className={`fixed inset-0 bg-black bg-opacity-50 z-20 transition-opacity duration-200 sm:hidden
        ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsOpen(false)}
      />
      
      <nav className={`fixed sm:static w-64 h-full bg-gray-800 transform transition-transform duration-200 z-30
        ${isOpen ? 'translate-x-0' : '-translate-x-full sm:translate-x-0'}`}>
        <div className="p-4">
          <h1 className="text-lg md:text-xl font-bold mb-6 md:mb-8">Dashboard</h1>
          <ul className="space-y-2">
            {navItems.map(item => (
              <li key={item}>
                <button
                  onClick={() => {
                    setCurrentPage(item)
                    setIsOpen(false)
                  }}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors min-h-[44px] text-sm md:text-base
                    ${currentPage === item ? 'bg-blue-600 text-white' : 'hover:bg-gray-700'}`}
                >
                  {item}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </>
  )
}

export default Sidebar