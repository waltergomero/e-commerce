'use client';

import { useTheme } from 'next-themes';
import { MoonIcon, SunIcon} from 'lucide-react';  
import React, { useState, useEffect } from 'react';

const ToggleTheme = () => {
    const [mounted, setMounted] = useState(false);
    const { theme, setTheme } = useTheme();
    
    useEffect(() => {
        setMounted(true);
    }
    , []);

    if (!mounted) {
        return null;
    }
    return (
    <div className='inline-flex'>
        <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                className="h-12 w-12 rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                {
                    theme === 'light' ? <SunIcon/> : <MoonIcon/> // This is just for debugging purposes, you can remove it if you want
                }
            </button>
    </div>
  )
}

export default ToggleTheme

