<script setup lang="ts">
/**
 * URL 编解码工具
 * 支持 encodeURI / encodeURIComponent
 */
import { useClipboard } from '@vueuse/core'

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

// 编码
function encode() {
  if (!input.value) {
    output.value = ''
    return
  }

  if (encodeType.value === EncodeType.URI) {
    output.value = encodeURI(input.value)
  } else {
    output.value = encodeURIComponent(input.value)
  }
}

// 解码
function decode() {
  if (!input.value) {
    output.value = ''
    return
  }

  if (encodeType.value === EncodeType.URI) {
    output.value = decodeURI(input.value)
  } else {
    output.value = decodeURIComponent(input.value)
  }
}

// 切换模式时交换输入输出
function switchValue() {
  const temp = input.value
  input.value = output.value
  output.value = temp
}

// 清空
function clear() {
  input.value = ''
  output.value = ''
}

// 复制结果
const { copy, copied } = useClipboard()

function copyOutput() {
  if (output.value) {
    copy(output.value)
  }
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <Note title="URI：保留 URL 结构字符 ; / ? : @ & = + $ , #" />
    <Note
      color="info"
      title="URIComponent：除英文字母、数字和 - _ . ! ~ * ' ( ) 之外的所有字符都进行编码"
    />

    <div class="flex flex-col gap-2">
      <UTextarea
        v-model="input"
        :rows="10"
        placeholder="输入要处理的文本"
      />

      <!-- 操作栏 -->
      <div class="flex flex-col gap-2">
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

          <UButton
            variant="ghost"
            :color="copied ? 'success' : 'primary'"
            :icon="copied ? 'lucide:check' : 'lucide:copy'"
            @click="copyOutput"
          >
            {{ copied ? '复制成功' : '复制结果' }}
          </UButton>
        </div>

        <UTextarea
          v-model="output"
          :rows="10"
          placeholder="处理结果"
        />
      </div>
    </div>
  </div>
</template>
