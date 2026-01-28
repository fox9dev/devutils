<script setup lang="ts">
const { t } = useI18n()
const { getFeaturedTools } = useTools()

const featuredTools = computed(() => getFeaturedTools())

const features = computed(() => [
  {
    icon: 'i-lucide-zap',
    title: t('features.fast.title'),
    description: t('features.fast.description')
  },
  {
    icon: 'i-lucide-shield-check',
    title: t('features.secure.title'),
    description: t('features.secure.description')
  },
  {
    icon: 'i-lucide-wifi-off',
    title: t('features.offline.title'),
    description: t('features.offline.description')
  },
  {
    icon: 'i-lucide-history',
    title: t('features.history.title'),
    description: t('features.history.description')
  },
  {
    icon: 'i-lucide-palette',
    title: t('features.darkMode.title'),
    description: t('features.darkMode.description')
  },
  {
    icon: 'i-lucide-smartphone',
    title: t('features.responsive.title'),
    description: t('features.responsive.description')
  }
])

const downloads = computed(() => [
  {
    platform: t('downloads.windows.platform'),
    icon: 'i-simple-icons-windows',
    url: '#',
    description: t('downloads.windows.description')
  },
  {
    platform: t('downloads.macos.platform'),
    icon: 'i-simple-icons-apple',
    url: '#',
    description: t('downloads.macos.description')
  },
  {
    platform: t('downloads.linux.platform'),
    icon: 'i-simple-icons-linux',
    url: '#',
    description: t('downloads.linux.description')
  }
])

useSeoMeta({
  title: t('seo.homeTitle'),
  description: t('seo.homeDescription'),
  ogTitle: t('seo.homeTitle'),
  ogDescription: t('seo.homeDescription')
})
</script>

<template>
  <div>
    <!-- Hero Section -->
    <section class="relative overflow-hidden bg-linear-to-b from-primary-50 to-white pb-20 pt-16 dark:from-gray-900 dark:to-gray-950">
      <!-- Background Pattern -->
      <div class="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] bg-size-[24px_24px]" />

      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <!-- Badge -->
          <UBadge
            color="primary"
            variant="subtle"
            size="lg"
            class="mb-6"
          >
            <UIcon
              name="i-lucide-sparkles"
              class="mr-1 size-4"
            />
            {{ t('home.badge') }}
          </UBadge>

          <!-- Title -->
          <h1 class="mb-6 text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl lg:text-6xl">
            {{ t('home.title') }}
            <span class="bg-linear-to-r from-primary-500 to-primary-700 bg-clip-text text-transparent">
              {{ t('home.titleHighlight') }}
            </span>
          </h1>

          <!-- Description -->
          <p class="mx-auto mb-10 max-w-2xl text-lg text-gray-600 dark:text-gray-400 sm:text-xl">
            {{ t('home.description') }}
          </p>

          <!-- CTA Buttons -->
          <div class="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <UButton
              to="/tools"
              size="xl"
              icon="i-lucide-arrow-right"
              trailing
            >
              {{ t('home.getStarted') }}
            </UButton>
            <UButton
              to="#download"
              size="xl"
              color="neutral"
              variant="outline"
              icon="i-lucide-download"
            >
              {{ t('home.download') }}
            </UButton>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-20">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="mb-12 text-center">
          <h2 class="mb-4 text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
            {{ t('home.whyChoose') }}
          </h2>
          <p class="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-400">
            {{ t('home.whyChooseDesc') }}
          </p>
        </div>

        <div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <div
            v-for="feature in features"
            :key="feature.title"
            class="rounded-2xl border border-gray-200 bg-white p-6 transition-shadow hover:shadow-lg dark:border-gray-800 dark:bg-gray-900"
          >
            <div class="mb-4 flex size-12 items-center justify-center rounded-xl bg-primary-100 text-primary-600 dark:bg-primary-950 dark:text-primary-400">
              <UIcon
                :name="feature.icon"
                class="size-6"
              />
            </div>
            <h3 class="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
              {{ feature.title }}
            </h3>
            <p class="text-gray-600 dark:text-gray-400">
              {{ feature.description }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Tools Preview Section -->
    <section class="bg-gray-50 py-20 dark:bg-gray-900">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="mb-12 text-center">
          <h2 class="mb-4 text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
            {{ t('home.featuredTools') }}
          </h2>
          <p class="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-400">
            {{ t('home.featuredToolsDesc') }}
          </p>
        </div>

        <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <ToolCard
            v-for="tool in featuredTools"
            :key="tool.id"
            :tool="tool"
          />
        </div>

        <div class="mt-10 text-center">
          <UButton
            to="/tools"
            size="lg"
            variant="outline"
            icon="i-lucide-grid-3x3"
          >
            {{ t('home.viewAllTools') }}
          </UButton>
        </div>
      </div>
    </section>

    <!-- Download Section -->
    <section
      id="download"
      class="py-20"
    >
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="mb-12 text-center">
          <h2 class="mb-4 text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
            {{ t('home.downloadDesktop') }}
          </h2>
          <p class="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-400">
            {{ t('home.downloadDesktopDesc') }}
          </p>
        </div>

        <div class="grid gap-6 md:grid-cols-3">
          <a
            v-for="download in downloads"
            :key="download.platform"
            :href="download.url"
            class="flex flex-col items-center rounded-2xl border border-gray-200 bg-white p-8 transition-all hover:border-primary-300 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900 dark:hover:border-primary-700"
          >
            <UIcon
              :name="download.icon"
              class="mb-4 size-16 text-gray-700 dark:text-gray-300"
            />
            <h3 class="mb-1 text-xl font-semibold text-gray-900 dark:text-white">
              {{ download.platform }}
            </h3>
            <p class="mb-4 text-sm text-gray-500 dark:text-gray-400">
              {{ download.description }}
            </p>
            <UButton
              size="sm"
              variant="soft"
              icon="i-lucide-download"
            >
              {{ t('home.downloadBtn') }}
            </UButton>
          </a>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="bg-linear-to-r from-primary-600 to-primary-700 py-16">
      <div class="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <h2 class="mb-4 text-3xl font-bold text-white sm:text-4xl">
          {{ t('home.ctaTitle') }}
        </h2>
        <p class="mx-auto mb-8 max-w-2xl text-lg text-primary-100">
          {{ t('home.ctaDesc') }}
        </p>
        <UButton
          to="/tools"
          size="xl"
          color="neutral"
          icon="i-lucide-arrow-right"
          trailing
          class="bg-white text-primary-700 hover:bg-gray-100"
        >
          {{ t('home.ctaBtn') }}
        </UButton>
      </div>
    </section>
  </div>
</template>
