import { getStepPosition } from '../lib/createMeetingForm'

function StepLayout({
  children,
  error,
  isFirstStep,
  isLastStep,
  isSubmitting,
  onBack,
  onCancel,
  onCancelRequest,
  onNext,
  showCancelConfirm,
  step,
  stepIndex,
}) {
  return (
    <form className="step-flow" onSubmit={onNext} noValidate>
      <nav className="step-flow__top" aria-label="약속 만들기">
        <button type="button" className="text-button" onClick={onCancelRequest}>
          취소
        </button>
        <span className="step-flow__progress">{getStepPosition(stepIndex)}</span>
      </nav>

      <header className="step-flow__header">
        <h1>{step.title}</h1>
      </header>

      <section className="step-flow__body">{children}</section>

      {error && <p className="form-status form-status--error">{error}</p>}

      <footer className="step-flow__footer">
        {!isFirstStep && (
          <button type="button" className="landing__signup" onClick={onBack}>
            이전
          </button>
        )}
        <button type="submit" className="landing__login" disabled={isSubmitting}>
          {isLastStep ? '약속 만들기' : '다음'}
        </button>
      </footer>

      {showCancelConfirm && (
        <dialog className="confirm-dialog" open>
          <section aria-labelledby="cancel-title">
            <h2 id="cancel-title">약속 만들기를 그만둘까요?</h2>
            <p>지금 나가면 입력한 내용이 저장되지 않습니다.</p>
            <footer className="confirm-dialog__actions">
              <button type="button" className="landing__signup" onClick={onCancelRequest}>
                계속 작성
              </button>
              <button type="button" className="landing__login" onClick={onCancel}>
                나가기
              </button>
            </footer>
          </section>
        </dialog>
      )}
    </form>
  )
}

export default StepLayout
