import {Link} from 'react-router-dom'
import GetLanguageFlag from './GetLanguageFlag'
import { capitialize } from '../libs/utils'
const FriendCard = ({friend}) => {
  const  learninglang=capitialize(friend.learninglanguage)
  const  nativelang=capitialize(friend.nativelanguage)
  return (
   <div className='card bg-base-200 hover:shadow-md transition-shadow'>
     <div className='card-body p-4 '>
        {/* User Info  */}
        <div className='flex items-center gap-3 mb-3'>
            <div className='avatar w-16'>
                <img src={friend.profilepic} alt={friend.fullname}/>
            </div>

            <h3 className='font-semibold truncate'>{friend.fullname}</h3>
        </div>
        
        {/* Actions  */}
        <div className='flex flex-wrap gap-1.5 mb-3'>
            <span className='badge badge-secondary text-xs'>{GetLanguageFlag(friend.nativelanguage)}Native: {nativelang}
            </span>
            <span>
                {GetLanguageFlag(friend.learninglanguage)}Learning: {learninglang}
            </span>
        </div>

        <Link to={`/chat/${friend._id}`} className="btn btn-outline w-full rounded-full">Message</Link>
     </div>
   </div>
  )
}

export default FriendCard