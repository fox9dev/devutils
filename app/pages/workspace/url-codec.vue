<script setup lang="ts">
/**
 * URL 编解码工具
 * 支持 encodeURI / encodeURIComponent
 */
// 工具元数据定义
definePageMeta({
  layout: 'workspace',
  tool: {
    id: 'url-codec',
    icon: 'lucide:link',
    name: 'URL 编解码',
    description: 'URL 编码与解码，支持 encodeURI 和 encodeURIComponent',
    keywords: ['url', 'encode', 'decode', 'uri', 'percent', '百分号编码', 'url encoder', 'url decoder', '免费URL编码解码']
  }
})

// SEO 元信息
useSeoMeta({
  title: 'URL 编解码 - 在线URL编码解码工具',
  description: '免费在线 URL 编解码工具，支持 encodeURI 和 encodeURIComponent 两种模式，URL 编码与解码一键转换。本地运行，隐私安全。',
  keywords: 'URL编码,URL解码,在线URL编解码,encodeURI,encodeURIComponent,百分号编码,URL Encoder,URL Decoder,免费URL编码解码',
  ogTitle: 'DevUtils - URL 编解码 - 在线URL编码解码工具',
  ogDescription: '免费在线 URL 编解码工具，支持 encodeURI / encodeURIComponent。',
  ogUrl: 'https://devutils.fox9.dev/workspace/url-codec'
})

// 编码类型
enum EncodeType {
  URI = 'URI',
  COMPONENT = 'URIComponent'
}
const encodeType = ref<EncodeType>(EncodeType.COMPONENT)

// 输入
const input = ref('')

// 输出
const output = ref('')
const error = ref('')

function setResult(action: '编码' | '解码', handler: (value: string) => string) {
  error.value = ''
  if (!input.value) {
    output.value = ''
    return
  }

  try {
    output.value = handler(input.value)
  } catch (e) {
    output.value = ''
    error.value = `${action}失败：${(e as Error).message}`
  }
}

// 编码
function encode() {
  setResult('编码', value => encodeType.value === EncodeType.URI ? encodeURI(value) : encodeURIComponent(value))
}

// 解码
function decode() {
  setResult('解码', value => encodeType.value === EncodeType.URI ? decodeURI(value) : decodeURIComponent(value))
}

// 切换模式时交换输入输出
function switchValue() {
  const temp = input.value
  input.value = output.value
  output.value = temp
  error.value = ''
}

// 清空
function clear() {
  input.value = ''
  output.value = ''
  error.value = ''
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <Note title="URI：保留 URL 结构字符 ; / ? : @ & = + $ , #" />
    <Note
      color="info"
      title="URIComponent：除英文字母、数字和 - _ . ! ~ * ' ( ) 之外的所有字符都进行编码"
    />

    <ToolTextSplit>
      <template #input>
        <div class="flex min-w-0 flex-col gap-2">
          <label class="text-sm font-medium text-muted">输入</label>
          <UTextarea
            v-model="input"
            :rows="10"
            placeholder="输入要处理的文本"
            class="w-full"
          />
        </div>
      </template>

      <template #actions>
        <div class="flex flex-wrap items-center gap-2">
          <!-- 编码类型 -->
          <SegmentControl
            v-model="encodeType"
            :options="[{ label: 'URIComponent', value: EncodeType.COMPONENT }, { label: 'URI', value: EncodeType.URI }]"
          />

          <UButton
            variant="ghost"
            icon="lucide:arrow-up-down"
            color="secondary"
            @click="switchValue"
          >
            交换
          </UButton>

          <UButton
            icon="lucide:play"
            color="success"
            @click="encode"
          >
            编码
          </UButton>
          <UButton
            color="warning"
            icon="lucide:package-open"
            @click="decode"
          >
            解码
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
      </template>

      <template #output>
        <div class="flex min-w-0 flex-col gap-2">
          <label class="text-sm font-medium text-muted">输出</label>
          <UTextarea
            v-model="output"
            :rows="10"
            placeholder="处理结果"
            readonly
            class="w-full"
          />
          <p
            v-if="error"
            class="text-sm text-error"
          >
            {{ error }}
          </p>
        </div>
      </template>
    </ToolTextSplit>
  </div>
</template>
