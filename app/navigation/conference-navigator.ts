import { createStackNavigator } from 'react-navigation'
import { EntryScreen } from '../screens/Entry-screen/Entry-screen'
import { ConferenceScreen } from '../screens/Conference-screen'

export const ConferenceNavigator = createStackNavigator({
  entryScreen: { screen: EntryScreen },
  conferenceScreen: { screen: ConferenceScreen }
},
{
  headerMode: 'none'
})
