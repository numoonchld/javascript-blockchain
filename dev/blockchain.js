function Blockchain() {
    this.chain = []
    this.newTransactions = []
}

/*
class Blockchain {
    constructor() {
        this.chain = []
        this.newTransaction = []
    }
}
*/

Blockchain.prototype.createNewBlock = function (nonce, previousBlockHash, hash) {
    const newBlock = {
        index: this.chain.length + 1,
        timestamp: Date.now(),
        transactions: this.newTransactions,
        nonce: nonce, // comes from proof-of-work, can be any number
        hash: hash,
        previousBlockHash: previousBlockHash,
    }

    this.newTransactions = []
    this.chain.push(newBlock)

    return newBlock
}

Blockchain.prototype.getLastBlock = function() {
    return this.chain[this.chain.length - 1 ]
}

module.exports = Blockchain