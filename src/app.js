const express = require('express')
const bodyParser = require('body-parser')
const router = require('./controller/CRUDController')
const importCSV = require('./service/importCSV')

// TODO: DataStore
;(async function () {
  /*
  GET http://localhost:8080/resources/User/0
  POST http://localhost:8080/resources/User/{id: 1, name: bob, age: 13}
  PUT http://localhost:8080/resources/User/1{name: Bob, age: 13}
  */
  importCSV('User')

  const app = express()

  // parse json request body
  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(bodyParser.json())
  app.use('/resources', router)

  app.listen(8080, function () {
    console.log(`listening to port: 8080`)
  })
})()
