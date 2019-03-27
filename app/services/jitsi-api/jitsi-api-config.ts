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
  url: env.API || 'https://meet.jit.si',
  timeout: 10000
}
