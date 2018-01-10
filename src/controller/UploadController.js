const express = require('express')
const router = express.Router()
const importCSV = require('../service/importCSV')
const multer = require('multer')
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, '')
  }
})

router.route('/csv')
  .post(async function (req, res) {
    const file = req.body
    importCSV(file)
  })

module.exports = router
