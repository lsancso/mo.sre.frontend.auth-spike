import { LoginBoxProps } from './LoginBox.types'

import './styles/LoginBox.css'

const LoginBox = ({
  userId,
  validateAndSaveUser,
  session: { uuid, name },
}: LoginBoxProps) => (
  <div className="login-box">
    <button onClick={validateAndSaveUser} disabled={userId !== '1234abcd'}>
      Get User
    </button>
    {uuid ? (
      <div>
        <p>
          <span className="login-box__info">User UUID:</span> {uuid}
          <span className="login-box__info">User Name:</span> {name}
        </p>
      </div>
    ) : (
      <p className="login-box__info">Not user logged</p>
    )}
  </div>
)

export { LoginBox }
