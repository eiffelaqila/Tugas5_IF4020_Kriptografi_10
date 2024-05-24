export function extractDS(input) {
  const regex = /(.*)<ds>{(.*)}<\/ds>/;
  const match = input.match(regex);

  if (match && match.length === 3) {
    const {e, y} = JSON.parse(`{${match[2]}}`);
    return {
      message: match[1],
      digitalSignature: {
        e: BigInt(e),
        y: BigInt(y),
      },
    };
  }

  return {
    message: input,
    digitalSignature: null,
  };
}
