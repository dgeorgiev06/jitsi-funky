import { ParticipantModel, Participant } from './participant'

test('can be created', () => {
  const instance: Participant = ParticipantModel.create({})

  expect(instance).toBeTruthy()
})
