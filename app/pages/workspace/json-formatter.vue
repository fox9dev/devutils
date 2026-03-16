<script setup lang="ts">
/**
 * JSON 格式化工具
 * 支持格式化、压缩、校验 JSON
 */
import { useClipboard } from '@vueuse/core'

const customToast = useCustomToast('json-formatter')

// 工具元数据定义
definePageMeta({
  layout: 'workspace',
  tool: {
    id: 'json-formatter',
    icon: 'lucide:braces',
    name: 'JSON 格式化',
    description: 'JSON 格式化、压缩、校验与美化',
    keywords: ['json', 'format', 'minify', 'validate', '格式化', '压缩', '校验', '美化', 'json formatter']
  }
})

// SEO 元信息
useSeoMeta({
  title: 'JSON 格式化 - 在线JSON格式化压缩校验工具',
  description: '免费在线 JSON 格式化工具，支持美化、压缩、校验 JSON。本地运行，隐私安全。',
  keywords: 'JSON格式化,JSON压缩,JSON校验,在线JSON,json formatter,json minify',
  ogTitle: 'DevUtils - JSON 格式化 - 在线JSON格式化压缩校验工具',
  ogDescription: '免费在线 JSON 格式化、压缩、校验工具。',
  ogUrl: 'https://devutils.fox9.dev/workspace/json-formatter'
})

const input = ref('')
const output = ref('')
const indentSize = ref(2)

function format() {
  if (!input.value.trim()) {
    output.value = ''
    return
  }
  try {
    const parsed = JSON.parse(input.value)
    output.value = JSON.stringify(parsed, null, indentSize.value)
  } catch (e) {
    output.value = ''
    customToast.error(`格式化失败：${(e as Error).message}`)
  }
}

function minify() {
  if (!input.value.trim()) {
    output.value = ''
    return
  }
  try {
    const parsed = JSON.parse(input.value)
    output.value = JSON.stringify(parsed)
  } catch (e) {
    output.value = ''
    customToast.error(`压缩失败：${(e as Error).message}`)
  }
}

function validate() {
  if (!input.value.trim()) {
    return
  }
  try {
    JSON.parse(input.value)
    output.value = '✓ JSON 格式正确'
  } catch (e) {
    output.value = ''
    customToast.error(`格式校验失败：${(e as Error).message}`)
  }
}

function switchValue() {
  const temp = input.value
  input.value = output.value
  output.value = temp
}

function clear() {
  input.value = ''
  output.value = ''
}

const { copy, copied } = useClipboard()

function copyOutput() {
  if (output.value) copy(output.value)
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex flex-col gap-2">
      <label class="text-sm font-medium text-muted">输入 JSON</label>
      <UTextarea
        v-model="input"
        :rows="12"
        placeholder="{&quot;key&quot;: &quot;value&quot;, &quot;array&quot;: [1, 2, 3]}"
        class="font-mono text-sm"
      />
    </div>

    <div class="flex flex-wrap items-center gap-2">
      <div class="flex items-center gap-2">
        <label class="text-sm text-muted">缩进</label>
        <UInput
          v-model.number="indentSize"
          type="number"
          :min="1"
          :max="8"
          class="w-16"
        />
        <span class="text-xs text-dimmed">空格</span>
      </div>
      <UButton
        icon="lucide:align-justify"
        color="success"
        @click="format"
      >
        格式化
      </UButton>
      <UButton
        icon="lucide:minimize-2"
        color="primary"
        @click="minify"
      >
        压缩
      </UButton>
      <UButton
        icon="lucide:circle-check"
        color="info"
        @click="validate"
      >
        校验
      </UButton>
      <UButton
        variant="ghost"
        icon="lucide:arrow-up-down"
        color="secondary"
        @click="switchValue"
      >
        交换
      </UButton>
      <UButton
        variant="ghost"
        color="error"
        icon="lucide:trash-2"
        @click="clear"
      >
        清空
      </UButton>
      <UButton
        variant="ghost"
        :color="copied ? 'success' : 'primary'"
        :icon="copied ? 'lucide:check' : 'lucide:copy'"
        :disabled="!output"
        @click="copyOutput"
      >
        {{ copied ? '复制成功' : '复制结果' }}
      </UButton>
    </div>

    <div class="flex flex-col gap-2">
      <label class="text-sm font-medium text-muted">输出</label>
      <UTextarea
        v-model="output"
        :rows="12"
        placeholder="格式化或压缩结果"
        readonly
        class="font-mono text-sm"
      />
    </div>
  </div>
</template>
