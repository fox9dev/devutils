<script lang="ts" setup>
const { slideDirection, openTabs } = useToolTabs()

const transition = computed(() => {
  if (!slideDirection.value) return {}
  return { name: slideDirection.value, mode: 'out-in' as const }
})

const keepAliveInclude = computed(() => [...openTabs.value])
</script>

<template>
  <UApp>
    <NuxtLayout>
      <NuxtPage
        :keepalive="{ include: keepAliveInclude }"
        :transition="transition"
      />
    </NuxtLayout>
  </UApp>
</template>
