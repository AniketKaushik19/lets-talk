import React, { useState } from 'react'
import useAuthUser from '../hooks/useAuthUser'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import {toast} from "react-hot-toast"
import {CameraIcon, LoaderIcon, MapPinIcon, ShipWheelIcon, ShuffleIcon} from "lucide-react"
import { completeOnboarding } from '../libs/api'
import { LANGUAGES } from '../constants'
import { MapPin } from 'lucide-react'
const OnboardingPage = () => {
    const {authUser}=useAuthUser()
    const queryClient=useQueryClient();
    const [formData,setFormData]=useState({
      fullname:authUser?.fullname||" ",
      bio:authUser?.bio||"",
      nativelanguage:authUser?.nativelanguage||"",
      learninglanguage:authUser?.learninglanguage||"",
      location:authUser?.location||"",
      profilepic:authUser?.profilepic||"",
    })

    const {mutate:onboardingMutation,isPending}=useMutation({
      mutationFn:completeOnboarding,
      onSuccess:()=>{
        toast.success("Profile Onboarded Successfully")
        queryClient.invalidateQueries({queryKey:['authUser']})
      },
      onError:(error)=>{toast.error(error.response.data.message)}
    })

    const handleSubmit=(e)=>{
      e.preventDefault();
      onboardingMutation(formData)
    }

    const handleRandomAvatar=()=>{
        const idx=Math.floor(Math.random()*100)+1; //1-100 included
        const randomAvatar=`https://avatar.iran.liara.run/public/${idx}.png`;
        setFormData({...formData,profilepic:randomAvatar});
        toast.success("Random profile picture generated!")
    }
  return (
    <div className='min-h-screen bg-base-100 flex items-center justify-center p-4'>
      <div className='card bg-base-200 w-full max-w-3xl shadow-xl'>
          <div className='card-body p-6 sm:p-8'>
             <h1 className='text-2xl sm:text-3xl font-bold text-center mb-6'>Complete  Your Profile</h1>
             <form onSubmit={handleSubmit} className='space-y-6'>
                {/* //profile Pic container  */}
                 <div className='flex flex-col items-center justify-center space-y-4'>
                  {/* //image preview  */}
                  <div className='size-32 rounded-full bg-base-300 overflow-hidden'>
                        {formData.profilepic? (
                          <img src={formData.profilepic} alt="profilepic"  className='w-full h-full object-cover'/>
                        ):(
                          <div className='flex items-center justify-center h-full'>
                              <CameraIcon className="size-12 text-base-content opacity-40"/>
                          </div>
                        )}
                  </div>
                  
                  {/* Generate random Avtar btn  */}
                  <div className='flex items-center gap-2'>
                    <button type="button" onClick={handleRandomAvatar} className='btn btn-primary '><ShuffleIcon className='size-4 mr-2'/>Generate Random Avatar</button>
                  </div>
                 </div>
                 {/* //full Name  */}
                  <div className='form control'>
                      <label htmlFor="fullname">
                        <span className='lable-text'>Full Name</span>
                      </label>
                      <input type="text" 
                            name="fullname"
                            value={formData.fullname}
                            onChange={(e)=>setFormData({...formData,fullname:e.target.value})}              className='input input-bordered w-full'        
                      />
                  </div>
                  {/* // BIo  */}
                   <div className='form control'>
                      <label htmlFor="bio">
                        <span className='lable-text'>bio</span>
                      </label>
                      <textarea type="text" 
                            name="bio"
                            value={formData.bio}
                            onChange={(e)=>setFormData({...formData,bio:e.target.value})}              className='textarea textarea-borderd h-24 w-full'
                            placeholder='Tell other about yourself and your language learning goals'        
                      />
                  </div>
                  {/* //language  */}
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    {/* Native language  */}
                    <div className='form-control'>
                       <label htmlFor="Native language" className='label'>
                        <span className='label-text'>Native Language</span>
                       </label>
                       <select name="nativelanguage"
                       value={formData.nativelanguage}
                       onChange={(e)=>setFormData({...formData,nativelanguage:e.target.value})}
                       className='select select-bordered w-full'>
                         <option value="">Select your native language</option>
                         {LANGUAGES.map((lang)=>(
                          <option key={`native-${lang}`} value={lang.toLowerCase()}>{lang}
                          </option>
                         ))}
                       </select>
                    </div>
                    {/* learning language  */}
                    <div className='form-control'>
                         <label htmlFor="learning" className='label'>
                          <span className='label-text'>Learning Language</span>
                         </label>
                         <select name="learning"    
                         value={formData.learninglanguage}
                         onChange={(e)=>setFormData({...formData,learninglanguage:e.target.value})}
                         className='select select-boardered w-full'>
                          <option value>Select language you're learning</option>
                          {LANGUAGES.map((lang)=>(
                            <option key={`learning-${lang}`} value={lang.toLowerCase()}>{lang}</option>
                          ))}
                         </select>
                    </div>
                  </div>
                  {/* //location  */}
                  <div className='form-control'>
                    <label htmlFor="location" className='label'>
                      <span className='label-text'>Location</span>
                    </label>
                    <div className='relative'>
                        <MapPinIcon className='absolute top-1/2 transform -translate-y-1/2 left-3 size-5 text-base-content opacity-70 z-10'/>
                        <input type="text" 
                           name="location"
                           value={formData.location}
                           onChange={(e)=>setFormData({...formData,location:e.target.value})}
                           className='input input-bordered w-full pl-10'
                           placeholder='City,Country'
                        />
                    </div>
                  </div>
                  {/* //complete onboarding button  */}
                  <button className='btn btn-primary w-full' disabled={isPending} type="submit'">{!isPending?(
                    <>
                     <ShipWheelIcon className='size-5 mr-2'/>Complete Onboarding
                    </>
                  ):(
                     <>
                     <LoaderIcon className='animate-spin size-5 mr-2'/>Onboarding...
                    </>
                  )}</button>
             </form>
          </div>
      </div>
         
    </div>
  )
}

export default OnboardingPage