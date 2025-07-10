import React, { useState } from 'react'
import {ShipWheelIcon} from 'lucide-react'
import { Link } from 'react-router-dom'
import useSignin from '../hooks/useSignin'

const SignUpPage = () => {
  const [SignupData,setSignupData]=useState({
    fullname:"",
    email:"",
    password:""
  })
  
  const {isPending,error,signupMutation}=useSignin()
  const handleSignup=(e)=>{
    e.preventDefault();
    signupMutation(SignupData)
  }
  return (
    <div className='h-screen flex items-center justify-center p-4 sm:p-6 md:p-8' data-theme="night">
       <div className='border border-primary/25 flex flex-col lg:flex-row w-full max-w-5xl mx-auto bg-base-100 rounded-xl shadow-lg overflow-hidden '>
          {/* //Signup form --left side  */}
          <div className='w-full lg:w-1/2 p-4 sm:p-8 flex flex-col'>
                {/* LOGO  */}
                <div className='mb-4 flex items-center justify-start gap-2'>
                    <ShipWheelIcon className="size-9 text-primary "/>
                    <span className='text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider'>Let's Talk</span>
                </div>

                {/* Error message if any */}
                {error && (
                  <div className='alert alert-error mb-4'>
                     <span>{error.response.data.message}</span>
                  </div>
                )}
                <div className='w-full'>
                    <form onSubmit={handleSignup}>
                       <div className='space-y-4'>
                          <div>
                            <h2 className='text-xl font-semibold'>Create an Account</h2>
                            <p className='text-sm opacity-70'>
                              Join Let's talk and start your language learning adventure!
                            </p>
                          </div>
                            {/* Full Name  */}
                          <div className='space-y-3'>
                              <div className='form-control w-full'>
                                <label htmlFor="fullname">
                                  <span className='label-text'>Full Name</span>
                                </label>

                                <input type="text" 
                                     placeholder='Enter Your Full Name'
                                     className='input input-bordered w-full'
                                     value={SignupData.fullname}
                                     onChange={(e)=>setSignupData({...SignupData,fullname:e.target.value})}
                                     required
                                />
                              </div>

                              {/* Email  */}
                              <div className='form-control w-full'>
                                <label htmlFor="Email">
                                  <span className='label-text'>Email</span>
                                </label>

                                <input type="text" 
                                     placeholder='Enter Your Email'
                                     className='input input-bordered w-full'
                                     value={SignupData.email}
                                     onChange={(e)=>setSignupData({...SignupData,email:e.target.value})}
                                     required
                                />
                              </div>

                              {/* Password  */}
                              <div className='form-control w-full'>
                                <label htmlFor="password">
                                  <span className='label-text'>Password</span>
                                </label>

                                <input type="password" 
                                     placeholder=' *********'
                                     className='input input-bordered w-full'
                                     value={SignupData.password}
                                     onChange={(e)=>setSignupData({...SignupData,password:e.target.value})}
                                     required
                                />
                                <p className='text-xs opacity-70 mt-1'>Password must be at least 6 character long</p>
                              </div>

                              <div className='form-control'>
                                <label htmlFor="
                                checkbox" className='cursor-pointer justify-start gap-2'>
                                  <input type='checkbox' className='checkbox checkbox-sm' required />
                                  <span className='text-xs leading-tight mx-2'>
                                    I agree to the    
                                    <span className='text-primary hover:underline'> terms of services</span> and
                                    <span className='text-primary hover:underline'> privacy policy</span>
                                  </span>
                                </label>
                              </div>
                          </div>

                           <button className='btn  btn-primary w-full' type="submit">
                                    {isPending? (
                                      <>
                                      <span className='loading loading-spinner loading-xs'></span>Loading...
                                      </>
                                    ): "Create Account"}
                           </button>
                          <div className='text-center mt-4'>
                            <p className='text-sm '>Already have an account ?
                              <Link to="/login" className='text-primary hover:underline'> Sign in</Link>
                            </p>
                          </div>
                       </div>
                    </form>
                </div>
          </div>
          {/* Signup form  --right side  */}
             <div className='hidden lg:flex flex-col bg-base-200 w-full lg:w-1/2 p-4 sm:p-8'>
                <div className='max-w-md p-8 '>
                    <div className='relative aspeect-square max-w-sm mx-auto'>
                      <img src="/video-icon.svg" alt="video-icon" className='w-full h-full'/>
                    </div>
                    <div className='text-center space-y-3 mt-6'>
                        <h2 className='text-xl font-semibold'>Connect with language partners worldwide</h2>
                        <p className='opacity-70'>Practice conversation , make friends and improve your language skill together</p>
                    </div>
                </div>
            </div>
       </div>
    </div>
  )
}

export default SignUpPage