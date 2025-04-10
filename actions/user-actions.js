'use server';

import { signIn, signOut } from '@/auth';
import { AuthError } from 'next-auth';
import { unstable_noStore as noStore } from 'next/cache';
import { userSignupSchema, userSigninSchema, userUpdateSchema } from "@/schemas/validation-schemas";
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { prisma } from '@/db/prisma';


//signin user with credentials
export async function signInWithCredentials(formData) {
    try {
      const email = formData.get("email");
      const password = formData.get("password");
  
      const validatedFields = userSigninSchema.safeParse({email, password});
  
      if (!validatedFields.success) {
        return {
          error: "Missing information on key fields.",
          zodErrors: validatedFields.error.flatten().fieldErrors,
          strapiErrors: null,
        };
      }
  
      await signIn("credentials", {email, password, redirect: false,});
      return { success: true, message:'Signed in successufully'};
    } 
    catch (error) {
      if (error instanceof AuthError) {
        return { error: error.cause?.err?.message };
      }
      return { success: false, message: 'Signed in failed' };
    }
   
  }

  //sign user out
  export async function signoutUser() {
    await signOut()
    
  }