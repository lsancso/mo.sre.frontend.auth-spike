import {
  createHttpClient,
  withErrorHandler,
} from '@mercadona/mo.library.web-services/http'
import { interceptAuth } from '@mercadona/mo.library.auth/dist/services/middlewares/interceptAuth'
import { pipe } from '../../utils/common.tsx'

const API_HOST = import.meta.env.VITE_APP_API_HOST
const APP_VERSION = import.meta.env.VITE_APP_VERSION

const settings = {
  getHeaders: function () {
    return {
      'Content-Type': 'application/json',
      'X-Version': APP_VERSION,
      'Access-Allow-Origin': '*',
    }
  },
  API_HOST,
}

const httpClient = createHttpClient(settings)
const httpWithMiddleWare = withErrorHandler(interceptAuth)
const Http = pipe(httpWithMiddleWare)(httpClient)

export { Http }
