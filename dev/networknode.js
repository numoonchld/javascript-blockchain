/* 
Network Node API  
- different instances of this API => different network nodes 
- blockchain API is multi-central and is distributed across many many nodes
*/
const { v4: uuidv4 } = require('uuid');
const nodeAddress = uuidv4().split('-').join('')
console.log(nodeAddress)
const port = process.argv[2]
const rp = require('request-promise')

const express = require('express')
const app = express()

const Blockchain = require('./blockchain')
const luzcoin = new Blockchain()

// https://stackoverflow.com/a/49943829
app.use(express.json())
// https://www.geeksforgeeks.org/express-js-express-urlencoded-function/
app.use(express.urlencoded({ extended: false }));

// landing page api
app.get('/', function (req, res) {
    res.send('Luz Coin')
})

// endpoint to get entire blockchain
app.get('/blockchain', function (req, res) {
    res.send(luzcoin)
})

// endpoint to post a new transaction
app.post('/transaction', function (req, res) {
    /*
    console.log(req.body)

    const { amount, sender, recipient } = req.body
    const blockIndex = luzcoin.createNewTransaction(amount, sender, recipient)
    res.json(`Transaction will be added in block number: ${blockIndex}`)
    */

    const newTransaction = req.body
    const blockIndex = luzcoin.addTransactionToPending(newTransaction)
    res.json({
        message: `transaction will be added in block ${blockIndex}`
    })
})

// broadcast a transaction
app.post('/transaction/broadcast', async function (req, res) {
    // create a new transaction and put it in pending transaction for this node
    const { amount, sender, recipient } = req.body
    const newTransaction = luzcoin.createNewTransaction(amount, sender, recipient)
    luzcoin.addTransactionToPending(newTransaction)

    const broadcastPromises = []
    // broadcast this new transaction to all nodes in the network
    luzcoin.networkNodes.forEach(networkNodeURL => {
        const broadcastOptions = {
            uri: `${networkNodeURL}/transaction`,
            method: "POST",
            body: newTransaction,
            json: true
        }

        broadcastPromises.push(rp(broadcastOptions))
    })

    await Promise.all(broadcastPromises).then(data => {
        res.json({
            'message': 'transaction created and broadcasted successfully!'
        })
    })

})

// endpoint to trigger mining of a new block
app.get('/mine', async function (req, res) {

    const previousBlock = luzcoin.getLastBlock();
    const previousBlockHash = previousBlock.hash

    const currentBlockDataForNonceGeneration = {
        transactions: luzcoin.pendingTransactions,
        index: previousBlock.index + 1
    }

    const minedNonce = luzcoin.proofOfWork(previousBlockHash, currentBlockDataForNonceGeneration)

    const currentBlockHash = luzcoin.hashBlock(previousBlockHash, currentBlockDataForNonceGeneration, minedNonce)


    // set new block in stone for this node
    const newBlock = luzcoin.createNewBlock(minedNonce, previousBlockHash, currentBlockHash)

    // broadcast new block to other nodes
    const newBlockBroadcastPromises = []

    luzcoin.networkNodes.forEach(networkNodeURL => {
        const blockBroadcastOptions = {
            uri: `${networkNodeURL}/receive-new-block`,
            method: 'POST',
            body: { newBlock },
            json: true
        }

        newBlockBroadcastPromises.push(rp(blockBroadcastOptions))
    })


    await Promise.all(newBlockBroadcastPromises)
        .then(data => {
            const transactionBroadcastOption = {
                url: `${luzcoin.currentNodeURL}/transaction/broadcast`,
                method: 'POST',
                body: {
                    amount: 12.5,
                    sender: '00',
                    recipient: nodeAddress
                },
                json: true
            }

            return rp(transactionBroadcastOption)

        }).then(data => {
            res.json({
                message: "mined and broadcasted new block successfully",
                block: newBlock
            })
        })

})

// receive broadcasted block from node that mined block
app.post('/receive-new-block', async function (req, res) {

    const newBlock = req.body.newBlock

    // check if previous block hash is the same as the latest block on currently received block
    const latestBlock = luzcoin.getLastBlock()

    // new block validations
    const correctHash = Boolean(latestBlock.hash === newBlock.previousBlockHash)
    const correctIndex = Boolean(latestBlock.index + 1 === newBlock.index)

    if (correctHash && correctIndex) {
        luzcoin.chain.push(newBlock)
        luzcoin.pendingTransactions = []
        res.json({
            message: 'new block received and accepted!',
            newBlock
        })
    }
    else {
        res.json({
            message: 'new block rejected!',
            newBlock
        })
    }

})

