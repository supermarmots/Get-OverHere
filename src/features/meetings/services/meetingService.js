import { collection, doc, serverTimestamp, writeBatch } from 'firebase/firestore'
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
