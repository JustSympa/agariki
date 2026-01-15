export function SecurityIllustration() {
  return (
    <div className="relative w-48 h-48">
      <div className="absolute inset-0 bg-linear-to-br from-blue-50 to-blue-100 rounded-2xl" />
      
      {/* Shield */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="w-32 h-32 border-4 border-blue-300 rounded-full relative">
          {/* Shield shape */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-24 h-32 bg-white rounded-t-full border-x-4 border-t-4 border-blue-300" />
          
          {/* Lock */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
            <div className="w-12 h-12 bg-blue-500 rounded-lg relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-6 h-4 bg-blue-500 rounded-t-full" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Checkmarks */}
      <div className="absolute top-4 left-4 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <div className="absolute top-4 right-4 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
        </svg>
      </div>
    </div>
  )
}