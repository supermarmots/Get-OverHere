import {
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getDoc,
  onSnapshot,
  serverTimestamp,
  updateDoc,
  writeBatch,
} from 'firebase/firestore'
import { db, firebaseConfigReady } from '../../../shared/lib/firebase'
import { MEETING_STATUS } from '../lib/meetingStatus'

function assertFirestoreReady() {
  if (!firebaseConfigReady || !db) {
    throw Object.assign(new Error('Firebase config is missing.'), {
      code: 'app/missing-config',
    })
  }
}

export async function createMeeting({ form, host }) {
  assertFirestoreReady()

  if (!host?.uid) {
    throw Object.assign(new Error('Host user is missing.'), {
      code: 'app/missing-user',
    })
  }

  const now = serverTimestamp()
  const batch = writeBatch(db)
  const meetingRef = doc(collection(db, 'meetings'))

  batch.set(meetingRef, {
    description: form.description.trim(),
    hostId: host.uid,
    participantIds: [host.uid],
    recommendation: null,
    status: MEETING_STATUS.collecting,
    targetMonth: form.targetMonth,
    title: form.title.trim(),
    createdAt: now,
    updatedAt: now,
  })

  batch.set(doc(db, 'meetings', meetingRef.id, 'participants', host.uid), {
    availability: form.availability.map(({ date, endTime, id, startTime }) => ({
      date,
      endTime,
      id,
      startTime,
    })),
    displayName: host.displayName || host.email,
    role: 'host',
    uid: host.uid,
    createdAt: now,
    updatedAt: now,
  })

  await batch.commit()

  return meetingRef.id
}

export async function getMeeting({ meetingId, userId }) {
  assertFirestoreReady()

  const meetingRef = doc(db, 'meetings', meetingId)
  const participantRef = doc(db, 'meetings', meetingId, 'participants', userId)
  const [meetingSnapshot, participantSnapshot] = await Promise.all([
    getDoc(meetingRef),
    getDoc(participantRef),
  ])

  if (!meetingSnapshot.exists()) {
    throw Object.assign(new Error('Meeting not found.'), {
      code: 'app/not-found',
    })
  }

  if (meetingSnapshot.data().status === MEETING_STATUS.deleted) {
    throw Object.assign(new Error('Meeting has been deleted.'), {
      code: 'app/not-found',
    })
  }

  return {
    id: meetingSnapshot.id,
    ...meetingSnapshot.data(),
    participant: participantSnapshot.exists() ? participantSnapshot.data() : null,
  }
}

export async function getMeetingJoinData({ meetingId, userId }) {
  assertFirestoreReady()

  const meetingRef = doc(db, 'meetings', meetingId)
  const meetingSnapshot = await getDoc(meetingRef)

  if (!meetingSnapshot.exists() || meetingSnapshot.data().status === MEETING_STATUS.deleted) {
    throw Object.assign(new Error('Meeting not found.'), {
      code: 'app/not-found',
    })
  }

  const meeting = {
    id: meetingSnapshot.id,
    ...meetingSnapshot.data(),
  }
  const [hostSnapshot, participantSnapshot] = await Promise.all([
    getDoc(doc(db, 'meetings', meetingId, 'participants', meeting.hostId)),
    getDoc(doc(db, 'meetings', meetingId, 'participants', userId)),
  ])

  return {
    meeting,
    hostAvailability: hostSnapshot.exists() ? hostSnapshot.data().availability ?? [] : [],
    participant: participantSnapshot.exists() ? participantSnapshot.data() : null,
  }
}

export async function updateMeeting({ form, meetingId, user }) {
  assertFirestoreReady()

  if (!user?.uid) {
    throw Object.assign(new Error('User is missing.'), {
      code: 'app/missing-user',
    })
  }

  const now = serverTimestamp()
  const batch = writeBatch(db)

  batch.update(doc(db, 'meetings', meetingId), {
    description: form.description.trim(),
    targetMonth: form.targetMonth,
    title: form.title.trim(),
    updatedAt: now,
  })

  batch.update(doc(db, 'meetings', meetingId, 'participants', user.uid), {
    availability: form.availability.map(({ date, endTime, id, startTime }) => ({
      date,
      endTime,
      id,
      startTime,
    })),
    updatedAt: now,
  })

  await batch.commit()
}

export async function updateMeetingStatus({ meetingId, status }) {
  assertFirestoreReady()

  await updateDoc(doc(db, 'meetings', meetingId), {
    status,
    updatedAt: serverTimestamp(),
  })
}

export async function submitMeetingParticipation({ availability, displayName, meetingId, user }) {
  assertFirestoreReady()

  if (!user?.uid) {
    throw Object.assign(new Error('User is missing.'), {
      code: 'app/missing-user',
    })
  }

  const participantRef = doc(db, 'meetings', meetingId, 'participants', user.uid)
  const participantSnapshot = await getDoc(participantRef)
  const now = serverTimestamp()
  const batch = writeBatch(db)

  batch.set(participantRef, {
    availability: availability.map(({ date, endTime, id, startTime }) => ({
      date,
      endTime,
      id,
      startTime,
    })),
    displayName: displayName.trim(),
    role: participantSnapshot.data()?.role || 'participant',
    uid: user.uid,
    updatedAt: now,
    ...(!participantSnapshot.exists() && { createdAt: now }),
  }, { merge: true })

  batch.update(doc(db, 'meetings', meetingId), {
    participantIds: arrayUnion(user.uid),
    updatedAt: now,
  })

  await batch.commit()
}

export async function cancelMeetingParticipation({ meetingId, user }) {
  assertFirestoreReady()

  if (!user?.uid) {
    throw Object.assign(new Error('User is missing.'), {
      code: 'app/missing-user',
    })
  }

  const participantRef = doc(db, 'meetings', meetingId, 'participants', user.uid)
  const participantSnapshot = await getDoc(participantRef)

  if (!participantSnapshot.exists()) {
    return
  }

  if (participantSnapshot.data().role === 'host') {
    throw Object.assign(new Error('Host participation cannot be canceled.'), {
      code: 'app/host-cannot-cancel',
    })
  }

  const batch = writeBatch(db)

  batch.delete(participantRef)
  batch.update(doc(db, 'meetings', meetingId), {
    participantIds: arrayRemove(user.uid),
    updatedAt: serverTimestamp(),
  })

  await batch.commit()
}

export function subscribeMeetingParticipants(meetingId, onNext, onError) {
  assertFirestoreReady()

  return onSnapshot(
    collection(db, 'meetings', meetingId, 'participants'),
    (snapshot) => {
      const participants = snapshot.docs.map((participantSnapshot) => ({
        id: participantSnapshot.id,
        ...participantSnapshot.data(),
      }))

      onNext(participants)
    },
    onError,
  )
}

export async function deleteMeeting({ meetingId }) {
  assertFirestoreReady()

  await updateDoc(doc(db, 'meetings', meetingId), {
    deletedAt: serverTimestamp(),
    status: MEETING_STATUS.deleted,
    updatedAt: serverTimestamp(),
  })
}
