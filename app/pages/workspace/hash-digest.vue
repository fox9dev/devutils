<script setup lang="ts">
/**
 * Hash 摘要工具
 * 支持 MD5、SHA-1、SHA-256、SHA-384、SHA-512，输入文本或选择文件计算摘要
 */
import { md5 } from 'js-md5'

// 工具元数据定义
definePageMeta({
  layout: 'workspace',
  tool: {
    id: 'hash-digest',
    icon: 'lucide:hash',
    name: 'Hash 摘要',
    description: '计算文本或文件的 MD5、SHA-1、SHA-256、SHA-384、SHA-512 摘要',
    keywords: ['hash', 'md5', 'sha1', 'sha256', 'sha384', 'sha512', '摘要', '校验', 'checksum', '哈希', '摘要工具']
  }
})

// SEO 元信息
useSeoMeta({
  title: 'Hash 摘要 - 在线 MD5/SHA 哈希计算工具',
  description: '免费在线 Hash 摘要工具，支持 MD5、SHA-1、SHA-256、SHA-384、SHA-512，可对文本或文件计算十六进制摘要。本地运行，隐私安全。',
  keywords: 'Hash摘要,MD5,SHA-1,SHA-256,SHA-512,在线哈希,checksum,文件校验,摘要计算',
  ogTitle: 'DevUtils - Hash 摘要 - 在线 MD5/SHA 哈希计算工具',
  ogDescription: '免费在线 Hash 摘要工具，支持 MD5、SHA-1、SHA-256 等算法，文本或文件均可。',
  ogUrl: 'https://devutils.fox9.dev/workspace/hash-digest'
})

// ===================== 算法配置 =====================

type HashAlgo = 'md5' | 'sha1' | 'sha256' | 'sha384' | 'sha512'

interface AlgoOption {
  label: string
  value: HashAlgo
  description: string
}

const algoOptions: AlgoOption[] = [
  { label: 'MD5', value: 'md5', description: '128 位，常用于校验' },
  { label: 'SHA-1', value: 'sha1', description: '160 位' },
  { label: 'SHA-256', value: 'sha256', description: '256 位，推荐' },
  { label: 'SHA-384', value: 'sha384', description: '384 位' },
  { label: 'SHA-512', value: 'sha512', description: '512 位' }
]

const selectedAlgo = ref<HashAlgo>('sha256')
const input = ref('')
const output = ref('')
const computing = ref(false)
const selectedFile = ref<File | null>(null)

// 将 ArrayBuffer 转为十六进制字符串
function bufferToHex(buffer: ArrayBuffer): string {
  const arr = new Uint8Array(buffer)
  return Array.from(arr)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}

// 使用 Web Crypto 计算 SHA 系列（传入 ArrayBuffer 避免 BufferSource 类型兼容问题）
async function digestSHA(algo: 'SHA-1' | 'SHA-256' | 'SHA-384' | 'SHA-512', data: Uint8Array): Promise<string> {
  const buf = data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength) as ArrayBuffer
  const buffer = await crypto.subtle.digest(algo, buf)
  return bufferToHex(buffer)
}

const SHA_ALGO_MAP: Record<Exclude<HashAlgo, 'md5'>, 'SHA-1' | 'SHA-256' | 'SHA-384' | 'SHA-512'> = {
  sha1: 'SHA-1',
  sha256: 'SHA-256',
  sha384: 'SHA-384',
  sha512: 'SHA-512'
}

async function computeHash(data: Uint8Array): Promise<string> {
  const algo = selectedAlgo.value
  if (algo === 'md5') {
    return md5(data).toLowerCase()
  }
  return digestSHA(SHA_ALGO_MAP[algo], data)
}

async function hashText() {
  if (!input.value) {
    output.value = ''
    return
  }
  computing.value = true
  output.value = ''
  try {
    const encoder = new TextEncoder()
    const data = encoder.encode(input.value)
    const hash = await computeHash(data)
    output.value = hash
  } finally {
    computing.value = false
  }
}

async function hashFile(file: File) {
  computing.value = true
  output.value = ''
  try {
    const buffer = await file.arrayBuffer()
    const data = new Uint8Array(buffer)
    const hash = await computeHash(data)
    output.value = hash
    input.value = ''
  } finally {
    computing.value = false
  }
}

watch(selectedFile, async (file) => {
  if (file) await hashFile(file)
})

watch(input, (val) => {
  if (val) selectedFile.value = null
})

function clearAll() {
  input.value = ''
  output.value = ''
  selectedFile.value = null
}

// 当前算法说明
const currentAlgoDesc = computed(() =>
  algoOptions.find(a => a.value === selectedAlgo.value)?.description ?? ''
)
</script>

<template>
  <div class="flex flex-col gap-4">
    <Note
      title="对输入文本或上传文件计算哈希摘要，结果以十六进制输出。SHA-256 推荐用于安全场景。"
      class="mb-1"
    />

    <!-- 算法选择 -->
    <div class="flex flex-col gap-2">
      <label class="text-sm font-medium text-muted">算法</label>
      <div>
        <SegmentControl
          v-model="selectedAlgo"
          :options="algoOptions.map(a => ({ label: a.label, value: a.value }))"
        />
      </div>
      <p class="text-xs text-dimmed">
        {{ currentAlgoDesc }}
      </p>
    </div>

    <!-- 输入区 -->
    <div class="flex flex-col gap-2">
      <label class="text-sm font-medium text-muted">输入文本</label>
      <UTextarea
        v-model="input"
        :rows="5"
        placeholder="输入要计算摘要的文本..."
      />
    </div>

    <!-- 或选择文件 -->
    <div class="flex flex-col gap-2">
      <label class="text-sm font-medium text-muted">选择文件</label>
      <UFileUpload
        v-model="selectedFile"
        variant="area"
        label="选择文件计算摘要"
        description="拖拽或点击选择文件，将使用当前算法计算摘要"
        layout="list"
        icon="lucide:upload"
      />
    </div>

    <!-- 操作栏 -->
    <div class="flex flex-wrap items-center gap-2">
      <UButton
        icon="lucide:play"
        color="success"
        :loading="computing"
        :disabled="!input && !output"
        @click="hashText"
      >
        计算摘要
      </UButton>

      <UButton
        variant="ghost"
        color="error"
        icon="lucide:trash-2"
        @click="clearAll"
      >
        清空
      </UButton>

      <Copy :text="output" />
    </div>

    <!-- 输出 -->
    <div class="flex flex-col gap-2">
      <label class="text-sm font-medium text-muted">摘要结果（十六进制）</label>
      <UInput
        :model-value="output"
        placeholder="摘要将显示在这里"
        readonly
        class="font-mono text-sm"
      />
    </div>
  </div>
</template>
