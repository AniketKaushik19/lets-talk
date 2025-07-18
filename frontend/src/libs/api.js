import { axiosInstance } from "./axios";

export const signup= async (SignupData) => {
      const res =await axiosInstance.post("/auth/signup",SignupData)
      return res.data;
}

export const login= async (loginData) => {
      const res =await axiosInstance.post("/auth/login",loginData)
      return res.data;
}
export const logout= async () => {
      const res =await axiosInstance.post("/auth/logout",)
      return res.data;
}

export const getAuthUser=async ()=>{
      try {
               const res=await axiosInstance.get("/auth/me")
             return res.data;
      } catch (error) {
            console.log("Errror in getAuthUser:",error)
            return null
      }

}

export const completeOnboarding=async(userData)=>{
      const res=await axiosInstance.post("/auth/onboarding",userData)
      return res.data
}

//User request
export const getUserFriends=async ()=>{
      const res=await axiosInstance.get("/users/friends")
      return res.data;
   

}
export const getRecommendedUsers=async ()=>{
      const res=await axiosInstance.get("/users")
      return res.data;

}
export const getOutgoingFriendsReqs=async ()=>{
      const res=await axiosInstance.get("/users/outgoing-friend-requests")
      return res.data;

}
export const sendFriendRequest=async (userId)=>{
      try{
      const res=await axiosInstance.post(`/users/friend-request/${userId}`)
      return res.data;
      }catch(error){
            console.error("Error in sendFriendRequest:",error)
      }
    

}
export  const getFriendRequests=async ()=>{
      const res=await axiosInstance.get("/users/friend-requests")
      return res.data
}
export const acceptFriendRequest=async(requestId)=>{
      const res=await axiosInstance.put(`/users/friend-request/${requestId}/accept`)
      return res.data;
}
export const getStreamToken=async()=>{
      const res=await axiosInstance.get(`/chat/token`);
      return res.data;
}