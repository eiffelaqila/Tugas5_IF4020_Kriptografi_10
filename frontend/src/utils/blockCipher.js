const encrypt = async (inputText, key) => {
  const res = await fetch("/blockcipher/ecb/encrypt", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ inputText, key }),
  });

  const data = await res.json();
  return data.ciphertext;
}

const decrypt = async (inputText, key) => {
  const res = await fetch("/blockcipher/ecb/decrypt", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ inputText, key }),
  });

  const data = await res.json();
  return data.plaintext;
}

export { encrypt, decrypt };
