import React from 'react'

const Loading = () => {
  return (
    <div className="flex space-x-1">
        <div className="w-2 h-8 bg-blue-500 animate-pulse"></div>
        <div className="w-2 h-8 bg-green-500 animate-pulse delay-150"></div>
        <div className="w-2 h-8 bg-red-500 animate-pulse delay-300"></div>
        <div className="w-2 h-8 bg-yellow-500 animate-pulse delay-450"></div>
        <span className='m-2 text-xs'>Loading wait...</span>
    </div>
  )
}

export default Loading;