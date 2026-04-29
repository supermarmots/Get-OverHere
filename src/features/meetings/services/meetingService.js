import { collection, doc, getDoc, serverTimestamp, updateDoc, writeBatch } from 'firebase/firestore'
import { db, firebaseConfigReady } from '../../../shared/lib/firebase'

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
    participantCount: 1,
    recommendation: null,
    status: 'collecting',
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

  if (meetingSnapshot.data().status === 'deleted') {
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

export async function deleteMeeting({ meetingId }) {
  assertFirestoreReady()

  await updateDoc(doc(db, 'meetings', meetingId), {
    deletedAt: serverTimestamp(),
    status: 'deleted',
    updatedAt: serverTimestamp(),
  })
}
