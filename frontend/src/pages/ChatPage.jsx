import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'
import useAuthUser from '../hooks/useAuthUser';
import { useQuery } from '@tanstack/react-query';
import { getStreamToken } from '../libs/api';
import {toast} from 'react-hot-toast'
import {
  Channel,
  ChannelHeader,
  Chat,
  MessageInput,
  MessageList,
  Thread,
  Window,
} from 'stream-chat-react'
import { StreamChat } from 'stream-chat';
import ChatLoader from '../components/ChatLoader';
import CallButton from '../components/CallButton';

const STREAM_API_KEY=import.meta.env.VITE_STREAM_KEY
const ChatPage = () => {
  const {id:targetUserId}=useParams()
  const [chatClient ,setChatClient]=useState(null);
  const [channel ,setChannel]=useState(null)
  const [loading, setLoading]=useState(true)
  const {authUser}=useAuthUser()

  const {data:tokenData}=useQuery({
    queryKey:["streamToken"],
    queryFn:getStreamToken,
    enabled:!!authUser //this will run only when authUser is available
  })

  useEffect(()=>{
    console.log(authUser._id)
    console.log(tokenData)
    const initChat=async()=>{
      if(!tokenData?.token || !authUser) return;
 
    try {
      console.log("Initializing stream chat client... ")
      const client=StreamChat.getInstance(STREAM_API_KEY);
      await client.connectUser({
        id:authUser._id,
        name:authUser.fullname,
        image:authUser.profilepic,
      },tokenData.token)

      //Create a  channel
      const channelId=[authUser._id , targetUserId].sort().join("-")

      // you and me 
      // if i start the chat=>channelId:[myid,yourId]
      //if you start the chat=> channelId:[yourId,myId]=>[myid,YourID]

      const currChannel =client.channel("messaging" ,channelId,{
        members:[authUser._id, targetUserId],
      })

      await currChannel.watch();
      setChatClient(client)
      setChannel(currChannel)
    } catch (error) {
      console.error("Error initializing chat:",error);
      toast.error("Could not connect to chat. Please try again")
    }
    finally{
      setLoading(false)
    }
  }
    initChat()
  },[tokenData,authUser,targetUserId])

  if(loading || !chatClient || !channel) return <ChatLoader/>

  const handleVideoCall=()=>{
    if(channel){
      const callUrl=`${window.location.origin}/call/${channel.id}`;
      channel.sendMessage({
        text:`I've started a video call. Join me here ${callUrl}`
      })
      toast.success("Video call link send Successfully!")
    }

  }
  return (
    <div className='h-[93vh]'>
      <Chat client={chatClient}>
        <Channel channel={channel}>
           <div className='w-full relative'>
            <CallButton handleVideoCall={handleVideoCall}/>
              <Window>
                 <ChannelHeader/>
                   <MessageList/>
                     <MessageInput focus/>                
              </Window>
           </div>
           <Thread/>
        </Channel>
      </Chat>
    </div>
  )
}

export default ChatPage