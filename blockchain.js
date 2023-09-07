const Block = require('./block'); // Importa la clase Block que definimos anteriormente
const Transaction = require('./transaction');
class Blockchain {
  constructor() {
    this.chain = [this.createGenesisBlock()]; // Inicializa la cadena con un bloque génesis
    this.difficulty = 2; // Dificultad de minería
    this.pendingTransactions = []; // Lista de transacciones pendientes
    this.miningReward = 100; // Recompensa para el minero
    this.wallets = {}; // Un objeto para asociar direcciones con instancias de Wallet
  }
  

  createGenesisBlock() {
    return new Block(0, '0', Date.now(), 'Bloque Génesis'); // Crea el bloque génesis
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  addBlock(newBlock) {
    newBlock.previousHash = this.getLatestBlock().hash; // Establecer el hash anterior del nuevo bloque
    newBlock.mineBlock(this.difficulty); // Realizar la minería con la dificultad dada
    this.chain.push(newBlock); // Agregar el bloque a la cadena
    const rewardTransaction = new Transaction(
        'sistema', // La recompensa va al sistema o al nodo minero
        minerAddress, // La dirección del nodo minero
        this.miningReward // La cantidad de criptomoneda como recompensa
      );
      newBlock.transactions.push(rewardTransaction);
  }

  isChainValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      // Verifica que el hash del bloque actual sea válido
      if (currentBlock.hash !== currentBlock.calculateHash()) {
        return false;
      }

      // Verifica que el hash anterior del bloque actual coincida con el hash del bloque anterior
      if (currentBlock.previousHash !== previousBlock.hash) {
        return false;
      }
    }

    return true; // Si no se encontraron problemas, la cadena es válida
  }
  createTransaction(sender, recipient, amount) {
    const transaction = new Transaction(sender, recipient, amount);
    const senderWallet = this.getWalletByAddress(sender);
    const recipientWallet = this.getWalletByAddress(recipient);

    if (!senderWallet || !recipientWallet) {
      console.log('Dirección de billetera no válida.');
      return;
    }

    if (!transaction.isValid()) {
      console.log('Transacción no válida. Verifica los datos.');
      return;
    }

    if (!this.hasSufficientFunds(sender, amount)) {
      console.log('Fondos insuficientes.');
      return;
    }

    this.pendingTransactions.push(transaction);
    console.log('Transacción creada y agregada a transacciones pendientes.');
  }
  minePendingTransactions(minerRewardAddress) {
    const newBlock = new Block(
      this.chain.length,
      this.getLatestBlock().hash,
      Date.now(),
      this.pendingTransactions
    );
     // Calcular el Merkle Root para las transacciones pendientes
    newBlock.merkleRoot = this.calculateMerkleRoot(newBlock.transactions);
    
    // Añadir una recompensa para el minero
    const rewardTransaction = new Transaction(
      'sistema',
      minerRewardAddress,
      this.miningReward
    );
    newBlock.transactions.push(rewardTransaction);

    newBlock.mineBlock(this.difficulty);
    this.chain.push(newBlock);

    this.pendingTransactions = []; // Limpiar transacciones pendientes
  }
  getPendingTransactions() {
    const allPendingTransactions = [];

    for (const block of this.chain) {
      for (const transaction of block.transactions) {
        allPendingTransactions.push(transaction);
      }
    }

    return allPendingTransactions;
  }
  getAllPendingTransactions() {
    return this.pendingTransactions;
  }
  addTransaction(transaction) {
    this.pendingTransactions.push(transaction);
  }
   // Método para registrar una nueva billetera y su dirección
   registerWallet(wallet) {
    this.wallets[wallet.address] = wallet;
  }

  // Método para obtener una billetera por su dirección
  getWalletByAddress(address) {
    return this.wallets[address];
  }
  hasSufficientFunds(sender, amount) {
    const balance = this.calculateBalance(sender);
    return balance >= amount;
  }

  calculateBalance(address) {
    let balance = 0;
    for (const block of this.chain) {
      for (const transaction of block.transactions) {
        if (transaction.sender === address) {
          balance -= transaction.amount;
        }
        if (transaction.recipient === address) {
          balance += transaction.amount;
        }
      }
    }
    return balance;
  }
  calculateMerkleRoot(transactions) {
    if (!transactions || transactions.length === 0) {
        return null;
      }
    
    if (transactions.length === 1) {
      return transactions[0].hash;
    }
    
    const merkleTree = [];
    
    // Calcular el hash de cada transacción y almacenarlo en merkleTree
    for (const transaction of transactions) {
      merkleTree.push(transaction.hash);
    }
    
    // Construir el árbol de Merkle
    while (merkleTree.length > 1) {
      const newLevel = [];
      
      for (let i = 0; i < merkleTree.length; i += 2) {
        const left = merkleTree[i];
        const right = i + 1 < merkleTree.length ? merkleTree[i + 1] : left;
        
        const combined = crypto.createHash('sha256').update(left + right).digest('hex');
        newLevel.push(combined);
      }
      
      merkleTree.length = 0;
      merkleTree.push(...newLevel);
    }
    
    return merkleTree[0];
  }
}

module.exports = Blockchain;
