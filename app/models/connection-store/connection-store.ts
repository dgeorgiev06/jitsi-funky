import { types, flow, getEnv } from 'mobx-state-tree'
import { ConferenceStoreModel } from '../conference-store'
import { JitsiConnectionEvents } from '../../../jitsi-meet'
import { omit } from 'ramda'
import { configOverrides } from '../../../jitsi-meet/config'

/**
 * Model description here for TypeScript hints.
 */
export const ConnectionStoreModel = types
  .model('ConnectionStore')
  .props({
    conference: types.optional(ConferenceStoreModel, {}),
    connected: types.optional(types.boolean, false)
  })
  .volatile(self => ({
    connection: null,
    options: null
  }))
  .views(self => ({
    getConnection () {
      return self.connection
    },
    getConference () {
      return self.conference
    },
    isConnected () {
      return self.connected
    }
  }))
  .actions(self => ({
    onConnectionDisconnect () {
      console.log('disconnected')
      self.connected = false
    },
    onConnectionEstablished () {
      self.conference.createConference(self.conference.room)
      self.connected = true
    },
    onConnectionFailed () {
      console.log('failed')
      self.connected = false
    },
    setRoom (room: string) {
      self.conference.room = room
    },
    setDisplayName (name: string) {
      self.conference.displayName = name
    }
  }))
  .actions(self => ({
    connect: flow(function * createConnection () {
      let config = self.options

      if (!config) {
        const response = yield getEnv(self).jitsiApi.getOptions(self.conference.room)
        config = response.options
        if (getEnv(self).useOverrides) {
          const overrides = configOverrides()

          if (overrides) {
            config = Object.assign(config, overrides)
          }
        }

        if (getEnv(self).ssl) {
          config.bosh = 'https:' + config.bosh + '?room=' + self.conference.room
        } else {
          config.bosh = 'http:' + config.bosh + '?room=' + self.conference.room
        }
      }

      self.options = config
      const jitsiMeetJS = getEnv(self).jitsiMeetJS
      self.connection = new jitsiMeetJS.JitsiConnection(null, null, self.options)
    })
  }))
  .actions(self => ({
    createConnection () {
      self.connect().then(function () {
        self.connection.addEventListener(JitsiConnectionEvents.CONNECTION_DISCONNECTED, self.onConnectionDisconnect)
        self.connection.addEventListener(JitsiConnectionEvents.CONNECTION_ESTABLISHED, self.onConnectionEstablished)
        self.connection.addEventListener(JitsiConnectionEvents.CONNECTION_FAILED, self.onConnectionFailed)
        self.connection.connect()
      })
    },
    disconnect () {
      if (self.connection && self.connected) {
        self.conference.cleanUp()
        self.connection.removeEventListener(JitsiConnectionEvents.CONNECTION_DISCONNECTED, self.onConnectionDisconnect)
        self.connection.removeEventListener(JitsiConnectionEvents.CONNECTION_ESTABLISHED, self.onConnectionEstablished)
        self.connection.removeEventListener(JitsiConnectionEvents.CONNECTION_FAILED, self.onConnectionFailed)
        self.connection.disconnect()
        self.connection = null
        self.connected = false
      }
    }
  }))
  .actions(self => ({
    postProcessSnapshot: omit(['connected'])
  }))

type ConnectionStoreType = typeof ConnectionStoreModel.Type
export interface ConnectionStore extends ConnectionStoreType {}
type ConnectionStoreSnapshotType = typeof ConnectionStoreModel.SnapshotType
export interface ConnectionStoreSnapshot extends ConnectionStoreSnapshotType {}
