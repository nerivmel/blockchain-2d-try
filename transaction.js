class Transaction {
    constructor(sender, recipient, amount) {
      this.sender = sender;
      this.recipient = recipient;
      this.amount = amount;
    }
  
    isValid() {
      // Verifica que el remitente, el destinatario y la cantidad sean valores válidos
      if (
        typeof this.sender !== 'string' ||
        typeof this.recipient !== 'string' ||
        typeof this.amount !== 'number' ||
        this.amount <= 0
      ) {
        return false;
      }
      return true;
    }
  }
  module.exports = Transaction;