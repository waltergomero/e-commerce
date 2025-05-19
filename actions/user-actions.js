'use server';

import { signIn, signOut } from '@/auth';
import { AuthError } from 'next-auth';
import bcryptjs from "bcryptjs";
import { unstable_noStore as noStore } from 'next/cache';
import { userSignupSchema, userSigninSchema, shippingAddressSchema, paymentMethodSchema, updateProfileSchema} from "@/schemas/validation-schemas";
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import  prisma  from '@/prisma/prisma';
import { auth } from '@/auth';
import { PAYMENT_METHODS } from '@/lib/constants';

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
      if(_user === null)
      {
       return {error: `User with email address ${email} doesn't exists.`};
      }
      else{
        const user = JSON.parse(JSON.stringify(_user));
        const dbpassword = user.password;
        const id = user.id;

        await signIn("credentials", {email, password, dbpassword, id, redirect: false, });
        return { success: true, message:'Signed in successufully'};
      }

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

  export const getUserById = async (userId) => {

    try {
      if(!userId)
          throw new Error('User id was not found');

      const _user = await prisma.User.findUnique({
        where: {id: userId},
        });
      
        if(!_user)
          throw new Error('User not found');
        
      const user = JSON.parse(JSON.stringify(_user));
      return user
    } catch (err) {
      return({error: err + "Failed to fetch user!"});
    }
  };


  //create an account
  export async function createUser( formData, register=false) {
    const redirectPath = register ? "/signin" : "/admin/users";
    console.log("redirect path: ", redirectPath)
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

      return({
        success: true,
        message: `User ${first_name} ${last_name} was created. Please signin using your credentials.`
        })
    }
  
    } catch (err) {
      return { error: "Failed to insert new user!" + err.message};
    }
  }

  export async function updateUserAddress( formData) {
    try { 
      const fullName = formData.get("fullName");
      const streetAddress = formData.get("streetAddress");
      const city = formData.get("city");
      const state = formData.get("state");
      const zipCode = formData.get("zipCode");
      const country = formData.get("country");  

      const validatedFields = shippingAddressSchema.safeParse({
        fullName,
        streetAddress,
        city,
        state,
        zipCode,
        country
      });

      if (!validatedFields.success) {
        return {
          error: "validation",
          zodErrors: validatedFields.error.flatten().fieldErrors,
          strapiErrors: null,
          message: "Missing information on key fields.",
        };
      }

      const session = await auth();

      const user = await prisma.user.findFirst({
        where: {id: session.user?.id}
      }) ;

      if(!user) throw new Error('User not found');

      const address = {
        fullName: fullName,
        streetAddress: streetAddress,
        city: city,
        state: state,
        zipCode: zipCode,
        country: country,
      }
 
      await prisma.user.update({
        where: {id: user.id},
        data: {address}
      })

      return({
        success: true,
        message: `Address of ${fullName} was updated.`
        })

    } catch (error) {
      return { error: `Failed to update user's address! ` + error.message};
    }
  }

  //update user payment method

export async function updateUserPaymentMethod(formData) {
  try {
      const type = formData.get("paymentmethod");
      const session = await auth();

      const currentUser = await prisma.user.findFirst({
          where: {id: session?.user?.id}
      });

      if(!currentUser) throw new Error("user not found")

      const validatedFields = paymentMethodSchema.safeParse({
        type
      });

      if (!validatedFields.success) {
        return {
          error: "validation",
          zodErrors: validatedFields.error.flatten().fieldErrors,
          strapiErrors: null,
          message: "Please select a payment method",
        };
      }

      await prisma.user.update({
        where:{id: currentUser.id },
        data: {paymentMethod: type}
      });

      return {success: true, message: 'User payment method was updated'};

      
  } catch (error) {
      return {success: false, message: error.message};
  }
}

// Update the user profile
export async function updateUserProfile(formData) {
  try {
    const id = formData.get("id");
    const first_name = formData.get("first_name");
    const last_name = formData.get("last_name");
    const name = formData.get("first_name") + ", " + formData.get("last_name");
    const email = formData.get("email");
    const password = formData.get("password");
    const updated_by =  name;
  

      const validatedFields = updateProfileSchema.safeParse({
        first_name,
        last_name,
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
        const currentUser = await prisma.user.findFirst({
          where: {
            id: id,
          },
        });

        if (!currentUser) throw new Error('User not found');

        let query = {
            first_name: first_name,
            last_name: last_name,
            name: name,
            email: email,
            updated_by: updated_by
          };

        if(password){
            const salt = await bcryptjs.genSalt(10);
            const hashedPassword = await bcryptjs.hash(password, salt); 
            let _password = {password: hashedPassword}
            Object.assign(query, _password)
          }


        await prisma.user.update({
          where: {
            id: currentUser.id,
          },
          data: query,
        });

        return {
          success: true,
          message: 'User profile was updated successfully',
        };
      }
  } catch (error) {
    return { success: false, message: (error.message) };
  }
}

// Get all the users
export async function getAllUsers({
  limit = PAGE_SIZE,
  page,
  query,
}) {
  const queryFilter =
    query && query !== 'all'
      ? {
          name: {
            contains: query,
            mode: 'insensitive',
          },
        }
      : {};

  const data = await prisma.user.findMany({
    where: {
      ...queryFilter,
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
    skip: (page - 1) * limit,
  });

  const dataCount = await prisma.user.count();

  return {
    data,
    totalPages: Math.ceil(dataCount / limit),
  };
}

// Delete a user
export async function deleteUser(id) {
  try {
    await prisma.user.delete({ where: { id } });

    revalidatePath('/dashboard/user');

    return {
      success: true,
      message: 'User deleted successfully',
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

// Update a user
export async function updateUser(user) {
  try {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        name: user.name,
        role: user.role,
      },
    });

    revalidatePath('/dashboard/user');

    return {
      success: true,
      message: 'User updated successfully',
    };
  } catch (error) {
    return { success: false, message: error.message };
  }
}