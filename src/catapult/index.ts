import { Catapult } from './Catapult.js'

const catapult = new Catapult('cert', 'sakia.harvestasya.com')
console.log((await catapult.getDiagnosticCounter())?.toJson())
