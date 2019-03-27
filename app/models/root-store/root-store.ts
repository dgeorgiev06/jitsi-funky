import { types } from 'mobx-state-tree'
import { NavigationStoreModel } from '../../navigation/navigation-store'
import { ConnectionStoreModel } from '../../models/connection-store'

/**
 * An RootStore model.
 */
export const RootStoreModel = types.model('RootStore').props({
  navigationStore: types.optional(NavigationStoreModel, {}),
  connectionStore: types.optional(ConnectionStoreModel, {})
})

/**
 * The RootStore instance.
 */
export type RootStore = typeof RootStoreModel.Type

/**
 * The data of an RootStore.
 */
export type RootStoreSnapshot = typeof RootStoreModel.SnapshotType
