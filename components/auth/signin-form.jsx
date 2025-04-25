'use client';

import React, { Fragment } from 'react';
import { useState, useEffect } from "react";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import SocialButtons from './social-buttons';
import Link from 'next/link';
import { useRouter } from "next/navigation";
import { ArrowRightIcon, AtSymbolIcon,  KeyIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/solid';
import { toast } from 'react-toastify';
import { ZodErrors } from "@/components/common/zod-errors";
import { signInWithCredentials } from '@/actions/user-actions';
//import { useSearchParams } from 'next/navigation';



const SignInForm = () => {

  const router = useRouter();
  const [state, setState] = useState(null);
  const [visible, setVisible] = useState(false);
  const [password, setPassword] = useState("");


  async function onSubmit(event) {
    event.preventDefault();
    try {
        const formData = new FormData(event.currentTarget);
        const response = await signInWithCredentials(formData);
        if (response.error) {
            setState(response);
            toast.error(response.error);
         } //else {
        //     router.push("/dashboard");
        // }
    } catch (e) {
      toast.error("Check your Credentials: " + e);
    }
 }

  return (
    <form onSubmit={onSubmit}>
    <div className='space-y-6'>
      <div className="relative">
        <Label htmlFor='email' className='pb-2'>Email:</Label>
        <Input
          name="email"
          className="pl-6"
          type="email"
          autoComplete="email"
        />
        <AtSymbolIcon className="pointer-events-none absolute left-1 top-2/3 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
      </div>
       <ZodErrors error={state?.zodErrors?.email} />
      <div  className="relative">
        <Label htmlFor='password' className='pb-2'>Password:</Label>
        <Input 
          name="password"
          className="pl-6"
          value={password}
          type={visible ? "text" : "password"}
          autoComplete="current-password"
          minLength={6}
          onChange={(e) => setPassword(e.target.value)}
        />
          <KeyIcon className="pointer-events-none absolute left-1 top-2/3 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
          <span onClick={() => setVisible(!visible)} className="cursor-pointer absolute right-3 top-2/3 h-[20px] w-[20px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900">
              {!visible ? <EyeSlashIcon /> : <EyeIcon />} 
          </span>
      </div>
      <ZodErrors error={state?.zodErrors?.password} />
      <div>
          <Button className="w-full mt-4" size="sm" type="submit">
              Sign In <ArrowRightIcon className="h-5 w-5 text-gray-50" />
          </Button>
      </div>
      <div className='text-sm text-center text-muted-foreground'>
        Don't have an account? {''}
        <Link href='/signup' target='_self' className='link text-blue-500 font-semibold'>Sign Up</Link>
      </div>
    </div>
  </form>
  )
}

export default SignInForm