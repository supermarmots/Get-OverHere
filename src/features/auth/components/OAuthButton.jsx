function OAuthButton({ disabled, onClick }) {
  return (
    <button
      type="button"
      className="google-button"
      onClick={onClick}
      disabled={disabled}
    >
      Google로 계속하기
    </button>
  )
}

export default OAuthButton
