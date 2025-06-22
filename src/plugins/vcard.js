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
    // 确保所有电话号码都是字符串类型，避免数字精度问题
    vCard.cellPhone = vCard.cellPhone
      .filter((phone) => {
        return true // 允许所有号码通过
      })
      .map(phone => String(phone)) // 确保转换为字符串
  }
  vCard.photo.embedFromFile(path.replace('.yaml', '.png'))
  let formatted = vCard.getFormattedString()
  formatted = addPhoneticField(formatted, 'ORG')
  file.contents = Buffer.from(formatted)
  cb(null, file)
}

export default plugin
