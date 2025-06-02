import React from 'react'
import {LoaderPinwheel} from "lucide-react"
const ChatLoader = () => {
  return (
    <div className='flex flex-col justify-center items-center p-4 h-[80vh]'>
      <LoaderPinwheel className='animate-spin size-12 text-primary'/>
      <p className='text-lg font-mono text-center mt-4'>Connectine to chat....</p>
    </div>
  )
}

export default ChatLoader
