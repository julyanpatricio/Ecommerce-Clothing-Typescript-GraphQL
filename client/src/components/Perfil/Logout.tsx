import {useAuth0} from '@auth0/auth0-react'

export default function Logout() {
  const {logout} = useAuth0()

  return (
    <button className = 'button_logout_profile' onClick={() => logout({returnTo: window.location.origin})}>
      Logout
    </button>
  )
}