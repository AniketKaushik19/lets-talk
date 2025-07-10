import { getFriendRequests } from '../libs/api'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { acceptFriendRequest } from '../libs/api'
import {UserCheckIcon , BellIcon ,ClockIcon , MessageSquareIcon} from 'lucide-react'
import NoNotificationsFound from '../components/NoNotificationsFound'
 const NotificationPage = () => {
  const queryClient =useQueryClient()

  const {data:friendRequests ,isloading}=useQuery({
      queryKey:["frinedRequests"],
      queryFn:getFriendRequests,
  })

  const {mutate:acceptRequestMutation , ispending}=useMutation({
    mutationFn:acceptFriendRequest,
    onSuccess:()=>{
      queryClient.invalidateQueries({queryKey:["friendRequests"]})
      queryClient.invalidateQueries({queryKey:["friends"]})
    }
  })

  const incomingRequest=friendRequests?.incomingReqs || []
  const acceptedRequest=friendRequests?.acceptedReqs || []
  return (
    <div className='p-4 sm:p-6 lg:p-8'>
       <div className='container mx-auto max-w-4xl space-y-8'>
         <h1 className='text-2xl sm:text-3xl font-bold tracking-tight mb-6'>
           Notifications
         </h1>

         {isloading? (
          <div className='flex justify-center py-12'>
             <span className='loading loading-spinner loading-lg'/>
          </div>
         ):(
          <>
           {incomingRequest.length>0 &&(
            <section className='space-y-4'>
              <h2 className='text-xl font-semibold flex items-center gap-2'>
                <UserCheckIcon className="h-5 205 text-primary"/>Friend Request
                <span className='badge badge-primary ml-2'>{incomingRequest.length}</span>
              </h2>
              <div className='space-y-3'>
                  {incomingRequest.map((request)=>(
                    <div className='card bg-base-200 shadow-sm hover:shadow-md transition-shadow'>
                      <div className='card-body p-4'>
                         <div className='flex items-center justify-between'>
                          <div className='flex items-center gap-3'>
                            <div className='avatar w-14 h-14 rounded-full bg-base-300'>
                              <img src={request.sender.profilepic} alt={request.sender.fullname} />
                            </div>
                            <div>
                              <h3 className='font-semibold'>{request.sender.fullname}</h3>
                              <div className='flex flex-wrap gap-1.5 mt-1'>
                                <span className='badge badge-secondary badge-sm'>
                                  Native:{request.sender.nativelanguage}
                                </span>
                                <span className='badge badge-outline badge-sm'>
                                  Learning:{request.sender.learninglanguage}
                                </span>
                              </div>
                            </div>
                          </div>

                          <button className='btn btn-primary btn-sm'
                          onClick={()=>acceptRequestMutation(request._id)}
                          disabled={ispending}>
                            Accept
                          </button>
                         </div>
                      </div>
                    </div>
                  ))}
              </div>
            </section>
           ) }

           {/* Accepted Request Notification  */}
           {console.log(acceptedRequest)}
           {acceptedRequest.length >0 && (
            <section className='space-y-4'>
              <h2 className='text-xl font-semibold flex items-center gap-2'>
                <BellIcon className="h-5 w-5 texxt-success"/>New Connections
              </h2>

              <div className='space-y-3'>
                {acceptedRequest.map((Notification)=>{
                 return <div key={Notification._id} className='card bg-base-200 shadow-sm'>
                    <div className='card-body p-4'>
                        <div className='flex items-start gap-3'>
                            <div className='avatar mt-1 size-10 rounded-full'>
                              <img src={Notification.recipient.profilepic} alt={Notification.recipient.fullname} />
                            </div>
                            <div className='flex-1'>
                              <h3 className='font-semibold'>{Notification.recipient.fullname}</h3>
                              <p className='text-sm my-1'>
                                {Notification.recipient.fullname} accepted your friend request
                              </p>
                              <p className='text-xs flex item-center opacity-70'>
                                <ClockIcon className="h-4 w-3 mr-1"/>Recently
                              </p>
                            </div>

                            <div className='badge badge-success'>
                              <MessageSquareIcon className="h-3 w-3 mr-1"/>New Friend
                            </div>
                        </div>
                    </div>

                  </div>
                })}
              </div>
            </section>
           )}
           {incomingRequest.length===0 && acceptedRequest.length===0 && (
            <NoNotificationsFound/>
           )}
          </>
         )}
       </div>
    </div>
  )
}

export default NotificationPage