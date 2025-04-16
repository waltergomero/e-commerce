import React from 'react';
import Image from 'next/image';
import loader from '@/assets/loader.gif';

const LoadingPage = () => {
  return (
    <div style={{
        display: 'flex', // Use flexbox to center the loader
        justifyContent: 'center', // Center horizontally
        alignItems: 'center', // Center vertically
        height: '100vh', // Full viewport height
        width: '100vw', // Full viewport width
        backgroundColor: '#f0f0f0', // Optional: Set a background color
    }}>
        <Image src={loader} height={150} width={150} alt='loading ...'/>
    </div>
  )
}

export default LoadingPage