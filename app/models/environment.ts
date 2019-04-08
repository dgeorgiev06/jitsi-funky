import { Reactotron } from '../services/reactotron'
import { Api } from '../services/api'
import { JitsiApi } from '../services/jitsi-api'
import { BorderBlockEndColorProperty } from 'csstype'

/**
 * The environment is a place where services and shared dependencies between
 * models live.  They are made available to every model via dependency injection.
 */
export class Environment {
  /**
   * Reactotron is only available in dev.
   */
  reactotron: Reactotron

  /**
   * Our api.
   */
  api: Api

  jitsiMeetJS: any

  options: any

  jitsiApi: JitsiApi

  handleUrl: string

  useOverrides: boolean

  ssl: boolean
}
