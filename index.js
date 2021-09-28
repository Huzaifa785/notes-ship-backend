const express = require('express')
const connectToMongo = require('./db')

connectToMongo()

const app = express()
const PORT = 7000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(PORT, () => {
  console.log(`App listening at http://localhost:${PORT}`)
})
