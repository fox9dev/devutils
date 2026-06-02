<script setup lang="ts">
const slots = useSlots()
</script>

<template>
  <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
    <div
      :class="[
        'order-1 min-w-0',
        slots.actions ? 'md:row-start-2' : ''
      ]"
    >
      <slot name="input" />
    </div>

    <div
      v-if="slots.actions"
      class="order-2 min-w-0 md:order-0 md:col-span-2 md:row-start-1"
    >
      <slot name="actions" />
    </div>

    <div
      :class="[
        'order-3 min-w-0 md:col-start-2',
        slots.actions ? 'md:row-start-2' : ''
      ]"
    >
      <slot name="output" />
    </div>
  </div>
</template>
