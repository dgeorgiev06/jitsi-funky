import { ParticipantStoreModel, ParticipantStore } from './participant-store'

test('can be created', () => {
  const instance: ParticipantStore = ParticipantStoreModel.create({})

  expect(instance).toBeTruthy()
})
