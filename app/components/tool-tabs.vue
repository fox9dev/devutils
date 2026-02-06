<script setup lang="ts">
/**
 * 工具标签页组件
 * 显示已打开的工具标签，支持切换和关闭；右键菜单使用 Nuxt UI ContextMenu：关闭当前/其他/左侧/右侧/全部
 */

const { openTabs, activeTab, switchTab, closeTool, closeOtherTabs, closeLeftTabs, closeRightTabs, closeAllTabs } = useToolTabs()
const { getTool } = useTools()

function getTabInfo(toolId: string) {
  return getTool(toolId)
}

function handleTabClick(toolId: string) {
  switchTab(toolId)
  navigateTo(`/workspace/${toolId}`)
}

function handleCloseTab(event: MouseEvent, toolId: string) {
  event.stopPropagation()
  closeTool(toolId)
  navigateAfterClose()
}

// 与 workspace 布局中标签栏 leave 过渡时长一致，避免先收标签栏再跳转导致抖动
const TAB_BAR_LEAVE_MS = 160

function navigateAfterClose() {
  if (openTabs.value.length > 0 && activeTab.value) {
    navigateTo(`/workspace/${activeTab.value}`)
  } else {
    // 等标签栏离开动画完成后再跳转，避免头部抖动与两段式突兀消失
    setTimeout(() => navigateTo('/workspace'), TAB_BAR_LEAVE_MS)
  }
}

function canCloseLeft(toolId: string) {
  const index = openTabs.value.indexOf(toolId)
  return index > 0
}

function canCloseRight(toolId: string) {
  const index = openTabs.value.indexOf(toolId)
  return index >= 0 && index < openTabs.value.length - 1
}

function getContextItems(toolId: string) {
  return [
    [
      {
        label: '关闭当前',
        icon: 'i-lucide-x',
        onSelect() {
          closeTool(toolId)
          navigateAfterClose()
        }
      },
      {
        label: '关闭其他',
        icon: 'i-lucide-panel-right-close',
        onSelect() {
          closeOtherTabs(toolId)
          navigateAfterClose()
        }
      },
      {
        label: '关闭左侧',
        icon: 'i-lucide-chevrons-left',
        disabled: !canCloseLeft(toolId),
        onSelect() {
          closeLeftTabs(toolId)
          navigateAfterClose()
        }
      },
      {
        label: '关闭右侧',
        icon: 'i-lucide-chevrons-right',
        disabled: !canCloseRight(toolId),
        onSelect() {
          closeRightTabs(toolId)
          navigateAfterClose()
        }
      }
    ],
    [
      {
        label: '关闭所有',
        icon: 'i-lucide-trash-2',
        color: 'error' as const,
        onSelect() {
          closeAllTabs()
          navigateAfterClose()
        }
      }
    ]
  ]
}
</script>

<template>
  <div class="flex items-center border-b border-default bg-default overflow-x-auto p-2">
    <TransitionGroup
      tag="div"
      class="flex items-center gap-1 w-full relative"
      move-class="transition-transform duration-150 ease-out"
      enter-active-class="transition-all duration-200 ease-out"
      enter-from-class="opacity-0 scale-90"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition-all duration-150 ease-in absolute"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-90"
    >
      <UContextMenu
        v-for="toolId in openTabs"
        :key="toolId"
        :items="getContextItems(toolId)"
        :ui="{ content: 'min-w-40' }"
        class="flex shrink-0"
      >
        <div
          role="button"
          tabindex="0"
          class="group flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors whitespace-nowrap cursor-pointer"
          :class="[
            activeTab === toolId
              ? 'bg-primary-500/10 text-primary-500'
              : 'bg-elevated/60 text-default hover:bg-elevated'
          ]"
          @click="handleTabClick(toolId)"
          @keydown.enter="handleTabClick(toolId)"
        >
          <UIcon
            v-if="getTabInfo(toolId)"
            :name="getTabInfo(toolId)!.icon"
            class="w-4 h-4 shrink-0"
          />
          <span>{{ getTabInfo(toolId)?.name || toolId }}</span>
          <span
            role="button"
            tabindex="0"
            class="flex items-center justify-center w-4 h-4 rounded opacity-0 group-hover:opacity-100 hover:bg-elevated transition-opacity"
            :class="activeTab === toolId ? 'hover:bg-primary-500/20' : ''"
            @click="handleCloseTab($event, toolId)"
            @keydown.enter.stop="handleCloseTab($event, toolId)"
          >
            <UIcon
              name="lucide:x"
              class="w-3 h-3"
            />
          </span>
        </div>
      </UContextMenu>
    </TransitionGroup>
  </div>
</template>
