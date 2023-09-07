const crypto = require('crypto');

class Wallet {
  constructor() {
    this.keyPair = crypto.generateKeyPairSync('rsa', {
      modulusLength: 2048,
      publicKeyEncoding: {
        type: 'spki',
        format: 'pem',
      },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem',
      },
    });
    this.address = this.calculateAddress(this.keyPair.publicKey);
    this.balance = 0;
  }

  calculateAddress(publicKey) {
    const hash = crypto.createHash('sha256').update(publicKey).digest('hex');
    return hash;
  }

  getPublicKey() {
    return this.keyPair.publicKey;
  }

  getPrivateKey() {
    return this.keyPair.privateKey;
  }
}

const bombom = new Wallet();
const burbuja = new Wallet();
const bellota = new Wallet();
const mojojojo = new Wallet();

console.log('Dirección de usuario 1:', bombom.address);
console.log('Dirección de usuario 2:', burbuja.address);
console.log('Dirección de usuario 3:', bellota.address);
console.log('Dirección de usuario 4:', mojojojo.address);


