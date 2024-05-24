import { useState } from "react";
import toast from "react-hot-toast";

// import { useSocketContext } from "../context/SocketContext";
import SchnorrDS from "../utils/schnorrDS";

const useDownloadSchnorrDS = () => {
	const [loading, setLoading] = useState(false);

	const handleDownloadKeyPair = async (message) => {
		setLoading(true);
		try {
			const schnorrDS = new SchnorrDS(message);

			const p = BigInt("0xF56C2A7D366E3EBDEAA1891FD2A0D099436438A673FED4D75F594959CFFEBCA7BE0FC72E4FE67D91D801CBA0693AC4ED9E411B41D19E2FD1699C4390AD27D94C69C0B143F1DC88932CFE2310C886412047BD9B1C7A67F8A25909132627F51A0C866877E672E555342BDF9355347DBD43B47156B2C20BAD9D2B071BC2FDCF9757F75C168C5D9FC43131BE162A0756D1BDEC2CA0EB0E3B018A8B38D3EF2487782AEB9FBF99D8B30499C55E4F61E5C7DCEE2A2BB55BD7F75FCDF00E48F2E8356BDB59D86114028F67B8E07B127744778AFF1CF1399A4D679D92FDE7D941C5C85C5D7BFF91BA69F9489D531D1EBFA727CFDA651390F8021719FA9F7216CEB177BD75");
			const q = BigInt("0xC24ED361870B61E0D367F008F99F8A1F75525889C89DB1B673C45AF5867CB467");
			const a = BigInt("0x8DC6CC814CAE4A1C05A3E186A6FE27EABA8CDB133FDCE14A963A92E809790CBA096EAA26140550C129FA2B98C16E84236AA33BF919CD6F587E048C52666576DB6E925C6CBE9B9EC5C16020F9A44C9F1C8F7A8E611C1F6EC2513EA6AA0B8D0F72FED73CA37DF240DB57BBB27431D618697B9E771B0B301D5DF05955425061A30DC6D33BB6D2A32BD0A75A0A71D2184F506372ABF84A56AEEEA8EB693BF29A640345FA1298A16E85421B2208D00068A5A42915F82CF0B858C8FA39D43D704B6927E0B2F916304E86FB6A1B487F07D8139E428BB096C6D67A76EC0B8D4EF274B8A2CF556D279AD267CCEF5AF477AFED029F485B5597739F5D0240F67C2D948A6279");

			const{ s, v } = schnorrDS.generateKeyPair(p, q, a);
			const privateKeyBlob = schnorrDS.getDownloadablePrivateKey(s);
			const publicKeyBlob = schnorrDS.getDownloadablePublicKey(v);

			let link = document.createElement('a')
			link.href = URL.createObjectURL(privateKeyBlob);
			link.download = 'privateKey.scprv';
			document.body.appendChild(link)
			link.click()
			document.body.removeChild(link)

			link = document.createElement('a')
			link.href = URL.createObjectURL(publicKeyBlob);
			link.download = 'publicKey.scpub';
			document.body.appendChild(link)
			link.click()
			document.body.removeChild(link)
		} catch (error) {
			toast.error(error.message);
		} finally {
			setLoading(false);
		}
	};

	return { handleDownloadKeyPair, loading };
};
export default useDownloadSchnorrDS;
