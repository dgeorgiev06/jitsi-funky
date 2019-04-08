import * as React from 'react'
import { ViewStyle, View, Text } from 'react-native'
import { Screen } from '../../components/screen'
import { color } from '../../theme'
import { Button } from '../../components/button'
import HangupIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import ChatIcon from 'react-native-vector-icons/Ionicons'
import IconBadge from 'react-native-icon-badge'
import { observer, inject } from 'mobx-react'
import { ConnectionStore } from '../../models/connection-store'

export interface ActionBarScreenProps {
  hide: boolean;
  onHangupButtonClicked: Function;
  onToggleChat: Function;
  connectionStore?: ConnectionStore;
}

const ROOT: ViewStyle = {
  backgroundColor: color.palette.black
}

const BUTTON_VIEW: ViewStyle = {
  position: 'absolute',
  flex: 1,
  bottom: 20,
  flexDirection: 'column',
  alignItems: 'center',
  alignContent: 'space-between'
}

const HANGUP_BUTTON: ViewStyle = {
  borderRadius: 30,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'red',
  width: 60,
  height: 60,
  margin: 5
}

const CHAT_BUTTON: ViewStyle = {
  borderRadius: 30,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'white',
  width: 60,
  height: 60,
  margin: 5
}

@inject('connectionStore')
@observer
export class ActionBarScreen extends React.Component<ActionBarScreenProps, {}> {
  onToggleChat = () => {
    this.props.onToggleChat()
  }

  onHangupButtonClicked = () => {
    if (this.props.onHangupButtonClicked) {
      this.props.onHangupButtonClicked()
    }
  }

  renderChatButton = () => {
    const count = this.props.connectionStore.conference.unreadMessageCount()

    return (
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
        <IconBadge
          MainElement={
            <Button style={CHAT_BUTTON} onPress={this.onToggleChat}>
              <ChatIcon name={'ios-chatboxes'} size={30}/>
            </Button>
          }
          BadgeElement={<Text style={{ color: '#FFFFFF' }}>{count}</Text>}
          IconBadgeStyle={{ width: 30, height: 30, backgroundColor: '#FF00EE' }}
          Hidden={count === 0}
        />
      </View>
    )
  }

  render () {
    if (this.props.hide) {
      return null
    }

    return (
      <Screen style={ROOT} preset="fixedCenter">
        <View style={BUTTON_VIEW}>
          { this.renderChatButton() }
          <Button style={HANGUP_BUTTON} onPress={this.onHangupButtonClicked}>
            <HangupIcon name={'phone-hangup'} size={30}/>
          </Button>
        </View>
      </Screen>
    )
  }
}
