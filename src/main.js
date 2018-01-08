const express = require('express')
const fs = require('fs')
const csv = require('csv')
const bodyParser = require('body-parser')
const iconv = require('iconv-lite')
const ModelManager = require('./ModelManager')

// TODO: DataStore
const models = {}
const schemas = {}
const modelManager = new ModelManager()
let seq = 0

const importCSV = async (modelName) => {
  return new Promise((resolve, reject) => {
    let Model = modelManager.getModel(modelName)
    const fileName = `./src/${modelName}.csv`
    const parser = csv.parse({ columns: true })
    const readableStream = fs.createReadStream(fileName)
    readableStream.pipe(iconv.decodeStream('SJIS'))
      .pipe(iconv.encodeStream('UTF-8'))
      .pipe(parser)
    parser.on('readable', () => {
      while (true) {
        let data = parser.read()
        if (data == null) {
          break
        }
        const id = data.id ? data.id : seq++
        models[modelName][id] = data
      }
    })
    parser.on('end', () => {
      resolve()
    })
  })
}

(async function () {
  await importCSV('User')
  await importCSV('BirthRate')
  await importCSV('Hospital')

  /*
  GET http://localhost:8080/resources/User/0
  POST http://localhost:8080/resources/User/{id: 1, name: bob, age: 13}
  PUT http://localhost:8080/resources/User/1{name: Bob, age: 13}
  */

  const app = express()
  var router = express.Router()

  // middleware that is specific to this router
  router.use(function timeLog (req, res, next) {
    console.log('Time: ', Date.now())
    next()
  })
  // define the home page route
  router.get('/', function (req, res) {
    res.send('Birds home page')
  })
  // define the about route
  router.get('/about', function (req, res) {
    res.send('About birds')
  })

  app.use('/birds', router)

  const router2 = express.Router()
  router2.route('/:model/:id')
    .get(function (req, res) {
      const modelName = req.params.model
      const id = req.params.id
      const items = models[modelName]
      res.send(items[id])
    })
  router2.route('/:model')
    .get(function (req, res) {
      const modelName = req.params.model
      const ids = Object.keys(models[modelName])
      res.send(ids)
    })
    .post(function (req, res) {
      const modelName = req.params.model
      const items = models[modelName]
      const data = req.body
      if (items == null || data == null) {
        res.send('NG')
      } else {
        // set values into new object
        // TODO: validation
        const obj = {}
        const schema = schemas[modelName]
        const items = models[modelName]
        for (let k of Object.keys(schema)) {
          obj[k] = data[k]
          console.log(obj)
        }
        obj.id = data.id ? data.id : seq++
        items[obj.id] = obj
        res.send('OK')
      }
    })

  // parse json request body
  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(bodyParser.json())
  app.use('/resources', router2)

  app.get('/', function (req, res) {
    res.send(JSON.stringify(models, null, 2))
  })

  const server = app.listen(8080, function () {
    console.log(`listening to port: 8080`)
  })
})()
