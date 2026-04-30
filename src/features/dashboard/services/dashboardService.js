import { collection, onSnapshot, query, where } from 'firebase/firestore'
import { db, firebaseConfigReady } from '../../../shared/lib/firebase'
import { MEETING_STATUS } from '../../meetings/lib/meetingStatus'

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

export function subscribeUserMeetings(userId, onChange, onError) {
  assertDashboardReady(userId)

  return onSnapshot(
    query(
      collection(db, 'meetings'),
      where('participantIds', 'array-contains', userId),
    ),
    (snapshot) => {
      onChange(sortMeetings(
        snapshot.docs
          .map((meetingDoc) => ({ id: meetingDoc.id, ...meetingDoc.data() }))
          .filter((meeting) => meeting.status !== MEETING_STATUS.deleted),
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
