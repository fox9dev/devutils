<script setup lang="ts">
withDefaults(defineProps<{
  placeholder?: string
}>(), {
  placeholder: '搜索工具...'
})

const model = defineModel<string>({ default: '' })

function clear() {
  model.value = ''
}
</script>

<template>
  <div class="relative">
    <UInput
      v-model="model"
      :placeholder="placeholder"
      icon="i-lucide-search"
      size="lg"
      class="w-full"
      :ui="{
        base: 'pl-11'
      }"
    />
    <UButton
      v-if="model"
      icon="i-lucide-x"
      color="neutral"
      variant="ghost"
      size="xs"
      class="absolute right-2 top-1/2 -translate-y-1/2"
      aria-label="清除"
      @click="clear"
    />
  </div>
</template>
