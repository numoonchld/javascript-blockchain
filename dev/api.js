const express = require('express')
const app = express()

// landing page api
app.get('/', function(req,res) {
    res.send('Luz Coin')
})

// endpoint to get entire blockchain
app.get('/blockchain', function(req,res0) {})

// endpoint to post a new transaction
app.post('/transaction', function(req,res0) {})

// endpoint to trigger mining of a new block
app.get('/mine', function(req,res0) {})

app.listen(3000, function() {
    console.log('listening on port 3000...')
})