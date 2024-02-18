import obfuscationMap from './obfuscationMap';

function obfuscateVerifyId(verifyId) {
  let obfuscatedVerifyId = '';

  for (let i = 0; i < verifyId.length; i++) {
    const character = verifyId.charAt(i);
    const obfuscatedCharacter = obfuscationMap[character] || character;
    obfuscatedVerifyId += obfuscatedCharacter;
  }

  return obfuscatedVerifyId;
}

function deobfuscateVerifyId(obfuscatedVerifyId) {
  let verifyId = '';

  const reverseObfuscationMap = {};
  for (const key in obfuscationMap) {
    const value = obfuscationMap[key];
    reverseObfuscationMap[value] = key;
  }

  let i = 0;
  while (i < obfuscatedVerifyId.length) {
    let j = i + 1;
    while (j <= obfuscatedVerifyId.length) {
      const obfuscatedSubstring = obfuscatedVerifyId.substring(i, j);
      const deobfuscatedCharacter = reverseObfuscationMap[obfuscatedSubstring];
      if (deobfuscatedCharacter) {
        verifyId += deobfuscatedCharacter;
        i = j;
        break;
      }
      j++;
    }
  }

 // console.log('Deobfuscation Input:', obfuscatedVerifyId);
 // console.log('Deobfuscation Output:', verifyId);

  return verifyId;
}

export { obfuscateVerifyId, deobfuscateVerifyId };