// register a node and broadcast network node to the rest of the network
app.post('/register-and-broadcast-node', async function (req, res) {
    const newNodeURL = req.body.newNodeURL

    // add network node http address into luzcoin data structure
    if (luzcoin.networkNodes.indexOf(newNodeURL) === -1) luzcoin.networkNodes.push(newNodeURL)

    // then broadcast into other nodes
    const registerNodesPromises = []
    luzcoin.networkNodes.forEach(networkNodeURL => {
        const requestOptions = {
            uri: `${networkNodeURL}/accept-incoming-node`,
            method: 'POST',
            body: { newNodeURL },
            json: true

        }

        registerNodesPromises.push(rp(requestOptions))
    })

    // send all existing nodes in bulk to newly added node
    await Promise.all(registerNodesPromises).then(data => {

        const bulkRequestOptions = {
            uri: `${newNodeURL}/accept-existing-nodes-bulk`,
            method: 'POST',
            body: { networkNodes: [...luzcoin.networkNodes, luzcoin.currentNodeURL] },
            json: true

        }
        return rp(bulkRequestOptions)
    }).then(data => {
        res.json({
            message: "New node registered with network successfully!"
        })
    })
})

// accept a new node broadcast to the network
app.post('/accept-incoming-node', function (req, res) {
    const newNodeURL = req.body.newNodeURL

    const nodeNotAlreadyPresent = luzcoin.networkNodes.indexOf(newNodeURL) === -1
    const nodeNotCurrentOne = luzcoin.currentNodeURL !== newNodeURL

    if (nodeNotAlreadyPresent && nodeNotCurrentOne) luzcoin.networkNodes.push(newNodeURL)
    res.json({
        message: 'new node registered successfully with this node!'
    })
})

// accept a bulk of existing nodes from the network to the newly attached node
app.post('/accept-existing-nodes-bulk', function (req, res) {
    const networkNodes = req.body.networkNodes
    networkNodes.forEach(networkNodeURL => {
        const nodeNotAlreadyPresent = luzcoin.networkNodes.indexOf(networkNodeURL) === -1
        const nodeNotCurrentOne = luzcoin.currentNodeURL !== networkNodeURL
        if (nodeNotAlreadyPresent && nodeNotCurrentOne) luzcoin.networkNodes.push(networkNodeURL)
    })
    res.json({
        message: 'bulk registration successful!'
    })
})

// consensus end point
app.get('/consensus', async function (req, res) {

    const blockchainRequestPromises = []

    luzcoin.networkNodes.forEach(networkNodeURL => {
        const entireBlockchainRequestOptions = {
            uri: `${networkNodeURL}/blockchain`,
            method: 'GET',
            json: true
        }

        blockchainRequestPromises.push(rp(entireBlockchainRequestOptions))
    })

    await Promise.all(blockchainRequestPromises)
        .then(allBlockchainsFromOtherNodes => {
            const currentChainLength = luzcoin.chain.length
            let maxChainLength = currentChainLength
            let newLongestChain, newPendingTransactions;

            allBlockchainsFromOtherNodes.forEach(blockchainCopy => {
                if (blockchainCopy.chain.length > maxChainLength) {
                    maxChainLength = blockchainCopy.chain.length
                    newLongestChain = blockchainCopy.chain
                    newPendingTransactions = blockchainCopy.pendingTransactions
                }
            })

            if (!newLongestChain || (newLongestChain && !luzcoin.isChainValid(newLongestChain))) {
                res.json({
                    message: 'current chain has not been replaced!',
                    chain: luzcoin.chain
                })
            }
            else {
                luzcoin.chain = newLongestChain
                luzcoin.pendingTransactions = newPendingTransactions

                res.json({
                    message: 'chain has been replaced!',
                    chain: luzcoin.chain
                })
            }
        })
})

// get block using block-hash
app.get('/block/:blockHash', function (req, res) {
    const blockHash = req.params.blockHash
    const correctBlock = luzcoin.getBlock(blockHash)

    res.json({
        block: correctBlock
    })
})

// get block using transaction ID
app.get('/transaction/:transactionID', function (req, res) {
    const transactionID = req.params.transactionID

    const { transaction, block } = luzcoin.getTransaction(transactionID)

    res.json({
        transaction,
        block
    })

})

// get address data
app.get('/address/:address', function (req, res) {

})



// setup the listener @ port 3000
app.listen(port, function () {
    console.log(`listening on port ${port}...`)
})