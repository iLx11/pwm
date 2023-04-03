import CryptoJS from "crypto-js";

export const md5 = encryptionData => CryptoJS.MD5(encryptionData).toString()
