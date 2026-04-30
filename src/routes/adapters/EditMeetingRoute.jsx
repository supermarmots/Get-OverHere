import { useNavigate, useParams } from 'react-router-dom'
import EditMeetingPage from '../../features/meetings/pages/EditMeetingPage'
import { getMeetingDetailPath } from '../paths'

function EditMeetingRoute() {
  const navigate = useNavigate()
  const { meetingId } = useParams()

  return (
    <EditMeetingPage
      meetingId={meetingId}
      onCancel={() => navigate(getMeetingDetailPath(meetingId))}
      onSaved={(savedMeetingId) => navigate(getMeetingDetailPath(savedMeetingId))}
    />
  )
}

export default EditMeetingRoute
