# overview

## about
project workbench for [udemy course](https://www.udemy.com/course/build-a-blockchain-in-javascript/) 

## notes
- this project illustrates a rudimentary first principles implementation of a blockchain
    - leveraging the prototypal inheritance mechanism in JavaScript

- hashing is done with sha256 
- nonce based proof-of-work
    - // repeatedly generate hash => until the hash starts with four zeros!
    - return nonce that returns the correct hash (i.e. starting with '0000')
- genesis block is the first block of the blockchain
    - marks the creation of the blockchain