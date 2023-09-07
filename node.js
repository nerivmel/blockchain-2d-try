// node.js
const Transaction = require('./transaction');
const express = require('express');
const bodyParser = require('body-parser');
const Blockchain = require('./blockchain'); // Importa tu clase Blockchain

const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 3001;

const node = new Blockchain();

// Ruta para obtener la cadena de bloques completa
app.get('/blockchain', (req, res) => {
  res.json(node.chain);
});

// Ruta para crear una nueva transacción
app.post('/transaction', (req, res) => {
  const { sender, recipient, amount } = req.body;
  node.createTransaction(sender, recipient, amount);
  res.json({ message: 'Transacción creada y agregada a transacciones pendientes.' });
});

// Ruta para minar un bloque
app.get('/mine', (req, res) => {
  const lastBlock = node.getLatestBlock();
  const minerAddress = 'tu_direccion_de_billetera'; // Cambia por tu dirección
  node.minePendingTransactions(minerAddress);
  res.json({ message: 'Nuevo bloque minado con éxito.' });
});

app.listen(PORT, () => {
  console.log(`Servidor en ejecución en el puerto ${PORT}`);
});

app.get('/pending-transactions', (req, res) => {
    res.json(node.getAllPendingTransactions());
  });