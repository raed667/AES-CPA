var forge = require('node-forge');
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {

    var secretMessage = process.env.SECRET_MESSAGE;
    var encryptedSecret = encrypt(toHex(secretMessage).toUpperCase());

    ///HASH OF Secret
    var md = forge.md.sha256.create();
    md.update(secretMessage);
    var secretHash = md.digest().toHex();


    var plaintext = req.param('data');
    var errorMessage = "None";
    var ciphertext = "";

    if (plaintext === undefined || plaintext.length < 1) {
        errorMessage = "Data input must not be empty. Pass ?data=XYZ param.";
        plaintext = ciphertext = "ERROR";
    } else if (plaintext.length > 16) {
        errorMessage = "Input can't be more than 128-bits";
        plaintext = ciphertext = "ERROR";
    } else {
        plaintext = toHex(plaintext).toUpperCase();
        ciphertext = encrypt(plaintext);
    }
    res.render('index', {
        plaintext: plaintext,
        error: errorMessage,
        ciphertext: ciphertext,
        secretHash: secretHash,
        encryptedSecret: encryptedSecret
    });
});

router.get('/explanation', function (req, res, next) {

    res.render('why', null);
});

router.get('/xor', function (req, res, next) {
    var input1 = req.param('a');
    var input2 = req.param('b');
    var xorres = "";
    var error = "None";
    if ((input1 === undefined || input1.length < 1) || (input2 === undefined || input2.length < 1)) {
        xorres = "ERROR";
        error = "Both inputs (a,b) are required (?a=XYZ&b=XYZ)";
    } else if (!String(input2).match(/[0-9A-Fa-f]+/) || !String(input1).match(/[0-9A-Fa-f]+/)) {
        xorres = "ERROR";
        error = "Both inputs need to be valid Hexadecimal strings";
    } else {
        var input1Bytes = forge.util.hexToBytes(input1);
        var input2Bytes = forge.util.hexToBytes(input2);
        var len = Math.max(input1Bytes.length, input2Bytes.length);
        xorres = forge.util.xorBytes(input1Bytes, input2Bytes, len);
        xorres = forge.util.bytesToHex(xorres).toUpperCase();
    }
    res.render('xor', {input1: input1, input2: input2, xorres: xorres, error: error});
});

function toHex(str) {
    var hex = '';
    for (var i = 0; i < str.length; i++) {
        hex += '' + str.charCodeAt(i).toString(16);
    }
    return hex;
}

function encrypt(messageHEX) {
    var KeyHex = process.env.SECRET_KEY;
    var key = forge.util.hexToBytes(KeyHex);

    var nonce = forge.util.hexToBytes("00000000000000000000000000000000");

    var messageBytes = forge.util.hexToBytes(messageHEX);
    var messageBuffer = forge.util.createBuffer(messageBytes);

    var cipher = forge.cipher.createCipher('AES-CTR', key);
    cipher.start({iv: nonce});
    cipher.update(messageBuffer);
    cipher.finish();
    return cipher.output.toHex().toUpperCase();
}

module.exports = router;
