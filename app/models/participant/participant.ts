import { types } from 'mobx-state-tree'
import { omit } from 'ramda'

/**
 * Model description here for TypeScript hints.
 */
export const ParticipantModel = types
  .model('Participant')
  .props({
    _id: types.identifier(types.string),
    _displayName: types.maybe(types.string),
    _isLocal: types.optional(types.boolean, false),
    _connectionStatus: types.optional(types.string, 'undefined')
  })
  .volatile(self => ({
    tracks: {}
  }))
  .views(self => ({
    hasVideoTrack (): boolean {
      return self.tracks && self.tracks['video']
    }
  }))
  .actions(self => ({
    addTrack (track) {
      self.tracks[track.mediaType] = track
    },
    removeTrack (track) {
      if(self.tracks && self.tracks[track.mediaType]) {
        delete self.tracks[track.mediaType]
      }
    }
  }))
  .actions(self => ({
    cleanUp () {
      self.tracks = {}
    },
    addTracks (tracks) {
      for (let i = 0; i < tracks.length; i++) {
        self.addTrack(tracks[i])
      }
    }
  }))
  .actions(self => ({
    postProcessSnapshot: omit(['_connectionStatus'])
  }))

type ParticipantType = typeof ParticipantModel.Type
export interface Participant extends ParticipantType {}
type ParticipantSnapshotType = typeof ParticipantModel.SnapshotType
export interface ParticipantSnapshot extends ParticipantSnapshotType {}
