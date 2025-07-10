import { useQueryClient,useMutation } from "@tanstack/react-query"
import { logout } from "../libs/api"

const useLogout = () => {
    const queryClient=useQueryClient()

    const {isPending,error ,mutate:logoutMutation}=useMutation({
        mutationFn:logout,
        onSuccess:()=>queryClient.invalidateQueries({queryKey:["authUser"]})
    })
    return {isPending,error,logoutMutation}
}

export default useLogout