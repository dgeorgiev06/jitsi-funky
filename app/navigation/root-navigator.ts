import { createStackNavigator } from 'react-navigation'
import { ConferenceNavigator } from './conference-navigator'

export const RootNavigator = createStackNavigator(
  {
    conferenceStack: { screen: ConferenceNavigator }
  },
  {
    headerMode: 'none',
    navigationOptions: { gesturesEnabled: false }
  }
)
