import { useState } from 'react';
import { IoClose } from 'react-icons/io5';
import useSchnorrDS from '../../hooks/useSchnorrDS';
import { extractDS } from '../../utils/extractDS';

const MessageContainer = ({ isvisible, onClose, message }) => {
    const { message: plainMessage, digitalSignature } = extractDS(message.senderMessage)
    const { publicKeyFileContent, verifyMessage, handleUploadPublicKeyFile } = useSchnorrDS()
    const [result, setResult] = useState(null);

    const handleClose = (e) => {
        if (e.target.id === 'wrapper') onClose();
    }

    const handleVerify = (e) => {
        e.preventDefault();

        if (digitalSignature) {
            const isValid = verifyMessage(plainMessage, digitalSignature);
            setResult(isValid ? 'Valid' : 'Invalid');
        } else {
            setResult('No digital signature');
        }
    }

    if (!isvisible) return null;
	return (
        <div className='fixed inset-0 flex items-center justify-center z-[99] bg-black/90' onClick={handleClose}>
            <div className='flex flex-col w-1/2 gap-2'>
                <IoClose className='w-6 h-6 text-white place-self-end' onClick={() => onClose()} />
                <div className='flex flex-col gap-2 p-4 bg-gray-700 rounded'>
                    <div className='text-sm font-bold text-white'>Verify message</div>
                    <div className='px-3 m-0 divider'></div>
                    <label className='block mb-2 text-sm font-medium text-gray-900 dark:text-white' htmlFor='file_input'>Upload .scpub file</label>
                    <input
                        id='file_input'
                        type='file'
                        accept='.scpub'
                        className='block w-full gap-2 m-auto text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400'
                        onChange={handleUploadPublicKeyFile}
                    />
                    <button disabled={!publicKeyFileContent} type='submit' className='btn btn-sm' onClick={handleVerify}>
                        <p className='text-sm font-medium text-white'>Verify message</p>
                    </button>
                    {result !== null && (
                        <div className='px-3 m-0 divider'></div>
                    )}
                    {result !== null && (
                        <div className='text-sm font-medium text-white'>Result: {result}</div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default MessageContainer;
