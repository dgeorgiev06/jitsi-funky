import { types, getRoot, flow, getEnv } from 'mobx-state-tree'
import { ParticipantStoreModel } from '../participant-store'
import { MessageModel } from '../message'
import { JitsiConferenceEvents } from '../../../jitsi-meet'
import CallKit from '../../../jitsi-meet/modules/CallKit'
import uuid from 'uuid'
import { omit } from 'ramda'
import { values } from 'mobx'

/**
 * Model description here for TypeScript hints.
 */

export const ConferenceStoreModel = types
  .model('ConferenceStore')
  .volatile((self) => ({
    conference: null,
    subscriptions: null,
    callIntegration: CallKit,
    localTracks: []
  }))
  .props({
    room: types.maybe(types.string),
    participantStore: types.optional(ParticipantStoreModel, {}),
    displayName: types.optional(types.string, 'me'),
    joining: types.optional(types.boolean, true),
    messages: types.optional(types.array(MessageModel), []),
    lastReadMessage: types.maybe(types.reference(MessageModel)),
    isChatOpen: types.optional(types.boolean, false)
  })
  .views(self => ({
    unreadMessageCount () {
      if (!self.lastReadMessage) {
        return 0
      }

      const messages = values(self.messages)
      const index = messages.indexOf(self.lastReadMessage)
      const length = messages.length

      return index === -1 ? 0 : length - index
    },
    hasUnreadMessages () {
      if (self.messages.length === 0) {
        return false
      }

      return self.lastReadMessage && self.lastReadMessage._id != self.messages[self.messages.length]._msgId
    }
  }))
  .actions(self => ({
    toggleChat (isChatOpen: boolean) {
      if (isChatOpen) {
        self.lastReadMessage = null
      }
      self.isChatOpen = isChatOpen
    },
    addTracks (tracks: any) {
      for (let i = 0; i < tracks.length; i++) {
        self.participantStore.addTrackForParticipant(tracks[i].participantId, tracks[i])
      }
    }
  }))
  .actions(self => ({
    onConferenceJoined () {
      const localParticipantId = self.conference.p2pDominantSpeakerDetection.myUserID

      const localTracks = self.localTracks

      if (localTracks) {
        for (let i = 0; i < localTracks.length; i++) {
          localTracks[i].participantId = localParticipantId
          self.conference.addTrack(localTracks[i].jitsiTrack)
        }
      }

      const localParticipant = { _id: localParticipantId, _displayName: self.displayName, _isLocal: true, _connectionStatus: 'active' }
      self.participantStore.addParticipant(localParticipant, localTracks)
      self.participantStore.setDominantParticipant(localParticipantId)
      self.conference.setDisplayName(self.displayName)

      const { callUUID } = self.conference
      if (callUUID) {
        self.callIntegration.reportConnectedOutgoingCallWithUUID(callUUID)
      }

      self.joining = false
    },
    onTrackRemoved (track) {
      console.log(`track removed!!!${track}`)
      self.participantStore.removeTrackForParticipant(track.getParticipantId(), track)
    },
    onUserJoined (id, user) {
      console.log('user joined', user)
      const participant = { _id: user._id, _displayName: user._displayName, _isLocal: false, _connectionStatus: user._connectionStatus }
      self.participantStore.addParticipant(participant, null)
    },
    onDominantSpeakerChanged (id, room) {
      console.log('dominant user changed: ', id)
      self.participantStore.setDominantParticipant(id)
    },
    onUserLeft (id, user) {
      self.participantStore.removeParticipant(id)
    },
    onConferenceFailed (error) {
      if (self.joining) {
        self.joining = false
      }
      console.log(`Conference Failed: ${error}`)
      if (!error.recoverable) {
        const { callUUID } = self.conference

        if (callUUID) {
          delete self.conference.callUUID
          self.callIntegration.endCall(callUUID)
        }
      }
    },
    onConferenceError (error) {
      console.log(`Conference Failed: ${error}`)
    },
    onUserStatusChanged (id, status) {
      console.log(`user status changed: ${id} ${status}`)
    },
    onTrackAdded (track) {
      if (!track.isLocal()) {
        const remoteTrack = {
          jitsiTrack: track,
          local: false,
          mediaType: track.getType(),
          mirror: track.getType() === 'video',
          muted: track.isMuted(),
          participantId: track.getParticipantId(),
          videoStarted: false,
          videoType: track.videoType
        }
        self.addTracks([remoteTrack])
      }
    },
    onMessageReceived (id, message, timestamp) {
      const participant = self.participantStore.getParticipant(id)

      if (!participant) {
        return
      }

      const date = timestamp
        ? new Date(timestamp) : new Date()

      const msgId = id + date.getTime()

      self.messages.push({
        _msgId: msgId,
        _id: id,
        _displayName: participant._displayName,
        _isLocal: participant._isLocal,
        _message: message,
        _timestamp: date
      })

      self.lastReadMessage = !self.isChatOpen && !participant._isLocal && self.lastReadMessage ? self.lastReadMessage._msgId : msgId
    }
  }))
  .actions(self => ({
    onPerformSetMutedCallAction () {

    },
    onPerformEndCallAction ({ callUUID }) {
      if (self.conference && self.conference.callUUID === callUUID) {
        delete self.conference.callUUID
      }
    },
    sendMessage (message: string) {
      self.conference.sendTextMessage(message)
    },
    createLocalTracks: flow(function * createLocalTracks () {
      const jitsiMeetJS = getEnv(self).jitsiMeetJS
      const tracks = yield jitsiMeetJS.createLocalTracks({ devices: [ 'audio', 'video' ] })

      for (let i = 0; i < tracks.length; i++) {
        let track = {
          jitsiTrack: tracks[i],
          local: true,
          mediaType: tracks[i].getType(),
          mirror: tracks[i].getType() === 'video',
          muted: tracks[i].isMuted(),
          participantId: '-999',
          videoStarted: false,
          videoType: tracks[i].videoType
        }

        self.localTracks.push(track)
      }
    })
  }))
  .actions(self => ({
    beforeDestroy () {
      self.localTracks = null
    },
    afterCreate () {
      const delegate = {
        _onPerformSetMutedCallAction: self.onPerformSetMutedCallAction,
        _onPerformEndCallAction: self.onPerformEndCallAction
      }
      self.callIntegration.registerSubscriptions(delegate)

      self.createLocalTracks().then(() => {
        console.log('local tracks created')
      }).catch((error) => {
        console.log(error)
      })
    }
  }))
  .actions(self => ({
    createConference (room: string) {
      self.joining = true
      const connection = getRoot(self).connectionStore.getConnection()
      self.room = room
      self.conference = connection.initJitsiConference(room, { openBridgeChannel: true })
      self.conference.on(JitsiConferenceEvents.TRACK_ADDED, self.onTrackAdded)
      self.conference.on(JitsiConferenceEvents.TRACK_REMOVED, self.onTrackRemoved)
      self.conference.on(JitsiConferenceEvents.CONFERENCE_JOINED, self.onConferenceJoined)
      self.conference.on(JitsiConferenceEvents.USER_JOINED, self.onUserJoined)
      self.conference.on(JitsiConferenceEvents.DOMINANT_SPEAKER_CHANGED, self.onDominantSpeakerChanged)
      self.conference.on(JitsiConferenceEvents.USER_LEFT, self.onUserLeft)
      self.conference.on(JitsiConferenceEvents.CONFERENCE_FAILED, self.onConferenceFailed)
      self.conference.on(JitsiConferenceEvents.CONFERENCE_ERROR, self.onConferenceError)
      self.conference.on(JitsiConferenceEvents.USER_STATUS_CHANGED, self.onUserStatusChanged)
      self.conference.on(JitsiConferenceEvents.MESSAGE_RECEIVED, self.onMessageReceived)

      self.conference.callUUID = (uuid.v4()).toUpperCase()

      const handle = self.room

      self.callIntegration.startCall(self.conference.callUUID, handle, 'string', true)

      self.conference.join()
    },
    cleanUp () {
      self.conference.off(JitsiConferenceEvents.CONFERENCE_ERROR, self.onConferenceError)
      self.conference.off(JitsiConferenceEvents.CONFERENCE_FAILED, self.onConferenceFailed)
      self.conference.off(JitsiConferenceEvents.USER_LEFT, self.onUserLeft)
      self.conference.off(JitsiConferenceEvents.DOMINANT_SPEAKER_CHANGED, self.onDominantSpeakerChanged)
      self.conference.off(JitsiConferenceEvents.CONFERENCE_JOINED, self.onConferenceJoined)
      self.conference.off(JitsiConferenceEvents.USER_JOINED, self.onUserJoined)
      self.conference.off(JitsiConferenceEvents.TRACK_ADDED, self.onTrackAdded)
      self.conference.off(JitsiConferenceEvents.TRACK_REMOVED, self.onTrackRemoved)
      self.conference.off(JitsiConferenceEvents.USER_STATUS_CHANGED, self.onUserStatusChanged)
      self.conference.off(JitsiConferenceEvents.MESSAGE_RECEIVED, self.onMessageReceived)

      self.lastReadMessage = null
      self.messages.clear()

      const { callUUID } = self.conference

      if (callUUID) {
        delete self.conference.callUUID
        self.callIntegration.endCall(callUUID)
      }

      self.participantStore.cleanUp()
      self.conference.leave()
      self.conference = null
    }
  }))
  .actions(self => ({
    postProcessSnapshot: omit(['room', 'displayName', 'participantStore'])
  }))

type ConferenceStoreType = typeof ConferenceStoreModel.Type
export interface ConferenceStore extends ConferenceStoreType {}
type ConferenceStoreSnapshotType = typeof ConferenceStoreModel.SnapshotType
export interface ConferenceStoreSnapshot extends ConferenceStoreSnapshotType {}
