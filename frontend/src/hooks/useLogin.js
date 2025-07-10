import { login } from '../libs/api';
import { useQueryClient,useMutation } from '@tanstack/react-query';
const useLogin = () => {
const queryClient=useQueryClient();
  const {mutate:loginMutation,isPending,error}=useMutation({
    mutationFn:login,
    onSuccess:()=>queryClient.invalidateQueries({queryKey:["authUser"]})
  });
  return {error , isPending ,loginMutation}
}

export default useLogin