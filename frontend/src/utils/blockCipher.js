import { ecbEncrypt, ecbDecrypt } from "../cipher/modes/ecb";

const encrypt = async (inputText, key) => {
  return ecbEncrypt(inputText, key)
}

const decrypt = async (inputText, key) => {
  return ecbDecrypt(inputText, key)
}

export { encrypt, decrypt };
