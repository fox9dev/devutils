<script lang="ts" setup>
const { slideDirection } = useToolTabs()

const transition = computed(() => {
  if (!slideDirection.value) return false
  return { name: slideDirection.value, mode: 'out-in' as const }
})
</script>

<template>
  <UApp>
    <NuxtLayout>
      <NuxtPage
        keepalive
        :transition="transition"
      />
    </NuxtLayout>
  </UApp>
</template>
