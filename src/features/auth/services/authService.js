import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from 'firebase/auth'
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore'
import { auth, db, firebaseConfigReady } from '../../../shared/lib/firebase'

function getEmailNickname(email) {
  return email.split('@')[0] || '사용자'
}

async function saveUserProfile(user, profile) {
  const userRef = doc(db, 'users', user.uid)
  const snapshot = await getDoc(userRef)
  const now = serverTimestamp()

  await setDoc(
    userRef,
    {
      uid: user.uid,
      email: user.email ?? profile.email,
      name: profile.name,
      nickname: profile.nickname,
      provider: profile.provider,
      updatedAt: now,
      ...(!snapshot.exists() ? { createdAt: now } : {}),
    },
    { merge: true },
  )
}

function assertFirebaseReady() {
  if (!firebaseConfigReady || !auth || !db) {
    throw Object.assign(new Error('Firebase config is missing.'), {
      code: 'app/missing-config',
    })
  }
}

export async function signupWithEmail({ email, password, name, nickname }) {
  assertFirebaseReady()

  const credential = await createUserWithEmailAndPassword(auth, email, password)
  await updateProfile(credential.user, { displayName: name })
  await saveUserProfile(credential.user, {
    email,
    name,
    nickname,
    provider: 'password',
  })

  return credential.user
}

export async function loginWithEmail({ email, password }) {
  assertFirebaseReady()

  const credential = await signInWithEmailAndPassword(auth, email, password)
  return credential.user
}

export function observeAuthState(onChange) {
  assertFirebaseReady()

  return onAuthStateChanged(auth, onChange)
}

export async function logout() {
  assertFirebaseReady()

  await signOut(auth)
}

export async function continueWithGoogle() {
  assertFirebaseReady()

  const provider = new GoogleAuthProvider()
  const credential = await signInWithPopup(auth, provider)
  const user = credential.user
  const name = user.displayName || getEmailNickname(user.email ?? '')

  await saveUserProfile(user, {
    email: user.email ?? '',
    name,
    nickname: name || getEmailNickname(user.email ?? ''),
    provider: 'google.com',
  })

  return user
}
