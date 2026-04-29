import { collection, onSnapshot, query, where } from 'firebase/firestore'
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

function sortMeetings(meetings) {
  return [...meetings].sort((first, second) => {
    const firstTime = first.createdAt?.toMillis?.() ?? 0
    const secondTime = second.createdAt?.toMillis?.() ?? 0

    return secondTime - firstTime
  })
}
