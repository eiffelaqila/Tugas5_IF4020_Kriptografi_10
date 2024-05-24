import { BiDownload } from "react-icons/bi";
import useDownloadSchnorrDS from "../../hooks/useDownloadSchnorrDS";

const SchnorrButton = () => {
	const { handleDownloadKeyPair } = useDownloadSchnorrDS();

	return (
		<div className="flex flex-col gap-2 mt-auto">
			<button className='btn btn-sm' onClick={handleDownloadKeyPair}>
				<BiDownload className='w-4 h-4 text-white cursor-pointer'/>
				<p className='text-xs font-medium text-white'>Download signature key pair</p>
			</button>
		</div>
	);
};
export default SchnorrButton;
