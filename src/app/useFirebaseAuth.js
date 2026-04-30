import { useEffect } from 'react'
import { mapAuthUser } from '../features/auth/lib/mapAuthUser'
import { observeAuthState } from '../features/auth/services/authService'
import { useAuthStore } from '../stores/authStore'

export function useFirebaseAuth() {
  useEffect(() => {
    let unsubscribe = () => {}
    let isMounted = true

    async function subscribe() {
      try {
        unsubscribe = observeAuthState((user) => {
          if (!isMounted) {
            return
          }

          if (user) {
            useAuthStore.getState().setAuthUser(mapAuthUser(user))
          } else {
            useAuthStore.getState().clearAuthUser()
          }
        })
      } catch (error) {
        if (isMounted) {
          useAuthStore.getState().setAuthError(error.message)
        }
      }
    }

    subscribe()

    return () => {
      isMounted = false
      unsubscribe()
    }
  }, [])
}
