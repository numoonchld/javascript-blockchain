function Blockchain() {
    this.chain = []
    this.pendingTransactions = []
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

Blockchain.prototype.getLastBlock = function() {
    return this.chain[this.chain.length - 1]
}

// these transactions are not set in stone until a new block is mined
Blockchain.prototype.createNewTransaction = function(amount, sender, recipient) {
    const newTransaction = {
        amount,
        sender,
        recipient
    }

    this.pendingTransactions.push(newTransaction)

    return this.getLastBlock()['index'] + 1
}

module.exports = Blockchain