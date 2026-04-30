import { useNavigate, useParams } from 'react-router-dom'
import MeetingDetailPage from '../../features/meetings/pages/MeetingDetailPage'
import {
  ROUTES,
  getMeetingEditPath,
  getMeetingJoinPath,
} from '../paths'

function MeetingDetailRoute() {
  const navigate = useNavigate()
  const { meetingId } = useParams()

  return (
    <MeetingDetailPage
      meetingId={meetingId}
      onDashboard={() => navigate(ROUTES.dashboard)}
      onEdit={(meetingId) => navigate(getMeetingEditPath(meetingId))}
      onJoin={(meetingId) => navigate(getMeetingJoinPath(meetingId))}
    />
  )
}

export default MeetingDetailRoute
