import { collection, getDocs, query, where } from 'firebase/firestore'
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

export async function fetchUserMeetings(userId) {
  assertDashboardReady(userId)

  const snapshot = await getDocs(
    query(collection(db, 'meetings'), where('participantIds', 'array-contains', userId)),
  )

  return sortMeetings(
    snapshot.docs.map((meetingDoc) => ({ id: meetingDoc.id, ...meetingDoc.data() }))
  )
}

function sortMeetings(meetings) {
  return [...meetings].sort((first, second) => {
    const firstTime = first.createdAt?.toMillis?.() ?? 0
    const secondTime = second.createdAt?.toMillis?.() ?? 0

    return secondTime - firstTime
  })
}
