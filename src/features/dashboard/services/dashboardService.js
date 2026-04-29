import { collection, collectionGroup, getDoc, onSnapshot, query, where } from 'firebase/firestore'
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

  const participantsQuery = query(
    collectionGroup(db, 'participants'),
    where('uid', '==', userId),
    where('role', '==', 'participant'),
  )

  return onSnapshot(
    participantsQuery,
    async (snapshot) => {
      try {
        const meetings = await Promise.all(snapshot.docs.map(async (participantDoc) => {
          const meetingRef = participantDoc.ref.parent.parent

          if (!meetingRef) {
            return null
          }

          const meetingSnapshot = await getDoc(meetingRef)

          if (!meetingSnapshot.exists()) {
            return null
          }

          return {
            id: meetingSnapshot.id,
            ...meetingSnapshot.data(),
            participant: participantDoc.data(),
          }
        }))

        onChange(sortMeetings(
          meetings.filter((meeting) => meeting && meeting.status !== 'deleted'),
        ))
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
