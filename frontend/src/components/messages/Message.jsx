import { useState } from 'react'
import { useAuthContext } from '../../context/AuthContext';
import useConversation from '../../store/useConversation';
import { extractTime } from '../../utils/extractTime';
import { extractDS } from '../../utils/extractDS';
import VerifyMessageModal from './VerifyMessageModal';

const Message = ({message}) => {
  const { authUser } = useAuthContext();
	const { selectedConversation } = useConversation();
	const fromMe = message.senderId === authUser._id;
	const formattedTime = extractTime(message.createdAt);
	const chatClassName = fromMe ? "chat-end" : "chat-start";
	const profilePic = fromMe ? authUser.profilePic : selectedConversation?.profilePic;
	const bubbleBgColor = fromMe ? "bg-blue-500" : "";

	const shakeClass = message.shouldShake ? "shake" : "";

	const [showModal, setShowModal] = useState(false);

	const { message: plainMessage, digitalSignature } = extractDS(message.message);

	const handleVerify = () => {
		setShowModal(true);
	}

	return (
		<div className={`chat ${chatClassName}`}>
			<VerifyMessageModal isvisible={showModal} onClose={() => setShowModal(false)} message={message} />
			<div className='chat-image avatar'>
				<div className='w-10 rounded-full'>
					<img alt='Tailwind CSS chat bubble component' src={profilePic} />
				</div>
			</div>
			<div className={`chat-bubble text-white ${bubbleBgColor} ${shakeClass} pb-2`}>{plainMessage}</div>
			<div className='flex items-center gap-1 text-xs opacity-50 chat-footer'>{formattedTime} {digitalSignature ? <p className="font-bold text-white underline cursor-pointer text-sky-300 hover:text-sky-400" onClick={handleVerify}>Verify</p> : ''}</div>
		</div>
	);
}

export default Message