import * as allure from 'allure-js-commons'

/** The YAML fields every test reports to Allure (same calls and labels as the inline blocks in the older specs). */
export type CaseMeta = {
  yamlSource: string
  module: string
  flowId: string
  flowName: string
  caseId: string
  title: string
  type: 'happy_path' | 'edge_case' | 'negative'
  priority: 'P0' | 'P1' | 'P2'
  tags: string[]
  testDataRef: string
  coverageNote: string
}

const SEVERITY: Record<CaseMeta['priority'], string> = { P0: 'critical', P1: 'normal', P2: 'minor' }

/** Traceability parameters first, then report metadata: YAML case → Allure test. */
export async function traceCase(m: CaseMeta): Promise<void> {
  await allure.tms(m.yamlSource + '#' + m.caseId, m.caseId)
  await allure.parameter('case_id', m.caseId)
  await allure.parameter('flow_id', m.flowId)
  await allure.parameter('module', m.module)
  await allure.parameter('type', m.type)
  await allure.parameter('priority', m.priority)
  await allure.parameter('test_data_ref', m.testDataRef)
  await allure.parameter('yaml_source', m.yamlSource)
  await allure.epic(m.module)
  await allure.feature(m.flowName)
  await allure.story(m.title)
  await allure.severity(SEVERITY[m.priority])
  for (const tag of m.tags) await allure.tag(tag)
  await allure.description(m.coverageNote + '\n\nSource: ' + m.yamlSource + '#' + m.caseId)
}
