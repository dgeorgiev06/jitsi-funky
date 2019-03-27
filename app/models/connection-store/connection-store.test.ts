import { ConnectionStoreModel, ConnectionStore } from './connection-store'

test('can be created', () => {
  const instance: ConnectionStore = ConnectionStoreModel.create({})

  expect(instance).toBeTruthy()
})
