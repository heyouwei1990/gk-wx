var aesPrivateKey = "48c1f0c2cea944e19257c50fd770be87";
import CryptoJS from 'crypto-js'
// AES加密方法,encrypt：要加密的数据
export function aesEncrypt(encrypt) {
    var aesKey = GetPivateKey(aesPrivateKey); //密钥
    var key = CryptoJS.enc.Utf8.parse(aesKey);
    var srcs = CryptoJS.enc.Utf8.parse(encrypt);
    var encrypted = CryptoJS.AES.encrypt(srcs, key, { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 });
    return encrypted.toString();
}

// AES 解密方法
export function aesDecrypt(decryptString) {
    var aesKey = GetPivateKey(aesPrivateKey); //密钥
    var key = CryptoJS.enc.Utf8.parse(aesKey);
    var decrypt = CryptoJS.AES.decrypt(decryptString, key, { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 });
    return CryptoJS.enc.Utf8.stringify(decrypt).toString();
}

// 获取私有key
export function GetPivateKey(aesKey) {
    var aesPrivateKey = "";
    if (aesKey.length < 32) {
        aesPrivateKey = aesKey.PadLeft(32, "0");
    } else {
        aesPrivateKey = aesKey.substring(0, 32);
    }
    return aesPrivateKey;
}

String.prototype.PadLeft = function(len, charStr) {
    var s = this + '';
    return new Array(len - s.length + 1).join(charStr || '') + s;
}
String.prototype.PadRight = function(len, charStr) {
    var s = this + '';
    return s + new Array(len - s.length + 1).join(charStr || '');
}