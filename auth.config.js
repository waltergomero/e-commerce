import { NextAuthConfig } from 'next-auth';
import { NextResponse } from "next/server";


export const authConfig = {
  pages: {
    signIn: '/signin',
  },
  providers: [], // Add providers with an empty array for now
};