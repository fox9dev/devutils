<script setup lang="ts">
/**
 * HTML 实体编解码工具
 * 支持命名实体和数字实体两种模式
 */

definePageMeta({
  layout: 'workspace',
  tool: {
    id: 'html-entity-codec',
    icon: 'lucide:code-xml',
    name: 'HTML 实体编解码',
    description: '将特殊字符转义为 HTML 实体或反向还原',
    keywords: ['html', 'entity', 'encode', 'decode', 'escape', '转义', 'HTML实体', '编码', '解码', '特殊字符']
  }
})

useSeoMeta({
  title: 'HTML 实体编解码 - 在线 HTML 转义工具',
  description: '免费在线 HTML 实体编解码工具，支持命名实体和数字实体模式，将特殊字符转为 HTML 实体或还原。本地运行，隐私安全。',
  keywords: 'HTML实体,HTML编码,HTML解码,HTML转义,html entity,html encode,html decode',
  ogTitle: 'DevUtils - HTML 实体编解码 - 在线 HTML 转义工具',
  ogDescription: '免费在线 HTML 实体编解码工具，支持命名实体和数字实体。',
  ogUrl: 'https://devutils.fox9.dev/workspace/html-entity-codec'
})

type EntityMode = 'named' | 'numeric'
const entityMode = ref<EntityMode>('named')
const input = ref('')
const output = ref('')

// 命名实体映射
const namedEntityMap: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  '\'': '&apos;',
  '©': '&copy;',
  '®': '&reg;',
  '™': '&trade;',
  '€': '&euro;',
  '£': '&pound;',
  '¥': '&yen;',
  '¢': '&cent;',
  '§': '&sect;',
  '°': '&deg;',
  '±': '&plusmn;',
  '×': '&times;',
  '÷': '&divide;',
  '≤': '&le;',
  '≥': '&ge;',
  '≠': '&ne;',
  '∞': '&infin;',
  '←': '&larr;',
  '→': '&rarr;',
  '↑': '&uarr;',
  '↓': '&darr;',
  '♠': '&spades;',
  '♣': '&clubs;',
  '♥': '&hearts;',
  '♦': '&diams;',
  ' ': '&nbsp;'
}

// 反向映射
const reverseNamedMap: Record<string, string> = {}
for (const [char, entity] of Object.entries(namedEntityMap)) {
  reverseNamedMap[entity] = char
}

function encodeNamed(text: string): string {
  return text.replace(/[&<>"'©®™€£¥¢§°±×÷≤≥≠∞←→↑↓♠♣♥♦]/g, ch => namedEntityMap[ch] ?? ch)
}

function encodeNumeric(text: string): string {
  let result = ''
  for (const ch of text) {
    const code = ch.codePointAt(0)!
    // ASCII 可打印字符中仅对 HTML 特殊字符编码；非 ASCII 全部编码
    if (code > 127 || ch === '&' || ch === '<' || ch === '>' || ch === '"' || ch === '\'') {
      result += `&#${code};`
    } else {
      result += ch
    }
  }
  return result
}

function decodeEntities(text: string): string {
  // 先解码命名实体
  let result = text.replace(/&[a-zA-Z]+;/g, entity => reverseNamedMap[entity] ?? entity)
  // 再解码数字实体（十进制）
  result = result.replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number.parseInt(code)))
  // 十六进制数字实体
  result = result.replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCodePoint(Number.parseInt(hex, 16)))
  return result
}

function encode() {
  if (!input.value) {
    output.value = ''
    return
  }
  output.value = entityMode.value === 'named'
    ? encodeNamed(input.value)
    : encodeNumeric(input.value)
}

function decode() {
  if (!input.value) {
    output.value = ''
    return
  }
  output.value = decodeEntities(input.value)
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

// 常用实体参考表
const referenceEntities = [
  { char: '&', named: '&amp;', numeric: '&#38;', desc: 'And 符号' },
  { char: '<', named: '&lt;', numeric: '&#60;', desc: '小于号' },
  { char: '>', named: '&gt;', numeric: '&#62;', desc: '大于号' },
  { char: '"', named: '&quot;', numeric: '&#34;', desc: '双引号' },
  { char: '\'', named: '&apos;', numeric: '&#39;', desc: '单引号' },
  { char: ' ', named: '&nbsp;', numeric: '&#160;', desc: '不间断空格' },
  { char: '©', named: '&copy;', numeric: '&#169;', desc: '版权' },
  { char: '®', named: '&reg;', numeric: '&#174;', desc: '注册商标' },
  { char: '™', named: '&trade;', numeric: '&#8482;', desc: '商标' },
  { char: '€', named: '&euro;', numeric: '&#8364;', desc: '欧元' }
]
</script>

<template>
  <div class="flex flex-col gap-4">
    <Note title="将特殊字符编码为 HTML 实体，或将 HTML 实体解码还原为原始字符。" />
    <Note
      color="info"
      title="命名实体：可读性好（如 &amp;amp;）；数字实体：兼容性好（如 &amp;#38;）"
    />

    <div class="flex flex-col gap-2">
      <label class="text-sm font-medium text-muted">输入</label>
      <UTextarea
        v-model="input"
        :rows="8"
        placeholder="输入要编码或解码的文本..."
        class="font-mono text-sm"
      />
    </div>

    <!-- 操作栏 -->
    <div class="flex flex-wrap items-center gap-2">
      <SegmentControl
        v-model="entityMode"
        :options="[
          { label: '命名实体', value: 'named' as EntityMode },
          { label: '数字实体', value: 'numeric' as EntityMode }
        ]"
      />
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

    <!-- 输出 -->
    <div class="flex flex-col gap-2">
      <label class="text-sm font-medium text-muted">输出</label>
      <UTextarea
        v-model="output"
        :rows="8"
        placeholder="处理结果"
        readonly
        class="font-mono text-sm"
      />
    </div>

    <!-- 常用实体参考 -->
    <div class="flex flex-col gap-2">
      <label class="text-sm font-medium text-muted">常用 HTML 实体参考</label>
      <div class="overflow-x-auto rounded-lg border border-default">
        <table class="w-full text-sm">
          <thead>
            <tr class="bg-elevated text-muted">
              <th class="px-3 py-2 text-left font-medium">
                字符
              </th>
              <th class="px-3 py-2 text-left font-medium">
                说明
              </th>
              <th class="px-3 py-2 text-left font-medium">
                命名实体
              </th>
              <th class="px-3 py-2 text-left font-medium">
                数字实体
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="ent in referenceEntities"
              :key="ent.char"
              class="border-t border-default"
            >
              <td class="px-3 py-2 font-mono text-default">
                {{ ent.char === ' ' ? '(空格)' : ent.char }}
              </td>
              <td class="px-3 py-2 text-muted">
                {{ ent.desc }}
              </td>
              <td class="px-3 py-2 font-mono text-default">
                {{ ent.named }}
              </td>
              <td class="px-3 py-2 font-mono text-default">
                {{ ent.numeric }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
