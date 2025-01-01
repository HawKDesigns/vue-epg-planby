<script lang="ts" setup>
import { isToday, startOfDay, addDays } from 'date-fns'
import type { Ref } from 'vue'
import type { DateTime } from '../helpers/types'

import { HOUR_IN_MINUTES, PROGRAM_REFRESH, getPositionX } from '../helpers'
import { useEpgStore } from '../store'

const props = defineProps<{
  height: number
  startDate: DateTime
  endDate: DateTime
  dayWidth: number
  hourWidth: number
  sidebarWidth: number
  numberOfDays: number // New prop for multiple days
}>()

interface useLineProps {
  startDate: Ref<DateTime>
  endDate: Ref<DateTime>
  dayWidth: Ref<number>
  hourWidth: Ref<number>
  sidebarWidth: Ref<number>
  numberOfDays: Ref<number> // New prop for multiple days
}

function useLine({
  startDate,
  endDate,
  dayWidth,
  hourWidth,
  sidebarWidth,
  numberOfDays // New parameter for multiple days
}: useLineProps) {
  const initialState
    = getPositionX(
      startOfDay(new Date(startDate.value)),
      new Date(),
      startDate.value,
      addDays(endDate.value, numberOfDays.value), // Adjust endDate for multiple days
      hourWidth.value,
    ) + sidebarWidth.value

  const positionX = ref<number>(initialState)

  const isDayEnd = computed(() => positionX.value <= dayWidth.value * numberOfDays.value) // Adjust dayWidth for multiple days

  const isScrollX = computed(() => (isDayEnd.value ? PROGRAM_REFRESH : undefined))

  useIntervalFn(() => {
    const offset = hourWidth.value / HOUR_IN_MINUTES
    const positionOffset = offset * 2
    positionX.value += positionOffset
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
  }, isScrollX)

  watchEffect(() => {
    const newPositionX = getPositionX(
      startOfDay(new Date(startDate.value)),
      new Date(),
      startDate.value,
      addDays(endDate.value, numberOfDays.value), // Adjust endDate for multiple days
      hourWidth.value,
    ) + sidebarWidth.value
    positionX.value = newPositionX
  })

  return { positionX }
}

const { startDate, endDate, dayWidth, hourWidth, sidebarWidth, numberOfDays } = toRefs(props)

const { positionX } = useLine({
  startDate, endDate, dayWidth, hourWidth, sidebarWidth, numberOfDays
})

const date = new Date(props.startDate)
const { theme } = useEpgStore()
</script>

<template>
  <div
    v-if="isToday(date)"
    class="absolute top-64px w-3px pointer-events-none z-100"
    :style="{
      height: `${height}px`,
      left: `${positionX}px`,
      background: `${theme.green['300']}`,
    }"
  />
</template>
