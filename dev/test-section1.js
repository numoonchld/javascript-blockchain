// import blockchain prototype
const Blockchain = require('./blockchain')

// instantiate a new blockchain
const luzcoin = new Blockchain()
// view genesis block 
console.log('genesis block: ', luzcoin, '\n\n\n',)


// create a new block with no transactions
luzcoin.createNewBlock(578423, 'ASK253FWFSDA34', 'F34FF34FWERGE')
console.log('first new block (no transactions): ', luzcoin, '\n\n\n',)


// create a new transaction
luzcoin.createNewTransaction(100, 'xA23LAF4457FD', 'xFSDS78FDS69')
// create new block after one transaction
luzcoin.createNewBlock(345324, 'AGFS253SDFGSDA34', 'SD33FFF34FWEE')
console.log('second block (one transaction): ', luzcoin, '\n\n\n',)


// create three transactions 
luzcoin.createNewTransaction(10, 'xA23LAF4457FD', 'xFSDS78FDS69')
luzcoin.createNewTransaction(100, 'xA23LAF4457FD', 'xFSDS78FDS69')
luzcoin.createNewTransaction(5000, 'xA23LAF4457FD', 'xFSDS78FDS69')
// create new block
luzcoin.createNewBlock(41234, 'SERF253SDFGSDA34', 'HFSD3FFASD4FWEE')
console.log('third block (three more transactions): ', luzcoin, '\n\n\n',)


// hashing a block: illustration
const previousBlockHash = 'asdhfasf4r3q4r'
const currentBlockData = luzcoin.chain[2].transactions
const nonce = 100
console.log('hard-coded values for hashing current block: ', { previousBlockHash, currentBlockData, nonce })
console.log('block hash with above hard coded values: ', luzcoin.hashBlock(previousBlockHash, currentBlockData, nonce), '\n\n\n')


// proof of work: illustration
const proofOfWorkNonce = luzcoin.proofOfWork(previousBlockHash, currentBlockData)
console.log({ proofOfWorkNonce }, '\n\n\n', luzcoin.hashBlock(previousBlockHash, currentBlockData, proofOfWorkNonce), '\n\n\n')


