<script setup lang="ts">
/**
 * 文本对比工具
 * 对比两段文本，高亮显示差异
 */
import { diffLines, diffChars, diffWords } from 'diff'

// 工具元数据定义
definePageMeta({
  layout: 'workspace',
  tool: {
    id: 'text-diff',
    icon: 'lucide:file-diff',
    name: '文本对比',
    description: '对比两段文本，高亮显示差异',
    keywords: ['diff', 'compare', '对比', '差异', '比较']
  }
})

// 输入
const textA = ref('')
const textB = ref('')

// 对比模式
const diffMode = ref<'lines' | 'words' | 'chars'>('lines')

// 历史记录
const { save: saveHistory } = useToolHistory('text-diff', {
  onRestore(record) {
    diffMode.value = record.config.diffMode ?? 'lines'
    textA.value = record.input.textA ?? ''
    textB.value = record.input.textB ?? ''
  }
})

// 对比结果
const diffResult = computed(() => {
  if (!textA.value && !textB.value) {
    return []
  }

  switch (diffMode.value) {
    case 'chars':
      return diffChars(textA.value, textB.value)
    case 'words':
      return diffWords(textA.value, textB.value)
    case 'lines':
    default:
      return diffLines(textA.value, textB.value)
  }
})

// 统计
const stats = computed(() => {
  let added = 0
  let removed = 0
  let unchanged = 0

  for (const part of diffResult.value) {
    const count = part.count || 1
    if (part.added) {
      added += count
    } else if (part.removed) {
      removed += count
    } else {
      unchanged += count
    }
  }

  return { added, removed, unchanged }
})

// 清空
function clear() {
  textA.value = ''
  textB.value = ''
}

// 交换
function swap() {
  // 保存当前状态到历史
  if (textA.value || textB.value) {
    saveHistory({ textA: textA.value, textB: textB.value }, '', { diffMode: diffMode.value })
  }
  const temp = textA.value
  textA.value = textB.value
  textB.value = temp
}

// 加载示例
function loadExample() {
  textA.value = `function greet(name) {
  console.log("Hello, " + name);
  return true;
}`
  textB.value = `function greet(name, greeting = "Hello") {
  console.log(greeting + ", " + name + "!");
  return true;
}`
}
</script>

<template>
  <div class="flex flex-col gap-4 h-full p-4">
    <!-- 操作栏 -->
    <div class="flex flex-wrap items-center gap-2">
      <!-- 对比模式 -->
      <span class="text-sm text-[var(--ui-text-muted)]">对比模式：</span>
      <div class="inline-flex rounded-lg border border-[var(--ui-border)] p-0.5">
        <button
          class="px-3 py-1.5 text-sm rounded-md transition-colors"
          :class="diffMode === 'lines' ? 'bg-primary-500 text-white' : 'text-[var(--ui-text-muted)] hover:text-[var(--ui-text)]'"
          @click="diffMode = 'lines'"
        >
          按行
        </button>
        <button
          class="px-3 py-1.5 text-sm rounded-md transition-colors"
          :class="diffMode === 'words' ? 'bg-primary-500 text-white' : 'text-[var(--ui-text-muted)] hover:text-[var(--ui-text)]'"
          @click="diffMode = 'words'"
        >
          按词
        </button>
        <button
          class="px-3 py-1.5 text-sm rounded-md transition-colors"
          :class="diffMode === 'chars' ? 'bg-primary-500 text-white' : 'text-[var(--ui-text-muted)] hover:text-[var(--ui-text)]'"
          @click="diffMode = 'chars'"
        >
          按字符
        </button>
      </div>

      <UButton
        variant="outline"
        size="sm"
        icon="lucide:arrow-left-right"
        @click="swap"
      >
        交换
      </UButton>

      <div class="flex-1" />

      <UButton
        variant="ghost"
        size="sm"
        icon="lucide:file-code"
        @click="loadExample"
      >
        示例
      </UButton>
      <UButton
        variant="ghost"
        size="sm"
        icon="lucide:trash-2"
        @click="clear"
      >
        清空
      </UButton>
    </div>

    <!-- 输入区域 -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <!-- 文本 A -->
      <div class="flex flex-col gap-2">
        <label class="text-sm font-medium text-[var(--ui-text)]">原始文本</label>
        <UTextarea
          v-model="textA"
          placeholder="输入原始文本..."
          class="font-mono text-sm"
          :rows="10"
        />
      </div>

      <!-- 文本 B -->
      <div class="flex flex-col gap-2">
        <label class="text-sm font-medium text-[var(--ui-text)]">对比文本</label>
        <UTextarea
          v-model="textB"
          placeholder="输入要对比的文本..."
          class="font-mono text-sm"
          :rows="10"
        />
      </div>
    </div>

    <!-- 统计信息 -->
    <div class="flex items-center gap-4 text-sm">
      <span class="text-[var(--ui-text-muted)]">差异统计：</span>
      <span class="flex items-center gap-1">
        <span class="w-3 h-3 rounded bg-green-500/20 border border-green-500" />
        <span class="text-green-500">+{{ stats.added }} 新增</span>
      </span>
      <span class="flex items-center gap-1">
        <span class="w-3 h-3 rounded bg-red-500/20 border border-red-500" />
        <span class="text-red-500">-{{ stats.removed }} 删除</span>
      </span>
      <span class="flex items-center gap-1">
        <span class="w-3 h-3 rounded bg-[var(--ui-bg-elevated)] border border-[var(--ui-border)]" />
        <span class="text-[var(--ui-text-muted)]">{{ stats.unchanged }} 未变</span>
      </span>
    </div>

    <!-- 对比结果 -->
    <div class="flex-1 min-h-0">
      <div class="text-sm font-medium text-[var(--ui-text)] mb-2">对比结果</div>
      <div
        v-if="diffResult.length > 0"
        class="h-full overflow-auto p-4 rounded-lg border border-[var(--ui-border)] bg-[var(--ui-bg)] font-mono text-sm whitespace-pre-wrap"
      >
        <template v-for="(part, index) in diffResult" :key="index">
          <span
            :class="{
              'bg-green-500/20 text-green-600 dark:text-green-400': part.added,
              'bg-red-500/20 text-red-600 dark:text-red-400 line-through': part.removed,
              'text-[var(--ui-text)]': !part.added && !part.removed
            }"
          >{{ part.value }}</span>
        </template>
      </div>
      <div
        v-else
        class="h-full flex items-center justify-center text-[var(--ui-text-muted)]"
      >
        输入两段文本后将自动显示对比结果
      </div>
    </div>
  </div>
</template>
