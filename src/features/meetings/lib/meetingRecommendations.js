export const MAX_RECOMMENDATION_CANDIDATES = 3

export function getDateRecommendations(participants, maxCandidates = MAX_RECOMMENDATION_CANDIDATES) {
  const dateVotes = participants.reduce((votes, participant) => {
    const selectedDates = new Set((participant.availability ?? []).map((slot) => slot.date).filter(Boolean))

    selectedDates.forEach((date) => {
      votes.set(date, (votes.get(date) ?? 0) + 1)
    })

    return votes
  }, new Map())

  return Array.from(dateVotes, ([date, participantCount]) => ({ date, participantCount }))
    .sort(compareRecommendationCandidates)
    .slice(0, maxCandidates)
}

function compareRecommendationCandidates(firstCandidate, secondCandidate) {
  if (secondCandidate.participantCount !== firstCandidate.participantCount) {
    return secondCandidate.participantCount - firstCandidate.participantCount
  }

  return firstCandidate.date.localeCompare(secondCandidate.date)
}
