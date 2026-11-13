import { readFileSync } from 'node:fs'

function analyze({prefix,slots,records}) {
  if (typeof prefix!=='string'||!/^[A-Za-z0-9]{1,10}$/.test(prefix)||!Number.isInteger(slots)||slots<1||slots>99||
      !Array.isArray(records)||records.some(id=>typeof id!=='string'||!id.trim())||new Set(records).size!==records.length)
    throw new Error('Invalid prefix, slot count, or accession list')
  const labels=records.map((id,i)=>{
    const box=String(Math.floor(i/slots)+1).padStart(3,'0')
    const slot=String(i%slots+1).padStart(2,'0')
    return {id,label:prefix+'-'+box+'-'+slot}
  })
  return {boxes:Math.ceil(records.length/slots),lastLabel:labels.at(-1)?.label??null,labels}
}

try {
  if (process.argv.length !== 3) throw new Error('Usage: node app.mjs input.json')
  console.log(JSON.stringify(analyze(JSON.parse(readFileSync(process.argv[2], 'utf8')))))
} catch (error) {
  console.error(error.message)
  process.exitCode = 2
}
