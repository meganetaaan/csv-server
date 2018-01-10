const express = require('express')
const router = express.Router()
const importCSV = require('../service/importCSV')
const multer = require('multer')
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, '')
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname)
  }
})
const upload = multer({
  storage: storage
})

router.route('/csv')
  .post(upload.single('file'), async function (req, res) {
    const file = req.file
    const modelName = file.originalname.split('.')[0]
    importCSV.importCSV(modelName, file.path)
    res.send('OK')
  })

module.exports = router
