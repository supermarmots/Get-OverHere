import { collection, doc, getDoc, onSnapshot, query, where } from 'firebase/firestore'
import { db, firebaseConfigReady } from '../../../shared/lib/firebase'

function assertDashboardReady(userId) {
  if (!firebaseConfigReady || !db) {
    throw Object.assign(new Error('Firebase config is missing.'), {
      code: 'app/missing-config',
    })
  }

  if (!userId) {
    throw Object.assign(new Error('User is missing.'), {
      code: 'app/missing-user',
    })
  }
}

export function subscribeHostedMeetings(userId, onChange, onError) {
  assertDashboardReady(userId)

  const hostedMeetingsQuery = query(
    collection(db, 'meetings'),
    where('hostId', '==', userId),
  )

  return onSnapshot(
    hostedMeetingsQuery,
    (snapshot) => {
      onChange(sortMeetings(
        snapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter((meeting) => meeting.status !== 'deleted'),
      ))
    },
    onError,
  )
}

export function subscribeParticipatingMeetings(userId, onChange, onError) {
  assertDashboardReady(userId)

  return onSnapshot(
    collection(db, 'meetings'),
    async (snapshot) => {
      try {
        const visibleMeetings = snapshot.docs
          .map((meetingDoc) => ({ id: meetingDoc.id, ...meetingDoc.data() }))
          .filter((meeting) => {
            return meeting.status !== 'deleted'
              && meeting.hostId !== userId
          })

        const meetings = await Promise.all(visibleMeetings.map(async (meeting) => {
          const participantSnapshot = await getDoc(doc(db, 'meetings', meeting.id, 'participants', userId))

          if (!participantSnapshot.exists()) {
            return null
          }

          return {
            ...meeting,
            participant: participantSnapshot.data(),
          }
        }))

        onChange(sortMeetings(meetings.filter(Boolean)))
      } catch (error) {
        onError(error)
      }
    },
    onError,
  )
}

function sortMeetings(meetings) {
  return [...meetings].sort((first, second) => {
    const firstTime = first.createdAt?.toMillis?.() ?? 0
    const secondTime = second.createdAt?.toMillis?.() ?? 0

    return secondTime - firstTime
  })
}
