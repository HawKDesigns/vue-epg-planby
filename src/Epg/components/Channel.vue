<script lang="ts" setup>
import type { ChannelWithPosiiton } from '../helpers/types'
import { useEpgStore } from '../store'

defineProps<{
  channel: ChannelWithPosiiton
}>()
const emit = defineEmits<{
  (event: 'click', channel: ChannelWithPosiiton): void
}>()

const { theme, sidebarWidth } = useEpgStore()
</script>

<template>
  <div
    data-testid="sidebar-item"
    class="absolute flex items-center justify-center" :style="{
      top: `${channel.position.top}px`,
      height: `${channel.position.height}px`,
      width: `100%`,
      backgroundColor: `${theme.primary[900]}`,
    }"
    @click="emit('click', channel)"
  >
    <slot name="channel" v-bind="{ channel, theme }">
      <img :src="channel.logo" :style="{ maxHeight: '60px', maxWidth: `${sidebarWidth}px` }" class="relative">
    </slot>
  </div>
</template>
