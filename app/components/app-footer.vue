<script setup lang="ts">
const currentYear = new Date().getFullYear()

const links = [
  { label: '首页', to: '/' },
  { label: '工具', to: '/tools' },
  { label: 'GitHub', to: 'https://github.com', external: true }
]
</script>

<template>
  <footer class="border-t border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900">
    <div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div class="flex flex-col items-center justify-between gap-4 md:flex-row">
        <!-- Logo & Copyright -->
        <div class="flex items-center gap-4">
          <NuxtLink
            to="/"
            class="flex items-center gap-2"
          >
            <UIcon
              name="i-lucide-code-2"
              class="size-6 text-primary-500"
            />
            <span class="font-semibold text-gray-900 dark:text-white">DevUtils</span>
          </NuxtLink>
          <span class="text-sm text-gray-500 dark:text-gray-400">
            © {{ currentYear }} DevUtils. All rights reserved.
          </span>
        </div>

        <!-- Links -->
        <nav class="flex items-center gap-4">
          <template
            v-for="link in links"
            :key="link.to"
          >
            <NuxtLink
              v-if="!link.external"
              :to="link.to"
              class="text-sm text-gray-500 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            >
              {{ link.label }}
            </NuxtLink>
            <a
              v-else
              :href="link.to"
              target="_blank"
              rel="noopener noreferrer"
              class="text-sm text-gray-500 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            >
              {{ link.label }}
            </a>
          </template>
        </nav>
      </div>
    </div>
  </footer>
</template>
