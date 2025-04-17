'use client';

import React, { Fragment } from 'react';
import { useState, useEffect } from "react";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
//import SocialButtons from './social-buttons';
import Link from 'next/link';
import { useRouter } from "next/navigation";
import { ArrowRightIcon, AtSymbolIcon,  KeyIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/solid';
import { toast } from 'react-toastify';
import { ZodErrors } from "@/components/common/zod-errors";
import { signInWithCredentials } from '@/actions/user-actions';
//import { useSearchParams } from 'next/navigation';



const SignInForm = () => {
  //const searchParams = useSearchParams();
  //const error = searchParams.get('error');

  const router = useRouter();
  const [state, setState] = useState(null);
  const [visible, setVisible] = useState(false);
  const [password, setPassword] = useState("");

//   useEffect(() => {
//     if(error === 'OAuthAccountNotLinked'){
//           toast.error("This email was registered with email and passowrd. Please sign in using your credentials.")
//       }
//     }, [])
  
  
 
  async function onSubmit(event) {
    event.preventDefault();
    try {
        const formData = new FormData(event.currentTarget);
        const response = await signInWithCredentials(formData);
        if (response.error) {
            setState(response);
            toast.error(response.error);
        } else {
            router.push("/dashboard");
        }
    } catch (e) {
      toast.error("Check your Credentials: " + e);
    }
 }

  return (
    <Fragment>
   <div className="w-full max-w-sm mx-auto">
        {/* <SocialButtons/> */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with email
          </span>
        </div>
      </div>
      <form onSubmit={onSubmit} className="space-y-2"  >
      <div className="relative">
      <Label> Email: <span className="text-error-500">*</span>{" "}</Label>
        <Input
         name="email"
          className="pl-6"
          type="email"
          autoComplete="email"
        /><AtSymbolIcon className="pointer-events-none absolute left-1 top-2/3 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
        </div>
        <ZodErrors error={state?.zodErrors?.email} />
        <div className="relative">
        <Label> Password: <span className="text-error-500">*</span>{" "}</Label>
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
            <span onClick={() => setVisible(!visible)} className="cursor-pointer absolute right-3 top-2/3 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900">
             {!visible ? <EyeSlashIcon /> : <EyeIcon />} 
            </span>
        </div>
        <ZodErrors error={state?.zodErrors?.password} />
        <Button className="w-full mt-4" size="sm" type="submit">
          Sign In <ArrowRightIcon className="h-5 w-5 text-gray-50" />
        </Button>
      </form>

        <div className="mt-5">
              <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                Don&apos;t have an account? {""}
                <Link  href="/signup" className="text-brand-500 hover:text-brand-600 dark:text-brand-400" >
                  Sign Up
                </Link>
              </p>
        </div>
    </div>
    </Fragment>
  )
}

export default SignInForm