const express = require('express')
const app = express()

// https://stackoverflow.com/a/49943829
app.use(express.json())
// https://www.geeksforgeeks.org/express-js-express-urlencoded-function/
app.use(express.urlencoded({ extended: false }));

// landing page api
app.get('/', function (req, res) {
    res.send('Luz Coin')
})

// endpoint to get entire blockchain
app.get('/blockchain', function (req, res) { })

// endpoint to post a new transaction
app.post('/transaction', function (req, res) {
    console.log(req.body)
    res.send(`Transaction amount: ${req.body.amount}`)
})

// endpoint to trigger mining of a new block
app.get('/mine', function (req, res) { })


// setup the listener @ port 3000
app.listen(3000, function () {
    console.log('listening on port 3000...')
})