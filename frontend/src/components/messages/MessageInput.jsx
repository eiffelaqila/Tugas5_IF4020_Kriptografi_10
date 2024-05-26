import { BsSend, BsPlus } from "react-icons/bs";
import useSendMessage from "../../hooks/useSendMessage"
import useSchnorrDS from "../../hooks/useSchnorrDS"
import { useState } from "react";

const MessageInput = () => {
	const [message, setMessage] = useState("");
	const { loading, sendMessage } = useSendMessage();
	const [isShowDS, setShowDS] = useState(false);
	const [isDSEnable, setDSEnable] = useState(false);

	const { privateKeyFileContent, signMessage, handleUploadPrivateKeyFile } = useSchnorrDS()

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!message) return;

		if (isDSEnable) {
			const signedMessage = signMessage(message);
			await sendMessage(signedMessage);
		} else {
			await sendMessage(message);
		}
		setMessage("");
	};

	return (
		<form className='mt-3' onSubmit={handleSubmit}>
			<div className='relative flex flex-col w-full gap-2 py-2 bg-gray-800'>
				<div className='flex gap-4 px-4'>
					<button type='button' className='flex items-center py-2' onClick={() => {setShowDS(!isShowDS);}}>
						{loading ? <div className='loading loading-spinner'></div> : <BsPlus className={`w-6 h-6 transition ease-in-out ${isShowDS ? 'rotate-45' : ''}`} />}
					</button>
					<input
						type='text'
						className='border text-sm rounded-lg block w-full p-2.5  bg-gray-700 border-gray-600 text-white'
						placeholder='Send a message'
						value={message}
						onChange={(e) => setMessage(e.target.value)}
					/>
					<button type='submit' className='flex items-center py-2'>
						{loading ? <div className='loading loading-spinner'></div> : <BsSend />}
					</button>
				</div>
				{isShowDS && (
					<div className='px-3 m-0 divider'></div>
				)}
				{isShowDS && (
					<div className='flex gap-4 px-4 pb-4'>
						<div className="w-full">
							<label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" htmlFor="file_input">Upload .scprv file</label>
							<input
								id='file_input'
								type='file'
                accept=".scprv"
								className='block w-full gap-2 m-auto text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400'
								onChange={handleUploadPrivateKeyFile}
							/>
						</div>
						<div className="flex items-center">
							<input
								disabled={!privateKeyFileContent}
								id="checkbox"
								type="checkbox"
								value={isDSEnable}
								className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
								onChange={() => setDSEnable(!isDSEnable)}
							/>
							<label htmlFor="checkbox" className="text-sm font-medium text-gray-900 ms-2 dark:text-gray-300">Enable</label>
						</div>
					</div>
				)}
			</div>
		</form>
	);
};
export default MessageInput;
