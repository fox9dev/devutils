<script setup lang="ts">
const { t, locale, setLocale } = useI18n()

const colorMode = useColorMode()
const isDark = computed({
  get: () => colorMode.value === 'dark',
  set: (value) => { colorMode.preference = value ? 'dark' : 'light' }
})

const navItems = computed(() => [
  { label: t('nav.home'), to: '/', icon: 'i-lucide-home' },
  { label: t('nav.tools'), to: '/tools', icon: 'i-lucide-wrench' }
])

function toggleLocale() {
  const newLocale = locale.value === 'zh-CN' ? 'en' : 'zh-CN'
  setLocale(newLocale)
}
</script>

<template>
  <header class="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-sm dark:border-gray-800 dark:bg-gray-900/80">
    <div class="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
      <!-- Logo -->
      <NuxtLink
        to="/"
        class="flex items-center gap-2"
      >
        <UIcon
          name="i-lucide-code-2"
          class="size-8 text-primary-500"
        />
        <span class="text-xl font-bold text-gray-900 dark:text-white">DevUtils</span>
      </NuxtLink>

      <!-- Navigation -->
      <nav class="hidden items-center gap-1 md:flex">
        <NuxtLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
          active-class="!bg-primary-50 !text-primary-600 dark:!bg-primary-950 dark:!text-primary-400"
        >
          <UIcon
            :name="item.icon"
            class="size-4"
          />
          {{ item.label }}
        </NuxtLink>
      </nav>

      <!-- Actions -->
      <div class="flex items-center gap-2">
        <!-- Language Toggle -->
        <UButton
          :icon="locale === 'zh-CN' ? 'i-lucide-languages' : 'i-lucide-languages'"
          color="neutral"
          variant="ghost"
          size="lg"
          :aria-label="locale === 'zh-CN' ? 'English' : '中文'"
          @click="toggleLocale"
        >
          <span class="text-xs">{{ locale === 'zh-CN' ? 'EN' : '中' }}</span>
        </UButton>

        <!-- Theme Toggle -->
        <UButton
          :icon="isDark ? 'i-lucide-sun' : 'i-lucide-moon'"
          color="neutral"
          variant="ghost"
          size="lg"
          :aria-label="t('header.toggleTheme')"
          @click="isDark = !isDark"
        />

        <!-- GitHub -->
        <UButton
          icon="i-simple-icons-github"
          color="neutral"
          variant="ghost"
          size="lg"
          to="https://github.com"
          target="_blank"
          aria-label="GitHub"
        />

        <!-- Mobile Menu -->
        <UButton
          icon="i-lucide-menu"
          color="neutral"
          variant="ghost"
          size="lg"
          class="md:hidden"
          :aria-label="t('header.menu')"
        />
      </div>
    </div>
  </header>
</template>
