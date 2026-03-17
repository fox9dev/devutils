<script setup lang="ts">
/**
 * 数字进制转换
 * 二进制 / 八进制 / 十进制 / 十六进制互转
 */
definePageMeta({
  layout: 'workspace',
  tool: {
    id: 'number-base-converter',
    icon: 'lucide:hash',
    name: '进制转换',
    description: '二进制、八进制、十进制、十六进制数字互转',
    keywords: ['进制', '二进制', '八进制', '十进制', '十六进制', 'binary', 'octal', 'decimal', 'hex', 'base converter', 'radix']
  }
})

useSeoMeta({
  title: '进制转换 - 在线数字进制转换工具',
  description: '免费在线进制转换工具，二进制、八进制、十进制、十六进制互转。本地运行，隐私安全。',
  keywords: '进制转换,二进制,八进制,十进制,十六进制,binary,hex,octal,decimal',
  ogTitle: 'DevUtils - 进制转换 - 在线数字进制转换工具',
  ogDescription: '免费在线进制转换工具，二/八/十/十六进制互转。',
  ogUrl: 'https://devutils.fox9.dev/workspace/number-base-converter'
})

interface BaseField {
  label: string
  base: number
  prefix: string
  value: string
  placeholder: string
  pattern: RegExp
}

const fields = reactive<BaseField[]>([
  { label: '二进制 (Binary)', base: 2, prefix: '0b', value: '', placeholder: '10110', pattern: /^[01]+$/ },
  { label: '八进制 (Octal)', base: 8, prefix: '0o', value: '', placeholder: '26', pattern: /^[0-7]+$/ },
  { label: '十进制 (Decimal)', base: 10, prefix: '', value: '', placeholder: '22', pattern: /^-?\d+$/ },
  { label: '十六进制 (Hex)', base: 16, prefix: '0x', value: '', placeholder: '16', pattern: /^[0-9a-fA-F]+$/ }
])

const error = ref('')
let updating = false

function clearConvertedFields(index: number) {
  for (let i = 0; i < fields.length; i++) {
    if (i !== index) fields[i]!.value = ''
  }
}

function getCopyText(field: BaseField) {
  if (!field.value) return ''
  if (!field.prefix || !field.value.startsWith('-')) {
    return `${field.prefix}${field.value}`
  }

  return `-${field.prefix}${field.value.slice(1)}`
}

function onInput(index: number, input?: string | number) {
  if (updating) return
  updating = true
  error.value = ''

  const field = fields[index]!
  const raw = String(input ?? field.value).trim()
  field.value = raw

  if (!raw) {
    clearConvertedFields(index)
    updating = false
    return
  }

  if (!field.pattern.test(raw)) {
    clearConvertedFields(index)
    error.value = `输入不是合法的${field.label}数字`
    updating = false
    return
  }

  try {
    const num = BigInt(field.base === 10 ? raw : field.prefix + raw)
    for (let i = 0; i < fields.length; i++) {
      if (i !== index) {
        fields[i]!.value = num.toString(fields[i]!.base).toUpperCase()
        if (fields[i]!.base !== 16) {
          fields[i]!.value = fields[i]!.value.toLowerCase()
        }
      }
    }
  } catch (e) {
    clearConvertedFields(index)
    error.value = `转换失败：${(e as Error).message}`
  }

  updating = false
}

function clear() {
  for (const f of fields) f.value = ''
  error.value = ''
}

function loadSample() {
  fields[2]!.value = '255'
  onInput(2)
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <Note title="在任意进制输入框中输入数字，其他进制会自动转换。支持大整数（BigInt）。" />

    <div class="flex flex-col gap-4">
      <div
        v-for="(field, index) in fields"
        :key="field.base"
        class="flex flex-col gap-2"
      >
        <label class="text-sm font-medium text-muted">{{ field.label }}</label>
        <div class="flex items-center gap-2">
          <span
            v-if="field.prefix"
            class="text-sm font-mono text-dimmed"
          >{{ field.prefix }}</span>
          <UInput
            v-model="field.value"
            :placeholder="field.placeholder"
            class="flex-1 font-mono"
            @update:model-value="onInput(index, $event)"
          />
          <Copy :text="getCopyText(field)" />
        </div>
      </div>
    </div>

    <div class="flex flex-wrap items-center gap-2">
      <UButton
        icon="lucide:file-text"
        variant="ghost"
        color="secondary"
        @click="loadSample"
      >
        加载示例 (255)
      </UButton>
      <UButton
        variant="ghost"
        color="error"
        icon="lucide:trash-2"
        @click="clear"
      >
        清空
      </UButton>
    </div>

    <p
      v-if="error"
      class="text-sm text-error"
    >
      {{ error }}
    </p>
  </div>
</template>
