'use client';

import React from 'react';
import { useEffect } from 'react'
import {FcGoogle, } from "react-icons/fc";
import {FaGithub, } from "react-icons/fa";
import { toast } from 'react-toastify';
import { signIn, signOut} from "next-auth/react";


const SocialButtons = () => {

  const handleClick = async (event, provider) => {
    event.preventDefault();

    try {
      await signIn(provider, { redirectTo: "/dashboard" });
        
     } catch (error) {
      toast.error("Authentication error: " + error.message);
     }
   };


  return (
    <form onSubmit={handleClick} >
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-2">
              <button className="inline-flex items-center justify-center gap-3 py-2 text-sm font-normal text-gray-700 transition-colors bg-gray-100 rounded-lg px-7 hover:bg-gray-200 hover:text-gray-800 dark:bg-white/5 dark:text-white/90 dark:hover:bg-white/10"
              onClick={(event) => handleClick(event, 'google')}>
              <FcGoogle className="w-6 h-6"/>
                With Google
              </button>
              <button className="inline-flex items-center justify-center gap-3 py-2 text-sm font-normal text-gray-700 transition-colors bg-gray-100 rounded-lg px-7 hover:bg-gray-200 hover:text-gray-800 dark:bg-white/5 dark:text-white/90 dark:hover:bg-white/10"
              onClick={(event) => handleClick(event, 'X')}>
                <svg
                  width="21"
                  className="fill-current"
                  height="20"
                  viewBox="0 0 21 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M15.6705 1.875H18.4272L12.4047 8.75833L19.4897 18.125H13.9422L9.59717 12.4442L4.62554 18.125H1.86721L8.30887 10.7625L1.51221 1.875H7.20054L11.128 7.0675L15.6705 1.875ZM14.703 16.475H16.2305L6.37054 3.43833H4.73137L14.703 16.475Z" />
                </svg>
                With X
              </button>
            </div>
    </form>
  )
}

export default SocialButtons;