const path = require('path')
const express = require('express')
const app = express()

app.use(express.static(path.join(__dirname, 'public')))

const port = process.env.PORT || 3000

app.get('/', function (request, response) {
	response.sendFile(path.join(__dirname, 'public', 'index.html'))
})

app.listen(port, () => {
	console.log('Express server has started on', port)
})
