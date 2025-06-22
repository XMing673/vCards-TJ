import fs from 'fs'
import yaml from 'js-yaml'
import vCardsJS from 'vcards-js'
import addPhoneticField from '../utils/pinyin.js'

const plugin = (file, _, cb) => {
  const path = file.path
  const data = fs.readFileSync(path, 'utf8')
  const json = yaml.load(data)

  let vCard = vCardsJS()
  vCard.isOrganization = true
  for (const [key, value] of Object.entries(json.basic)) {
    vCard[key] = value
  }
  // 修改过滤条件，保留所有号码
  if (vCard.cellPhone) {
    // 不进行任何过滤
    vCard.cellPhone = vCard.cellPhone
      .filter((phone) => {
        const phoneStr = `${phone}`
        return true // 允许所有号码通过
      })
  }
  vCard.photo.embedFromFile(path.replace('.yaml', '.png'))
  let formatted = vCard.getFormattedString()
  formatted = addPhoneticField(formatted, 'ORG')
  file.contents = Buffer.from(formatted)
  cb(null, file)
}

export default plugin
