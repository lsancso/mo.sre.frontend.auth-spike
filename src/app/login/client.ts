import { Http } from 'services/http'

function getUser(userId: number) {
  return Http.get(`/user/${userId}`)
}

const LoginClient = {
  getUser,
}

export { LoginClient }
