const express = require('express')
const connectToMongo = require('./db')

connectToMongo()

const app = express()
const PORT = 7000

app.use(express.json())

// Available routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/notes', require('./routes/notes'))

app.listen(PORT, () => {
  console.log(`App listening at http://localhost:${PORT}`)
})
