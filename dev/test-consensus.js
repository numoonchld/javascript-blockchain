const Blockchain = require('./blockchain')
const luzcoin = new Blockchain()

const blockchain1 = {
    "chain": [
        {
            "index": 1,
            "timestamp": 1676795728534,
            "transactions": [],
            "nonce": 0,
            "hash": "0",
            "previousBlockHash": "0"
        },
        {
            "index": 2,
            "timestamp": 1676795765727,
            "transactions": [],
            "nonce": 18140,
            "hash": "0000b9135b054d1131392c9eb9d03b0111d4b516824a03c35639e12858912100",
            "previousBlockHash": "0"
        },
        {
            "index": 3,
            "timestamp": 1676795822035,
            "transactions": [
                {
                    "amount": 12.5,
                    "sender": "00",
                    "recipient": "34760d7545bb40218a8f40c3fc9686bf",
                    "transactionID": "3c3051f668a04a77a2dd31d87c914baf"
                },
                {
                    "amount": 225,
                    "sender": "0xjhsdjge43434",
                    "recipient": "0x34rf34f43f34",
                    "transactionID": "6041019e39324fb0aa7eb41af490af81"
                },
                {
                    "amount": 25,
                    "sender": "0xjhsdjge43434",
                    "recipient": "0x34rf34f43f34",
                    "transactionID": "4e3f131d36e44a97a0dd291d156ffa9b"
                },
                {
                    "amount": 35,
                    "sender": "0xjhsdjge43434",
                    "recipient": "0x34rf34f43f34",
                    "transactionID": "9e100fac38584c2da7730facc3c85e1c"
                }
            ],
            "nonce": 134097,
            "hash": "0000390d5971112a06982c5983de2814d393757d79274fa49f059b90579f9a40",
            "previousBlockHash": "0000b9135b054d1131392c9eb9d03b0111d4b516824a03c35639e12858912100"
        },
        {
            "index": 4,
            "timestamp": 1676796258234,
            "transactions": [
                {
                    "amount": 12.5,
                    "sender": "00",
                    "recipient": "34760d7545bb40218a8f40c3fc9686bf",
                    "transactionID": "bb889d783ca147ba8994ab3d29129a34"
                },
                {
                    "amount": 45,
                    "sender": "0xjhsdjge43434",
                    "recipient": "0x34rf34f43f34",
                    "transactionID": "1f35719b66204800ba277d1dea1855ab"
                },
                {
                    "amount": 55,
                    "sender": "0xjhsdjge43434",
                    "recipient": "0x34rf34f43f34",
                    "transactionID": "2bf9c394d23847838142999a5642855e"
                },
                {
                    "amount": 65,
                    "sender": "0xjhsdjge43434",
                    "recipient": "0x34rf34f43f34",
                    "transactionID": "4674428b2d6847b79c6ac94a092ddb67"
                },
                {
                    "amount": 75,
                    "sender": "0xjhsdjge43434",
                    "recipient": "0x34rf34f43f34",
                    "transactionID": "60f6c2ddb0f741c2805967fd98f76e04"
                }
            ],
            "nonce": 102462,
            "hash": "00008cb2162a4695890fdb85bcf6404cc9c7d4eff980f77fc4c48a4dc2075ec9",
            "previousBlockHash": "0000390d5971112a06982c5983de2814d393757d79274fa49f059b90579f9a40"
        },
        {
            "index": 5,
            "timestamp": 1676796310137,
            "transactions": [
                {
                    "amount": 12.5,
                    "sender": "00",
                    "recipient": "34760d7545bb40218a8f40c3fc9686bf",
                    "transactionID": "c5d6cc3318d347f9b6c37801e758705b"
                }
            ],
            "nonce": 20511,
            "hash": "0000387d6a65b95079d1855e57c38a210ac6c449109d73a8248add6ddb610860",
            "previousBlockHash": "00008cb2162a4695890fdb85bcf6404cc9c7d4eff980f77fc4c48a4dc2075ec9"
        },
        {
            "index": 6,
            "timestamp": 1676796313499,
            "transactions": [
                {
                    "amount": 12.5,
                    "sender": "00",
                    "recipient": "34760d7545bb40218a8f40c3fc9686bf",
                    "transactionID": "38aa1a48dc1b478fad03de27a037e303"
                }
            ],
            "nonce": 281086,
            "hash": "000008d924fa4ce87c0b1c7faca19c9f14a0a692da37d21520b93c418971d163",
            "previousBlockHash": "0000387d6a65b95079d1855e57c38a210ac6c449109d73a8248add6ddb610860"
        }
    ],
    "pendingTransactions": [
        {
            "amount": 12.5,
            "sender": "00",
            "recipient": "34760d7545bb40218a8f40c3fc9686bf",
            "transactionID": "ab8433ed1c6c4fc599e47db0cd185e9e"
        }
    ],
    "currentNodeURL": "http://localhost:3001",
    "networkNodes": []
}

console.log('isValid?: ', luzcoin.isChainValid(blockchain1.chain))