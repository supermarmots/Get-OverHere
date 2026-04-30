import { useLocation, useNavigate, useParams } from 'react-router-dom'
import InviteSharePage from '../../features/meetings/pages/InviteSharePage'
import { ROUTES } from '../paths'

function InviteShareRoute() {
  const navigate = useNavigate()
  const location = useLocation()
  const { meetingId } = useParams()

  return (
    <InviteSharePage
      meetingId={meetingId}
      meetingTitle={location.state?.meetingTitle}
      onDashboard={() => navigate(ROUTES.dashboard)}
    />
  )
}

export default InviteShareRoute
