import { AUTH_COPY } from '../../../shared/lib/appCopy'

function OAuthButton({ disabled, onClick }) {
  return (
    <button
      type="button"
      className="google-button"
      onClick={onClick}
      disabled={disabled}
    >
      {AUTH_COPY.googleContinue}
    </button>
  )
}

export default OAuthButton
