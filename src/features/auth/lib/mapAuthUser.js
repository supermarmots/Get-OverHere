export function mapAuthUser(user) {
  if (!user) {
    return null
  }

  return {
    displayName: user.displayName,
    email: user.email,
    uid: user.uid,
  }
}
