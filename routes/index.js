var forge = require('node-forge');
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    var plaintext = req.param('data');
    var errorMessage = "None";
    var ciphertext = "";
    if (plaintext === undefined || plaintext.length < 1) {
        errorMessage = "Data input must not be empty. Pass ?data=XYZ param.";
    } else {
        plaintext = toHex(plaintext).toUpperCase();
        ciphertext = encrypt(plaintext);
    }

    res.render('index', {plaintext: plaintext, error: errorMessage, ciphertext: ciphertext});
});


function toHex(str) {
    var hex = '';
    for (var i = 0; i < str.length; i++) {
        hex += '' + str.charCodeAt(i).toString(16);
    }
    return hex;
}

function encrypt(messageHEX) {
    var key = forge.util.hexToBytes("01F9BACA9F8C716D5F22D8D427B2F5B7");
    var iv = forge.util.hexToBytes("00000000000000000000000000000000");

    var messageBytes = forge.util.hexToBytes(messageHEX);

    var messageBuffer = forge.util.createBuffer(messageBytes);

    var cipher = forge.cipher.createCipher('AES-CTR', key);
    cipher.start({iv: iv});
    cipher.update(messageBuffer);
    cipher.finish();

    return cipher.output.toHex().toUpperCase();

}

module.exports = router;
