<script setup lang="ts">
import type { Tool } from '~/types/tool'
import { ToolCategoryInfo } from '~/types/tool'

interface Props {
  tool: Tool
}

defineProps<Props>()

const { t } = useI18n()
</script>

<template>
  <NuxtLink
    :to="`/tools/${tool.id}`"
    class="group flex flex-col rounded-xl border border-gray-200 bg-white p-5 transition-all hover:border-primary-300 hover:shadow-lg hover:shadow-primary-100/50 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-primary-700 dark:hover:shadow-primary-900/20"
  >
    <!-- Icon & Category -->
    <div class="mb-4 flex items-start justify-between">
      <div class="flex size-12 items-center justify-center rounded-xl bg-primary-50 text-primary-600 transition-colors group-hover:bg-primary-100 dark:bg-primary-950 dark:text-primary-400 dark:group-hover:bg-primary-900">
        <UIcon
          :name="tool.icon"
          class="size-6"
        />
      </div>
      <UBadge
        :label="ToolCategoryInfo[tool.category].label"
        color="neutral"
        variant="subtle"
        size="sm"
      />
    </div>

    <!-- Title -->
    <h3 class="mb-2 text-lg font-semibold text-gray-900 transition-colors group-hover:text-primary-600 dark:text-white dark:group-hover:text-primary-400">
      {{ tool.name }}
    </h3>

    <!-- Description -->
    <p class="line-clamp-2 text-sm text-gray-500 dark:text-gray-400">
      {{ tool.description }}
    </p>

    <!-- Arrow -->
    <div class="mt-4 flex items-center text-sm font-medium text-primary-600 dark:text-primary-400">
      <span>{{ t('home.useTool') }}</span>
      <UIcon
        name="i-lucide-arrow-right"
        class="ml-1 size-4 transition-transform group-hover:translate-x-1"
      />
    </div>
  </NuxtLink>
</template>
