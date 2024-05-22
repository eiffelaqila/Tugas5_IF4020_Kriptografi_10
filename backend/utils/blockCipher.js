const encrypt = async (inputText, key) => {
  try {
    const res = await fetch("http://localhost:8000/ecb/encrypt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ inputText, key }),
    });

    const data = await res.json();
    return data.ciphertext;
  } catch (error) {
    console.error("Error in encrypt blockcipher: ", error.message);
		return Promise.reject(error);
  }
}

const decrypt = async (inputText, key) => {
  try {
    const res = await fetch("http://localhost:8000/ecb/decrypt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ inputText, key }),
    });

    const data = await res.json();
    return data.plaintext;
  } catch (error) {
    console.error("Error in decrypt blockcipher: ", error.message);
    return Promise.reject(error);
  }
}

export { encrypt, decrypt };
