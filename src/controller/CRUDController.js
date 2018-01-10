const express = require('express')
const router = express.Router()
const modelManager = require('../service/ModelManager').getModelManager()
const uuid = require('uuid/v1')

router.route('/:model/:id')
  .get(async function (req, res) {
    const modelName = req.params.model
    const id = req.params.id
    // const items = models[modelName]
    const Model = modelManager.getModel(modelName)
    try {
      const item = await Model.find({ id }).exec()
      res.send(item)
    } catch (e) {
      throw e
    }
  })
router.route('/removeall/:model')
  .delete(async function (req, res) {
    const modelName = req.params.model
    const Model = modelManager.getModel(modelName)
    try {
      await Model.remove().exec()
      res.send()
    } catch (e) {
      throw e
    }
  })
router.route('/:model')
  .get(async function (req, res) {
    const modelName = req.params.model
    const Model = modelManager.getModel(modelName)
    try {
      const item = await Model.find().exec()
      res.send(item)
    } catch (e) {
      throw e
    }
  })
  .post(function (req, res) {
    const modelName = req.params.model
    // const items = models[modelName]
    const Model = modelManager.getModel(modelName)
    const data = req.body
    if (data.id == null) {
      data.id = uuid()
    }
    try {
      const item = new Model(data)
      item.save()
      res.send('OK')
    } catch (e) {
      throw e
    }
  })

module.exports = router
