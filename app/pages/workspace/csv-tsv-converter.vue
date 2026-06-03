<script setup lang="ts">
/**
 * CSV / TSV 转换工具
 * 支持 CSV、TSV、JSON 与 Markdown 表格互转
 */
import Papa from 'papaparse'
import type { ParseError } from 'papaparse'

definePageMeta({
  layout: 'workspace',
  tool: {
    id: 'csv-tsv-converter',
    icon: 'lucide:table',
    name: 'CSV / TSV 转换',
    description: '解析 CSV、TSV、分号或竖线分隔文本，并转换为 JSON、Markdown、CSV、TSV',
    keywords: ['csv', 'tsv', 'table', 'json', 'markdown', 'delimiter', '表格', '转换', '逗号分隔', '制表符', 'csv converter']
  }
})

useSeoMeta({
  title: 'CSV / TSV 转换 - 在线表格数据转换工具',
  description: '免费在线 CSV / TSV 转换工具，支持自动或手动分隔符、表头开关，并输出 JSON、Markdown、CSV、TSV。本地运行，隐私安全。',
  keywords: 'CSV转换,TSV转换,CSV转JSON,CSV转Markdown,在线CSV工具,表格转换,csv converter,tsv converter',
  ogTitle: 'DevUtils - CSV / TSV 转换 - 在线表格数据转换工具',
  ogDescription: '免费在线 CSV / TSV 转换工具，支持 JSON、Markdown、CSV、TSV 输出。',
  ogUrl: 'https://devutils.fox9.dev/workspace/csv-tsv-converter'
})

type DelimiterMode = 'auto' | 'comma' | 'tab' | 'semicolon' | 'pipe'
type OutputMode = 'json' | 'markdown' | 'csv' | 'tsv'

interface ParsedTable {
  rows: string[][]
  dataRows: string[][]
  fields: string[]
  delimiter: string
  errors: ParseError[]
}

const input = ref(`name,email,role
Alice,alice@example.com,admin
Bob,bob@example.com,editor
"Charlie, Jr.",charlie@example.com,"reviewer
with notes"`)
const delimiterMode = ref<DelimiterMode>('auto')
const outputMode = ref<OutputMode>('json')
const hasHeader = ref(true)
const skipEmptyLines = ref(true)

const delimiterOptions: { label: string, value: DelimiterMode }[] = [
  { label: '自动', value: 'auto' },
  { label: ',', value: 'comma' },
  { label: 'Tab', value: 'tab' },
  { label: ';', value: 'semicolon' },
  { label: '|', value: 'pipe' }
]

const outputOptions: { label: string, value: OutputMode }[] = [
  { label: 'JSON', value: 'json' },
  { label: 'Markdown', value: 'markdown' },
  { label: 'CSV', value: 'csv' },
  { label: 'TSV', value: 'tsv' }
]

const delimiterMap: Record<Exclude<DelimiterMode, 'auto'>, string> = {
  comma: ',',
  tab: '\t',
  semicolon: ';',
  pipe: '|'
}

function selectedDelimiter(): string | undefined {
  if (delimiterMode.value === 'auto') return undefined
  return delimiterMap[delimiterMode.value]
}

function normalizeCell(value: unknown): string {
  if (value === null || value === undefined) return ''
  return String(value)
}

function normalizeHeader(value: string | undefined, index: number, seen: Map<string, number>): string {
  const raw = value?.trim() || `column_${index + 1}`
  const count = (seen.get(raw) ?? 0) + 1
  seen.set(raw, count)
  return count === 1 ? raw : `${raw}_${count}`
}

function maxColumnCount(rows: string[][]): number {
  return rows.reduce((max, row) => Math.max(max, row.length), 0)
}

function padRow(row: string[], length: number): string[] {
  return Array.from({ length }, (_, index) => row[index] ?? '')
}

const parsedTable = computed<ParsedTable>(() => {
  const trimmed = input.value.trim()
  if (!trimmed) {
    return { rows: [], dataRows: [], fields: [], delimiter: '', errors: [] }
  }

  const config: Papa.ParseConfig<string[]> = {
    dynamicTyping: false,
    skipEmptyLines: skipEmptyLines.value ? 'greedy' : false
  }
  const delimiter = selectedDelimiter()
  if (delimiter) config.delimiter = delimiter

  const result = Papa.parse<string[]>(input.value, config)
  const rows = result.data.map(row => row.map(normalizeCell))
  const dataRows = hasHeader.value ? rows.slice(1) : rows
  const columnCount = Math.max(maxColumnCount(rows), hasHeader.value ? rows[0]?.length ?? 0 : 0)
  const seen = new Map<string, number>()
  const fields = hasHeader.value
    ? Array.from({ length: columnCount }, (_, index) => normalizeHeader(rows[0]?.[index], index, seen))
    : Array.from({ length: columnCount }, (_, index) => `column_${index + 1}`)

  return {
    rows,
    dataRows,
    fields,
    delimiter: result.meta.delimiter || delimiter || '',
    errors: result.errors
  }
})

