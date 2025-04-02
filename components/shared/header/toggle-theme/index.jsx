'use client';

import { useTheme } from 'next-themes';
import { MoonIcon, SunIcon} from 'lucide-react';  
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

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
        <Button variant='ghost' onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
                {
                    theme === 'light' ? <SunIcon/> : <MoonIcon/> // This is just for debugging purposes, you can remove it if you want
                }
       </Button>
    </div>
  )
}

export default ToggleTheme

