'use server';

import { signIn, signOut } from '@/auth';
import { AuthError } from 'next-auth';
import { unstable_noStore as noStore } from 'next/cache';
import { userSignupSchema, userSigninSchema, userUpdateSchema } from "@/schemas/validation-schemas";
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import  prisma  from '@/prisma/prisma';
//import { PrismaClient } from '@prisma/client';


  //check if user exists using email
  export async function verifyIfUserExists(email) {
    try {         
      const user = await prisma.User.findFirst({where: {email: email}});
      if(!user)
      {
        return {error: `User with email address ${email} doesn't exists.`};
      }
   } catch (error) {
       throw new Error(error);
   }
    
  }


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

      const user = await prisma.User.findFirst({where: {email: email}});

      if(user === null)
      {
       return {error: `User with email address ${email} doesn't exists.`};
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

  //get user data by ID
  export const fetchUserById = async (id) => {
    try {
      const _user = await prisma.User.findUnique({
        where: {id: id},
        include:{ accounts: true},
        });
      const user = JSON.parse(JSON.stringify(_user));
      return user
    } catch (err) {
      return({error: err + "Failed to fetch user!"});
    }
  };
