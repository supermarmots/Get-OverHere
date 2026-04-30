import { useNavigate } from 'react-router-dom'
import CreateMeetingPage from '../../features/meetings/pages/CreateMeetingPage'
import { ROUTES, getMeetingInvitePath } from '../paths'

function CreateMeetingRoute() {
  const navigate = useNavigate()

  return (
    <CreateMeetingPage
      onCancel={() => navigate(ROUTES.dashboard)}
      onSuccess={(meeting) => {
        navigate(getMeetingInvitePath(meeting.id), { state: { meetingTitle: meeting.title } })
      }}
    />
  )
}

export default CreateMeetingRoute
