'use server';

import { signIn, signOut } from '@/auth2';
import { AuthError } from 'next-auth';
import bcryptjs from "bcryptjs";
import { unstable_noStore as noStore } from 'next/cache';
import { userSignupSchema, userSigninSchema, userUpdateSchema } from "@/schemas/validation-schemas";
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import  prisma  from '@/prisma/prisma';

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

      const _user = await prisma.User.findFirst({where: {email: email}});
      const user = JSON.parse(JSON.stringify(_user));

      if(_user === null)
      {
       return {error: `User with email address ${email} doesn't exists.`};
      }
      const dbpassword = user.password;
      const id = user.id;

      await signIn("credentials", {email, password, dbpassword, id, redirect: false, });
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


  //create an account
  export async function createUser( formData, register=false) {
    const redirectPath = register ? "/signin" : "/admin/users";
    try {
      const _isAdmin = formData.get("isadmin");
      const first_name = formData.get("first_name");
      const last_name = formData.get("last_name");
      const name = formData.get("first_name") + ", " + formData.get("last_name");
      const email = formData.get("email");
      const password = formData.get("password");
      const isadmin = _isAdmin ? true : false;
      const isactive = true;
      const provider = "credentials";
      const created_by = register ? formData.get("email") : formData.get("created_by");
      const updated_by = register ? formData.get("email") : formData.get("updated_by");
  
      const validatedFields = userSignupSchema.safeParse({
        first_name,
        last_name,
        email,
        password
      });
  
  
      if (!validatedFields.success) {
        return {
          error: "validation",
          zodErrors: validatedFields.error.flatten().fieldErrors,
          strapiErrors: null,
          message: "Missing information on key fields.",
        };
      }
    
      else{

      const userexists = await prisma.User.findUnique({ where: {email: email}});
      if (userexists) {
        return { 
          error: "userexists",
          message: `User with this email account ${email} already exists.`, 
          }
        }
        
      const salt = await bcryptjs.genSalt(10);
      const hashedPassword = await bcryptjs.hash(password, salt);
  
      const newUser = {
        first_name,
        last_name,
        name,
        email,
        password: hashedPassword,
        isadmin,
        isactive,
        provider,
        created_by: created_by,
        updated_by: updated_by,
      };
  
      await prisma.User.create({data:newUser});
    }
  
    } catch (err) {
      return { error: "Failed to insert new user!" + err};
    }
  
    revalidatePath(redirectPath);
    redirect(redirectPath);
  }
