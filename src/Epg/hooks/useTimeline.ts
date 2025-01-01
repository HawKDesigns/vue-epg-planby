import { format } from 'date-fns'
import type { Ref } from 'vue'
import type { BaseTimeFormat } from '../helpers/types'
import { TIME_FORMAT, generateArray } from '../helpers'

export function useTimeline(
  numberOfHoursInDay: Ref<number>,
  isBaseTimeFormat: Ref<BaseTimeFormat>,
  numberOfDays: Ref<number> // New parameter for multiple days
) {
  const times = computed(() => generateArray(numberOfHoursInDay.value * numberOfDays.value)) // Adjust times for multiple days
  const dividers = generateArray(4)

  const formatTimelineTime = (index: number) => {
    const date = new Date()
    const baseDate = format(date, TIME_FORMAT.DATE)
    const time = index < 10 ? `0${index}` : index

    if (isBaseTimeFormat.value) {
      const date = new Date(`${baseDate}T${time}:00:00`)
      const timeFormat = format(date, TIME_FORMAT.BASE_HOURS_TIME)
      return timeFormat.toLowerCase().replace(/\s/g, '')
    }

    return `${time}:00`
  }

  return { times, dividers, formatTimelineTime }
}
