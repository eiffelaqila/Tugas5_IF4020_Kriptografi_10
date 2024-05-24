import { BiDownload } from "react-icons/bi";
import { generatePublicKey, generateRandomPrivateKey } from "../../utils/ecc";

const E2eeButton = () => {
  const handleDownloadKey = () => {
    const privateKey = generateRandomPrivateKey(16);
    const privateBlob = new Blob([JSON.stringify(privateKey)], { type: 'text/plain' });
    const publicKey = generatePublicKey(privateKey);
    const publicBlob = new Blob([JSON.stringify(publicKey)], { type: 'text/plain' });

    let url = URL.createObjectURL(privateBlob);
    let a = document.createElement('a');
    a.href = url;
    document.body.appendChild(a);
    a.download = 'privateKey.ecpriv';
    a.click();
    document.body.removeChild(a);

    url = URL.createObjectURL(publicBlob);
    a = document.createElement('a');
    a.href = url;
    document.body.appendChild(a);
    a.download = 'publicKey.ecpub';
    a.click();
    document.body.removeChild(a);
  }

	return (
		<div className="flex flex-col gap-2 mt-auto">
			<button className='btn btn-sm' onClick={handleDownloadKey}>
        <BiDownload className={`w-4 h-4 text-white cursor-pointer`}/>
				<p className='text-xs font-medium text-white'>Download E2EE key pair</p>
			</button>
		</div>
	);
};
export default E2eeButton;