const fields = computed(() => parsedTable.value.fields)
const dataRows = computed(() => parsedTable.value.dataRows)
const rowCount = computed(() => dataRows.value.length)
const columnCount = computed(() => fields.value.length)
const parseErrors = computed(() => parsedTable.value.errors)
const detectedDelimiter = computed(() => {
  const delimiter = parsedTable.value.delimiter
  if (delimiter === '\t') return 'Tab'
  return delimiter || '无'
})

const objectRows = computed<Record<string, string>[]>(() =>
  dataRows.value.map((row) => {
    const padded = padRow(row, columnCount.value)
    return fields.value.reduce<Record<string, string>>((acc, field, index) => {
      acc[field] = padded[index] ?? ''
      return acc
    }, {})
  })
)

function markdownCell(value: string): string {
  return value
    .replace(/\r?\n/g, '<br>')
    .replace(/\|/g, '\\|')
}

function toMarkdownTable(): string {
  if (!columnCount.value) return ''

  const header = fields.value.map(markdownCell)
  const separator = fields.value.map(() => '---')
  const rows = dataRows.value.map(row => padRow(row, columnCount.value).map(markdownCell))
  return [header, separator, ...rows]
    .map(row => `| ${row.join(' | ')} |`)
    .join('\n')
}

function toDelimited(delimiter: string): string {
  const rows = hasHeader.value
    ? [fields.value, ...dataRows.value.map(row => padRow(row, columnCount.value))]
    : dataRows.value
  if (!rows.length) return ''
  return Papa.unparse(rows, { delimiter })
}

const output = computed(() => {
  if (!input.value.trim()) return ''

  if (outputMode.value === 'json') {
    const data = hasHeader.value
      ? objectRows.value
      : dataRows.value.map(row => padRow(row, columnCount.value))
    return JSON.stringify(data, null, 2)
  }

  if (outputMode.value === 'markdown') {
    return toMarkdownTable()
  }

  if (outputMode.value === 'tsv') {
    return toDelimited('\t')
  }

  return toDelimited(',')
})

function loadSample() {
  input.value = `name,email,role
Alice,alice@example.com,admin
Bob,bob@example.com,editor
"Charlie, Jr.",charlie@example.com,"reviewer
with notes"`
  delimiterMode.value = 'auto'
  outputMode.value = 'json'
  hasHeader.value = true
  skipEmptyLines.value = true
}

function clear() {
  input.value = ''
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <Note title="支持 CSV、TSV、分号和竖线分隔文本，可输出 JSON、Markdown 表格、CSV 或 TSV。" />

    <ToolTextSplit>
      <template #input>
        <div class="flex flex-col gap-2">
          <label class="text-sm font-medium text-muted">输入表格文本</label>
          <UTextarea
            v-model="input"
            :rows="14"
            placeholder="name,email&#10;Alice,alice@example.com"
            class="font-mono text-sm"
          />
        </div>
      </template>

      <template #actions>
        <div class="flex flex-col gap-3">
          <div class="flex flex-wrap items-center gap-3">
            <div class="flex flex-wrap items-center gap-2">
              <span class="text-sm text-muted">分隔符</span>
              <SegmentControl
                v-model="delimiterMode"
                :options="delimiterOptions"
                size="sm"
              />
            </div>
            <div class="flex flex-wrap items-center gap-2">
              <span class="text-sm text-muted">输出</span>
              <SegmentControl
                v-model="outputMode"
                :options="outputOptions"
                size="sm"
              />
            </div>
          </div>

          <div class="flex flex-wrap items-center gap-2">
            <UCheckbox
              v-model="hasHeader"
              label="第一行为表头"
            />
            <UCheckbox
              v-model="skipEmptyLines"
              label="跳过空行"
            />
            <UButton
              icon="lucide:file-text"
              variant="ghost"
              color="secondary"
              @click="loadSample"
            >
              示例
            </UButton>
            <UButton
              variant="ghost"
              color="error"
              icon="lucide:trash-2"
              @click="clear"
            >
              清空
            </UButton>
            <Copy :text="output" />
            <span class="text-sm text-muted">
              {{ rowCount }} 行 / {{ columnCount }} 列 / 分隔符：{{ detectedDelimiter }}
            </span>
          </div>

          <div
            v-if="parseErrors.length"
            class="flex flex-col gap-1 rounded-lg border border-error/40 bg-error/10 p-3 text-sm text-error"
          >
            <div
              v-for="(item, index) in parseErrors"
              :key="`${item.code}-${index}`"
            >
              {{ item.message }}（row: {{ item.row ?? 0 }}）
            </div>
          </div>
        </div>
      </template>

      <template #output>
        <div class="flex flex-col gap-2">
          <label class="text-sm font-medium text-muted">输出</label>
          <UTextarea
            :model-value="output"
            :rows="14"
            placeholder="转换结果"
            readonly
            class="font-mono text-sm"
          />
        </div>
      </template>
    </ToolTextSplit>
  </div>
</template>
