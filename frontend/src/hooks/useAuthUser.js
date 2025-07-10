import { getAuthUser } from "../libs/api"
import { useQuery } from "@tanstack/react-query"

const useAuthUser =()=>{
      const authUser=useQuery({queryKey:["authUser"],
    queryFn:getAuthUser,
    retry:false, //try for api only one time 
  })
  return{isLoading: authUser.isLoading , authUser:authUser.data?.user}
}

export default useAuthUser