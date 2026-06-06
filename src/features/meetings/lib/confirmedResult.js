import { getAvailabilityTimeLabel, getDateWithWeekdayLabel } from './createMeetingForm'

export function createConfirmedResultFromRecommendation(recommendation) {
  return {
    date: recommendation.date,
    startTime: '',
    endTime: '',
  }
}

export function getConfirmedResultLabel(confirmedResult) {
  if (!confirmedResult?.date) {
    return ''
  }

  return `${getDateWithWeekdayLabel(confirmedResult.date)} ${getAvailabilityTimeLabel(confirmedResult)}`
}

