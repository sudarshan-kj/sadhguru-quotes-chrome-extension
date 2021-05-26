const crypto = require("crypto-js");
const fs = require("fs").promises;

const PRIVATE_KEY = "";

function decryptData(data) {
  const bytes = crypto.AES.decrypt(data, PRIVATE_KEY);
  return JSON.parse(bytes.toString(crypto.enc.Utf8));
}

async function init() {
  let dataFromFile = await fs.readFile("./data.json", "utf-8");
  dataFromFile = JSON.parse(dataFromFile);
  const decryptedData = decryptData(dataFromFile.data);
  return [decryptedData.length, decryptedData];
}

init().then(([length, decryptedData]) => {
  console.log("Length: ", length);
  console.log("Data: ", decryptedData);
});
