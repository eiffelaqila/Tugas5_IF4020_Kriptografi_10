import { ecbDecrypt, ecbEncrypt } from "../cipher/modes/ecb.js";

const encrypt = (inputText, key) => {
  try {
    return ecbEncrypt(inputText, key)
  } catch (error) {
    console.error("Error in encrypt blockcipher: ", error.message);
		return Promise.reject(error);
  }
}

const decrypt = (inputText, key) => {
  try {
    return ecbDecrypt(inputText, key)
  } catch (error) {
    console.error("Error in decrypt blockcipher: ", error.message);
    return Promise.reject(error);
  }
}

export { encrypt, decrypt };
