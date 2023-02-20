# overview

## about
project workbench for [udemy course](https://www.udemy.com/course/build-a-blockchain-in-javascript/) 

## notes
- this project illustrates a rudimentary first principles implementation of a blockchain
    - leveraging the prototypal inheritance mechanism in JavaScript

### blockchain data structure
- a function with a constuctor is implemented 
    - function tracks blocks in an array
    - also tracks pending transactions for next block to be hashed and added to this array
- hashing is done with sha256 
- nonce based proof-of-work
    - // repeatedly generate hash => until the hash starts with four zeros!
    - return nonce that returns the correct hash (i.e. starting with '0000')
- genesis block is the first block of the blockchain
    - marks the creation of the blockchain

### blockchain API server
- express server to handle requests to the blockchain
    - fetch entire blockchain
    - create new transactions
    - mine a new block


### registering nodes
- launch five nodes in separate terminal tabs
    - this mimics nodes of the blockchain network
    - leverage the scripts in `package.json` to achieve this
- then use postman to register the other four nodes in the first node
    - use the postman collection to make REST requests to the express app's endpoint `/register-and-broadcast-node`


### transactions and mining
- send transactions to any node 
    - this is propagated to all network nodes if the registration of the nodes is done correctly
- mine blocks with `/mine` end point to trigger the consensus mechanism check before the block is actually mines
    - 12.5 coins are added to pending transaction to the mining node after each block is mined

