import { types } from 'mobx-state-tree'

/**
 * Model description here for TypeScript hints.
 */
export const MessageModel = types
  .model('Message')
  .props({
    _msgId: types.identifier(types.string),
    _id: types.maybe(types.string),
    _displayName: types.maybe(types.string),
    _isLocal: types.optional(types.boolean, false),
    _message: types.optional(types.string, ''),
    _timestamp: types.maybe(types.Date)
  })

type MessageType = typeof MessageModel.Type
export interface Message extends MessageType {}
type MessageSnapshotType = typeof MessageModel.SnapshotType
export interface MessageSnapshot extends MessageSnapshotType {}
