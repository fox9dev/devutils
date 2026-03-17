<script setup lang="ts">
/**
 * Base64 编解码工具
 * 支持文本的 Base64 编码与解码
 */
// 工具元数据定义
definePageMeta({
  layout: 'workspace',
  tool: {
    id: 'base64-codec',
    icon: 'lucide:binary',
    name: 'Base64 编解码',
    description: 'Base64 编码与解码，支持文本转换',
    keywords: ['base64', 'encode', 'decode', '编码', '解码', 'base64 encoder', 'base64 decoder', '在线Base64']
  }
})

// SEO 元信息
useSeoMeta({
  title: 'Base64 编解码 - 在线Base64编码解码工具',
  description: '免费在线 Base64 编解码工具，支持文本 Base64 编码与解码。本地运行，隐私安全。',
  keywords: 'Base64编码,Base64解码,在线Base64,base64 encode,base64 decode,文本编码',
  ogTitle: 'DevUtils - Base64 编解码 - 在线Base64编码解码工具',
  ogDescription: '免费在线 Base64 编解码工具，文本编码解码一键转换。',
  ogUrl: 'https://devutils.fox9.dev/workspace/base64-codec'
})

const input = ref('')
const output = ref('')
const error = ref('')

function encode() {
  error.value = ''
  if (!input.value) {
    output.value = ''
    return
  }
  try {
    const bytes = new TextEncoder().encode(input.value)
    let binary = ''
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]!)
    }
    output.value = btoa(binary)
  } catch {
    error.value = '编码失败'
    output.value = ''
  }
}

function decode() {
  error.value = ''
  if (!input.value) {
    output.value = ''
    return
  }
  try {
    const binary = atob(input.value)
    const bytes = new Uint8Array(binary.length)
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i)
    }
    output.value = new TextDecoder().decode(bytes)
  } catch {
    error.value = '解码失败'
    output.value = ''
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
  error.value = ''
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex flex-col gap-2">
      <label class="text-sm font-medium text-muted">输入</label>
      <UTextarea
        v-model="input"
        :rows="8"
        placeholder="输入要编码或解码的文本..."
      />
    </div>

    <div class="flex flex-wrap items-center gap-2">
      <UButton
        icon="lucide:arrow-down-to-line"
        color="success"
        @click="encode"
      >
        编码
      </UButton>
      <UButton
        icon="lucide:arrow-up-from-line"
        color="warning"
        @click="decode"
      >
        解码
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
      <Copy :text="output" />
    </div>

    <div class="flex flex-col gap-2">
      <label class="text-sm font-medium text-muted">
        输出
        <span
          v-if="error"
          class="text-sm text-error"
        >
          {{ error }}
        </span>
      </label>
      <UTextarea
        v-model="output"
        :rows="8"
        placeholder="结果将显示在这里"
        readonly
        class="font-mono"
      />
    </div>
  </div>
</template>
