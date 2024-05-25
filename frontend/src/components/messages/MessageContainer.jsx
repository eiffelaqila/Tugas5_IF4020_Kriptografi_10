import BN from "bn.js";
import { useEffect, useRef, useState } from 'react';
import { TiMessages } from "react-icons/ti";
import { useAuthContext } from "../../context/AuthContext";
import useConversation from "../../store/useConversation";
import MessageInput from "./MessageInput";
import Messages from "./Messages";

const MessageContainer = () => {
  const { selectedConversation, setSelectedConversation } = useConversation();
  const [isKeysSet, setIsKeysSet] = useState(false);
  const pubKeyRef = useRef();
  const privKeyRef = useRef();
  const pubKeyUploadRef = useRef();
  const privKeyUploadRef = useRef();

  useEffect(() => {
		// cleanup function (unmounts)
    setIsKeysSet(false);
		return () => setSelectedConversation(null);
	}, [setSelectedConversation]);

  const handleSetKeys = () => {
    try {
      const rawPrivKey = JSON.parse(privKeyRef.current.value);
      const privKey = new BN(rawPrivKey, 16);
      const rawPubKey = JSON.parse(pubKeyRef.current.value);
      const pubKey = { x: new BN(rawPubKey.x, 16), y: new BN(rawPubKey.y, 16) };

      // store ke localStorage
      localStorage.setItem('cv', JSON.stringify(privKey));
      localStorage.setItem('cb', JSON.stringify(pubKey));
      setIsKeysSet(true);
    } catch (error) {
      console.error(error);
    }
  };

	return (
    <div className="sm:min-w-[300px] md:min-w-[450px] flex flex-col">
      {!selectedConversation ? (
        <NoChatSelected />
      ) : !isKeysSet ? (
        <div className="p-10 justify-center align-center flex flex-col gap-5">
          <div className="flex gap-2 items-end">
            <label>
              Your private key
              <input
                className='border text-sm rounded-lg block w-full p-2.5  bg-gray-700 border-gray-600 text-white'
                placeholder="Your private key"
                ref={privKeyRef}
              />
            </label>
            <button className='btn'
              onClick={() => privKeyUploadRef.current.click()}
            >
              Upload
            </button>
            <input type="file" className="hidden" accept=".ecprv"
              onChange={() => {
                const file = privKeyUploadRef.current.files[0];
                const fr = new FileReader();
                fr.readAsText(file);
                fr.onload = async () => {
                  privKeyRef.current.value = fr.result;
                  console.log(fr.result);
                };
              }}
              ref={privKeyUploadRef}
            />
          </div>
          <div className="flex gap-2 items-end">
            <label>
              {selectedConversation.username}&apos;s public key
              <input
                className='border text-sm rounded-lg block w-full p-2.5  bg-gray-700 border-gray-600 text-white'
                placeholder={`${selectedConversation.username}'s public key`}
                ref={pubKeyRef}
              />
            </label>
            <button className='btn'
              onClick={() => pubKeyUploadRef.current.click()}
            >
              Upload
            </button>
            <input type="file" className="hidden"  accept=".ecpub"
              ref={pubKeyUploadRef}
              onChange={() => {
                const file = pubKeyUploadRef.current.files[0];
                const fr = new FileReader();
                fr.readAsText(file);
                fr.onload = async () => {
                  pubKeyRef.current.value = fr.result;
                  console.log(fr.result);
                };
              }}
            />
          </div>
          <button className="btn" onClick={handleSetKeys}>Enter chat</button>
        </div>
      ) : (
        <>
          {/* Header */}
          <div className="bg-slate-500 px-4 py-2 mb-2">
            <span className="label-text">To:</span>{' '}
            <span className="text-gray-900 font-bold">
              {selectedConversation.username}
            </span>
          </div>

          <Messages />
          <MessageInput />
        </>
      )}
    </div>
  );
};

const NoChatSelected = () => {
    const { authUser } = useAuthContext();
    return (
        <div className='flex items-center justify-center w-full h-full'>
            <div className='px-4 text-center sm:text-lg md:text-xl text-gray-200 font-semibold flex flex-col items-center gap-2'>
                <p>Welcome 👋 {authUser.username} ❄</p>
                <p>Select a chat to start messaging</p>
                <TiMessages className='text-3xl md:text-6xl text-center' />
            </div>
        </div>
    )
}

export default MessageContainer;
