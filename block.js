const crypto = require('crypto');

class Block {
  constructor(index, previousHash, timestamp, data) {
    this.index = index;
    this.previousHash = previousHash;
    this.timestamp = timestamp;
    this.data = data;
    this.nonce = 0;
    this.hash = this.calculateHash();
  }

  calculateHash() {
    return crypto
      .createHash('sha256')
      .update(
        this.index +
          this.previousHash +
          this.timestamp +
          JSON.stringify(this.data) +
          this.nonce
      )
      .digest('hex');
  }

  mineBlock(difficulty) {
    const target = Array(difficulty + 1).join('0'); // Crear una cadena de ceros con la longitud de la dificultad + 1
  
    while (this.hash.substring(0, difficulty) !== target) {
      this.nonce++; // Incrementar el nonce y recalcular el hash
      this.hash = this.calculateHash();
    }
  }
}

module.exports = Block;