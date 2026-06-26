'use client'
import React, { useEffect, useState } from 'react'
import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import * as z from "zod"
import Link from "next/link"
import { useDebounceCallback } from 'usehooks-ts'
import { toast } from "sonner"
import { useRouter } from 'next/navigation'
import { signUpSchema } from '@/schemas/signUpSchema'
import axios,{AxiosError} from 'axios'
import { ApiResponse } from '@/types/ApiResponse'
import { Finlandica } from 'next/font/google'
import {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { signInSchema } from '@/schemas/signInSchema'
import { signIn } from 'next-auth/react'


const Page = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const router=useRouter()

  const form=useForm ({
    resolver:zodResolver(signInSchema),
    defaultValues:{
      identifier:"",
      password:"",
    }
  })

 

  const onSubmit=async (data:z.infer<typeof signInSchema>) =>{
    setIsSubmitting(true)
    try {
      const result = await signIn("credentials", {
          identifier:data.identifier,
          password:data.password,
          redirect:false,
          callbackUrl: "/dashboard",
      })

      if(result?.error) {
        toast.error(result.error)
        return
      }

      router.replace(result?.url || "/dashboard")
    } finally {
      setIsSubmitting(false)
    }
  }

  
  return (
    <div className='flex justify-center items-center min-h-screen bg-gray-100'>
      <div className='w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md'>
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Join True Feedback
          </h1>
          <p className="mb-4">Sign In to start your anonymous adventure</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            
            <FormField
              name="identifier"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email/Username</FormLabel>
                  <Input placeholder='Email/Username' {...field} name="Email/Username" />
                  <p className='text-gray-400 text-sm'>We will send you a verification code</p>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <Input type='password' {...field} name="password" />
                  <p className='text-gray-400 text-sm'>We will send you a verification code</p>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className='w-full' disabled={isSubmitting}>
              Sign In
            </Button>
          </form>
        </Form>
        <div className="text-center mt-4">
          <p>
            Already a member?{' '}
            <Link href="/sign-up" className="text-blue-600 hover:text-blue-800">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
export default Page