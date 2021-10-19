# Basic AES Crypto challenge

This is a very basic crypto challenge I setup for my fellow interns at SAP Labs. 
The basic idea is to find a secret message encrypted using AES-CTR. 

You may submit as many messages as you'd like and the form would gladly encrypt them for you.
A handy tool has been set for you, so that should be a hint: https://aescpa.herokuapp.com/xor

A detailed explanation is available, but don't be tempted to cheat.

# How to run this on my own?

If you want to run this you will need to have a Node environment setup, or just run it on heroku.

You will need to set two config variables:
- `SECRET_KEY`: 128bit HEX string that will be used as your secret key.
- `SECRET_MESSAGE`: A plaintext string that will be the secret message.

Please note that this is running on a free heroku instance, and that it will reach rate limts from time to time.

# License

MIT
