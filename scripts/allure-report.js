#!/usr/bin/env node
// Builds single-file Allure HTML reports from allure-results (one self-contained index.html each, no server needed):
//   allure-report/index.html        full report, with failure screenshots and page snapshots. INTERNAL ONLY:
//                                   failures on list pages can show real staff or complainant data.
//   allure-report-share/index.html  shareable copy: every attachment removed; .env values (username, password,
//                                   mobile numbers, OTP), this machine's project path and host name replaced.
// Usage: npm run report:single            (both reports)
//        node scripts/allure-report.js --share-only
// It prints counts only, never the values it removes.
const fs = require('fs')
const os = require('os')
const path = require('path')
const { spawnSync } = require('child_process')

const root = path.join(__dirname, '..')
const resultsDir = path.join(root, 'allure-results')
const shareOnly = process.argv.includes('--share-only')
require('dotenv').config({ path: path.join(root, '.env') })

function generate(fromDir, outRel) {
  const run = spawnSync('npx', ['allure', 'generate', JSON.stringify(fromDir), '--clean', '--single-file', '-o', outRel],
    { cwd: root, shell: true, encoding: 'utf8' })
  if (run.status !== 0) {
    process.stderr.write(run.stdout + run.stderr)
    throw new Error(`allure generate failed for ${outRel}`)
  }
  console.log(`Wrote ${outRel}/index.html`)
}

/** Values to blank out in the shareable copy, as [label, value] pairs. */
function sensitiveValues() {
  const keys = ['QA_PASSWORD', 'QA_USERNAME', 'QA_COMPLAINANT_MOBILE', 'QA_TEST_MOBILE', 'QA_TEST_OTP']
  const pairs = keys.map(k => [k, (process.env[k] || '').trim()]).filter(([, v]) => v.length >= 4)
  for (const p of [root, root.replace(/\\/g, '/')]) pairs.push(['project path', p])
  pairs.push(['host name', os.hostname()])
  // also match each value as it appears inside JSON strings (escaped backslashes and quotes)
  return pairs.flatMap(([label, v]) => {
    const escaped = JSON.stringify(v).slice(1, -1)
    return escaped === v ? [[label, v]] : [[label, escaped], [label, v]]
  }).sort((a, b) => b[1].length - a[1].length)   // longest first, so a path is replaced before a shorter value inside it
}

function stripAttachments(node) {
  let removed = (node.attachments || []).length
  node.attachments = []
  for (const step of node.steps || []) removed += stripAttachments(step)
  return removed
}

function buildShareable() {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'allure-share-'))
  const secrets = sensitiveValues()
  const hits = {}
  let attachments = 0
  try {
    for (const file of fs.readdirSync(resultsDir)) {
      if (/-attachment\b/.test(file)) continue   // screenshots, page snapshots, logs
      let text = fs.readFileSync(path.join(resultsDir, file), 'utf8')
      if (/-(result|container)\.json$/.test(file)) {
        const data = JSON.parse(text)
        attachments += stripAttachments(data)
        data.labels = (data.labels || []).filter(l => l.name !== 'host')
        text = JSON.stringify(data)
      }
      for (const [label, value] of secrets) {
        const parts = text.split(value)
        if (parts.length > 1) { hits[label] = (hits[label] || 0) + parts.length - 1; text = parts.join('[redacted]') }
      }
      fs.writeFileSync(path.join(tmp, file), text)
    }
    console.log(`Shareable copy: removed ${attachments} attachments; replaced: ${JSON.stringify(hits)}`)
    generate(tmp, 'allure-report-share')
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true })
  }
}

if (!fs.existsSync(resultsDir) || !fs.readdirSync(resultsDir).some(f => f.endsWith('-result.json'))) {
  console.error('No results in allure-results; run the tests first.')
  process.exit(1)
}
if (!shareOnly) generate(resultsDir, 'allure-report')
buildShareable()
