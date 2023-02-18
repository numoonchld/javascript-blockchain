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
    console.log(req.body)

    const { amount, sender, recipient } = req.body
    const blockIndex = luzcoin.createNewTransaction(amount, sender, recipient)
    res.json(`Transaction will be added in block number: ${blockIndex}`)
})

// endpoint to trigger mining of a new block
app.get('/mine', function (req, res) {

    const previousBlock = luzcoin.getLastBlock();
    const previousBlockHash = previousBlock.hash

    const currentBlockDataForNonceGeneration = {
        transactions: luzcoin.pendingTransactions,
        index: previousBlock.index + 1
    }

    const minedNonce = luzcoin.proofOfWork(previousBlockHash, currentBlockDataForNonceGeneration)

    const currentBlockHash = luzcoin.hashBlock(previousBlockHash, currentBlockDataForNonceGeneration, minedNonce)

    // mining reward
    luzcoin.createNewTransaction(12.5, "00", nodeAddress)

    const newBlock = luzcoin.createNewBlock(minedNonce, previousBlockHash, currentBlockHash)
    res.json({
        message: "mined new block successfully",
        block: newBlock
    })
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

// setup the listener @ port 3000
app.listen(port, function () {
    console.log(`listening on port ${port}...`)
})