const sha256 = require('sha256')
const currentNodeURL = process.argv[3]

function Blockchain() {
    this.chain = []
    this.pendingTransactions = []

    this.currentNodeURL = currentNodeURL
    this.networkNodes = []

    // create genesis block
    this.createNewBlock(0, '0', '0')
}

/*
class Blockchain {
    constructor() {
        this.chain = []
        this.newTransaction = []
    }
}
*/

// collects all validated transactions and is set in stone into the blockchain
Blockchain.prototype.createNewBlock = function (nonce, previousBlockHash, hash) {
    const newBlock = {
        index: this.chain.length + 1,
        timestamp: Date.now(),
        transactions: this.pendingTransactions,
        nonce: nonce, // comes from proof-of-work, can be any number
        hash: hash,
        previousBlockHash: previousBlockHash,
    }

    this.pendingTransactions = []
    this.chain.push(newBlock)

    return newBlock
}

Blockchain.prototype.getLastBlock = function () {
    return this.chain[this.chain.length - 1]
}

// these transactions are not set in stone until a new block is mined
Blockchain.prototype.createNewTransaction = function (amount, sender, recipient) {
    const newTransaction = {
        amount,
        sender,
        recipient
    }

    this.pendingTransactions.push(newTransaction)

    return this.getLastBlock()['index'] + 1
}

Blockchain.prototype.hashBlock = function (previousBlockHash, currentBlockData, nonce) {
    const dataString = previousBlockHash + nonce.toString() + JSON.stringify(currentBlockData)
    const computedHash = sha256(dataString)
    return computedHash
}

Blockchain.prototype.proofOfWork = function (previousBlockHash, currentBlockData) {
    // repeatedly generate hash => until the hash starts with four zeros!

    let nonce = 0;
    let newHash = this.hashBlock(previousBlockHash, currentBlockData, nonce)

    // mining core
    while (newHash.substring(0, 4) !== '0000') {
        nonce++
        newHash = this.hashBlock(previousBlockHash, currentBlockData, nonce)
    }

    // return nonce that returns the correct hash (i.e. starting with '0000')
    return nonce
}

module.exports = Blockchain