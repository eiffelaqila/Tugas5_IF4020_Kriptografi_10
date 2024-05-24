import { useState } from "react";

import SchnorrDS from "../utils/schnorrDS";

const useSchnorrDS = () => {
	const [publicKeyFileContent, setPublicKeyFileContent] = useState(null);
	const [privateKeyFileContent, setPrivateKeyFileContent] = useState(null);

  const signMessage = (message) => {
    if (privateKeyFileContent) {
      const schnorrDS = new SchnorrDS();
      const privateKey = schnorrDS.readPrivateKeyFile(privateKeyFileContent);
      const signature = schnorrDS.signMessage(privateKey, message);
      const signatureString = schnorrDS.stringifySignature(signature);

      const signedMessage = message + "<ds>" + signatureString + "</ds>";
      return signedMessage;
    }
    return message;
  }

  const verifyMessage = (message, signature) => {
    if (publicKeyFileContent) {
      const schnorrDS = new SchnorrDS();
      const publicKey = schnorrDS.readPublicKeyFile(publicKeyFileContent);
      const isValid = schnorrDS.verifySignature(publicKey, message, signature);

      return isValid;
    }
    return message;
  }

	const handleUploadPublicKeyFile = async (event) => {
		const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPublicKeyFileContent(e.target.result);
      };
      reader.readAsText(file);
    }
	};

	const handleUploadPrivateKeyFile = async (event) => {
		const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target.result
        setPrivateKeyFileContent(content);
      };
      reader.readAsText(file);
    }
	};

	return { publicKeyFileContent, privateKeyFileContent, signMessage, verifyMessage, handleUploadPublicKeyFile, handleUploadPrivateKeyFile };
};
export default useSchnorrDS;
