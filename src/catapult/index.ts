import { Catapult } from './Catapult.js'

const catapult = new Catapult('cert', 'sakia.harvestasya.com')
const res = await catapult.getDiagnosticCounter()
if (res) console.log(JSON.stringify(res.toJson(), undefined, '  '))
else console.log(undefined)
