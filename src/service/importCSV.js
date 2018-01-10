const fs = require('fs')
const csv = require('csv')
const iconv = require('iconv-lite')
const modelManager = require('./ModelManager').getModelManager()
let seq = 0

const inspectType = (v) => {
  // TODO
  return String
}

const createSchemaFromRecord = (record) => {
  const schema = {}
  for (let [k, v] of Object.entries(record)) {
    schema[k] = inspectType(v)
  }
  if (schema.id == null) {
    schema.id = {
      type: String
    }
  }
  return schema
}

module.exports = async function (modelName) {
  return new Promise((resolve, reject) => {
    const fileName = `./src/sample/${modelName}.csv`
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
        let Model = modelManager.getModel(modelName)
        if (Model == null) {
          const schema = createSchemaFromRecord(data)
          Model = modelManager.createModel(modelName, schema)
        }
        const item = new Model(data)
        item.id = id
        item.save()
      }
    })
    parser.on('end', () => {
      resolve()
    })
  })
}
