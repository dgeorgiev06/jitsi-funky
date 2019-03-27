import { ConferenceStoreModel, ConferenceStore } from './conference-store'

test('can be created', () => {
  const instance: ConferenceStore = ConferenceStoreModel.create({})

  expect(instance).toBeTruthy()
})
