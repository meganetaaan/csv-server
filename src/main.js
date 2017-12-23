const express = require('express')
const fs = require('fs')
const csv = require('csv')

const items = []
const columns = {
    '列1': 'id',
    '列2': 'name',
    '列3': 'age'
}
const fileName = './src/test.csv'
const models = {}

/*
GET http://localhost:8080/resources/User/0
POST http://localhost:8080/resources/User/{id: 1, name: bob, age: 13}
PUT http://localhost:8080/resources/User/1{name: Bob, age: 13}
*/


function parseColumns(line) {
    return Object.keys(line).map((k) => {
        return columns[line[k]]
    })
}

const parser = csv.parse({columns: parseColumns})
const readableStream = fs.createReadStream(fileName, {encoding: 'utf-8'})

readableStream.pipe(parser)
parser.on('readable', () => {
    let data
    while (data = parser.read()) {
        items.push(data)
    }
})

parser.on('end', () => {
    console.log('init end')
})

const app = express()
var router = express.Router();

// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
  console.log('Time: ', Date.now());
  next();
});
// define the home page route
router.get('/', function(req, res) {
  res.send('Birds home page');
});
// define the about route
router.get('/about', function(req, res) {
  res.send('About birds');
});

app.use('/birds', router)

const router2 = express.Router()
router2.route('/:item/:id')
.get(function(req, res) {
    console.log(item, id)
    res.send(JSON.stringify({item, id}, null, 2))
})

app.use('/resources', router2)

app.get('/', function(req, res) {
  res.send(JSON.stringify(items, null, 2))
})


const server = app.listen(8080, function() {
    console.log(`listening to port: 8080`)
})