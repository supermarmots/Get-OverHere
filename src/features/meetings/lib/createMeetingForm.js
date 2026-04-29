export const createMeetingSteps = [
  {
    id: 'title',
    title: '어떤 약속인가요?',
  },
  {
    id: 'description',
    title: '참여자에게 알려줄 내용이 있나요? (선택사항)',
  },
  {
    id: 'targetMonth',
    title: '어느 달 안에서 만날까요?',
  },
  {
    id: 'dates',
    title: '가능한 날짜를 골라주세요',
  },
  {
    id: 'times',
    title: '가능한 시간을 알려주세요',
  },
  {
    id: 'review',
    title: '입력한 내용을 확인해 주세요',
  },
]

export const initialMeetingForm = {
  title: '',
  description: '',
  targetMonth: '',
  availability: [],
}

export function createEmptyAvailability(date = '') {
  return {
    id: crypto.randomUUID(),
    date,
    startTime: '',
    endTime: '',
  }
}

export function getMonthDates(targetMonth) {
  if (!targetMonth) {
    return []
  }

  const [year, month] = targetMonth.split('-').map(Number)
  const lastDate = new Date(year, month, 0).getDate()

  return Array.from({ length: lastDate }, (_, index) => {
    const day = String(index + 1).padStart(2, '0')
    return `${targetMonth}-${day}`
  })
}

export function getMonthCalendar(targetMonth) {
  const dates = getMonthDates(targetMonth)

  if (dates.length === 0) {
    return []
  }

  const [year, month] = targetMonth.split('-').map(Number)
  const firstDay = new Date(year, month - 1, 1).getDay()
  const emptySlots = Array.from({ length: firstDay }, () => null)

  return [...emptySlots, ...dates]
}

export function getTargetMonthLabel(targetMonth) {
  if (!targetMonth) {
    return ''
  }

  const [year, month] = targetMonth.split('-')
  return `${year}년 ${Number(month)}월`
}

export function getDateWithWeekdayLabel(date) {
  const weekdayLabels = ['일', '월', '화', '수', '목', '금', '토']
  const [year, month, day] = date.split('-').map(Number)
  const weekday = weekdayLabels[new Date(year, month - 1, day).getDay()]

  return `${month}월 ${day}일 (${weekday})`
}

export function getStepPosition(stepIndex) {
  return `${stepIndex + 1} / ${createMeetingSteps.length}`
}

export function validateMeetingStep(stepId, form) {
  const errors = {}

  if (stepId === 'title' && !form.title.trim()) {
    errors.title = '약속 이름을 입력해 주세요.'
  }

  if (stepId === 'targetMonth' && !form.targetMonth) {
    errors.targetMonth = '조율할 월을 선택해 주세요.'
  }

  if (stepId === 'dates' && form.availability.length === 0) {
    errors.availability = '가능한 날짜를 1개 이상 추가해 주세요.'
  }

  if (stepId === 'times' || stepId === 'review') {
    const slotError = validateAvailability(form)

    if (slotError) {
      errors.availability = slotError
    }
  }

  return errors
}

export function validateMeetingForm(form) {
  return createMeetingSteps.reduce((errors, step) => {
    return {
      ...errors,
      ...validateMeetingStep(step.id, form),
    }
  }, {})
}

function validateAvailability(form) {
  if (form.availability.length === 0) {
    return '가능한 날짜를 1개 이상 추가해 주세요.'
  }

  const hasInvalidSlot = form.availability.some((slot) => {
    if (!slot.date) {
      return true
    }

    if (form.targetMonth && !slot.date.startsWith(form.targetMonth)) {
      return true
    }

    if (!slot.startTime && !slot.endTime) {
      return false
    }

    if (!slot.startTime || !slot.endTime) {
      return true
    }

    return slot.endTime <= slot.startTime
  })

  if (hasInvalidSlot) {
    return '각 일정의 날짜와 시간을 확인해 주세요. 시간은 비워두거나 시작/종료를 모두 입력해야 합니다.'
  }

  return ''
}
