import * as env from '../../environment-variables'

/**
 * The options used to configure the API.
 */
export interface JitsiApiConfig {
  /**
   * The URL of the api.
   */
  url: string;

  /**
   * Milliseconds before we timeout the request.
   */
  timeout: number;
}

/**
 * The default configuration for the app.
 */
export const DEFAULT_JITSI_API_CONFIG: JitsiApiConfig = {
  //url: env.API || 'https://meet.jit.si',
  //url: env.API || 'https://192.168.1.5:7443/ofmeet',
  url: env.API || 'http://192.168.1.5:7070/ofmeet',
  timeout: 10000
}
