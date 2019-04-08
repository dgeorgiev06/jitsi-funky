import { types } from 'mobx-state-tree'
import { ParticipantModel } from '../participant'
import { values } from 'mobx'
import { omit } from 'ramda'

/**
 * Model description here for TypeScript hints.
 */
export const ParticipantStoreModel = types
  .model('ParticipantStore')
  .props({
    participants: types.optional(types.map(ParticipantModel), {}),
    dominantParticipant: types.maybe(types.reference(ParticipantModel))
  })
  .views(self => ({
    getParticipant (id: string) {
      return self.participants.get(id)
    },
    getParticipantsAsArray () {
      return values(self.participants)
    }
  }))
  .actions(self => ({
    addParticipant (participant: any, tracks: any) {
      self.participants.set(participant._id, participant)
      if (tracks) {
        self.participants.get(participant._id).addTracks(tracks)
      }
    },
    removeParticipant (id: string) {
      if (self.participants.has(id)) {
        const pv = values(self.participants)
        let pickDominantParticipant = false
        if (self.dominantParticipant._id === id) {
          pickDominantParticipant = true
        }

        self.participants.get(id).cleanUp()
        self.participants.delete(id)

        if (pickDominantParticipant) {
          const next = pv.filter(entry => entry._id !== id)
          self.dominantParticipant = next.length > 0 ? next[0] : null
        }
      }
    },
    setDominantParticipant (id: string) {
      if (self.participants.has(id)) {
        self.dominantParticipant = id
      } else {
        console.log(`user ${id} not found!!`)
      }
    },
    addTrackForParticipant (id: string, track: any) {
      const participant = self.participants.get(id)
      participant.addTrack(track)
    },
    removeTrackForParticipant (id: string, track: any) {
      const participant = self.participants.get(id)
      if (participant) {
        participant.removeTrack(track)
      }
    }
  }))
  .actions(self => ({
    cleanUp () {
      self.dominantParticipant = null
      const participantValues = values(self.participants)
      for (let i = 0; i < participantValues.length; i++) {
        participantValues[i].cleanUp()
      }
      self.participants.clear()
    }
  }))
  .actions(self => ({
    postProcessSnapshot: omit(['dominantParticipant'])
  }))

type ParticipantStoreType = typeof ParticipantStoreModel.Type
export interface ParticipantStore extends ParticipantStoreType {}
type ParticipantStoreSnapshotType = typeof ParticipantStoreModel.SnapshotType
export interface ParticipantStoreSnapshot extends ParticipantStoreSnapshotType {}
