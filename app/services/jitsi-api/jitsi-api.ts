import { ApisauceInstance, create, ApiResponse } from 'apisauce'
import { JitsiApiConfig, DEFAULT_JITSI_API_CONFIG } from './jitsi-api-config'
import { getGeneralApiProblem } from '../api/api-problem'

/**
 * Manages all requests to the API.
 */
export class JitsiApi {
  /**
   * The underlying apisauce instance which performs the requests.
   */
  apisauce: ApisauceInstance

  /**
   * Configurable options.
   */
  config: JitsiApiConfig

  /**
   * Creates the api.
   *
   * @param config The configuration to use.
   */
  constructor (config: JitsiApiConfig = DEFAULT_JITSI_API_CONFIG) {
    this.config = config
  }

  /**
   * Sets up the API.  This will be called during the bootup
   * sequence and will happen before the first React component
   * is mounted.
   *
   * Be as quick as possible in here.
   */
  setup () {
    // construct the apisauce instance
    this.apisauce = create({
      baseURL: this.config.url,
      timeout: this.config.timeout,
      headers: {
        Accept: 'application/json'
      }
    })
  }

  /**
   * Gets a list of users.
   */
  async getOptions (room: string): Promise<any> {
    // make the api call
    const response: ApiResponse<any> = await this.apisauce.get(`/config.js?room=` + room)

    // the typical ways to die when calling an api
    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    // transform the data into the format we are expecting
    try {
      eval.call(window, response.data)

      const { config } = window

      // We don't want to pollute the global scope.
      window.config = undefined

      if (typeof config !== 'object') {
        throw new Error('window.config is not an object')
      }

      config.bosh = 'https:' + config.bosh + '?room=' + room

      return { kind: 'ok', options: config }
    } catch {
      return { kind: 'bad-data' }
    }
  }
}
