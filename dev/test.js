const Blockchain = require('./blockchain')

const luzcoin = new Blockchain()

// luzcoin.createNewBlock(0,'akjdf6astfhs8f6gw4','u4378rch234cr4')
// luzcoin.createNewBlock(34,'akjdf6fashs8f6gw4','llms744ddasdf234cr4')
// luzcoin.createNewBlock(54,'akjdf6a323hs8f6gw4','akjjlsjdcbjh434')

luzcoin.createNewBlock(578423, 'ASK253FWFSDA34', 'F34FF34FWERGE')

luzcoin.createNewTransaction(100, 'xA23LAF4457FD', 'xFSDS78FDS69')

luzcoin.createNewBlock(345324, 'AGFS253SDFGSDA34', 'SD33FFF34FWEE')

luzcoin.createNewTransaction(10, 'xA23LAF4457FD', 'xFSDS78FDS69')
luzcoin.createNewTransaction(100, 'xA23LAF4457FD', 'xFSDS78FDS69')
luzcoin.createNewTransaction(5000, 'xA23LAF4457FD', 'xFSDS78FDS69')

luzcoin.createNewBlock(41234, 'SERF253SDFGSDA34', 'HFSD3FFASD4FWEE')

console.log(luzcoin, '\n\n\n', luzcoin.chain[1], '\n\n\n', luzcoin.chain[2], )