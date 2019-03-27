import * as React from 'react'
import { ViewStyle, Text, Modal, View, TouchableOpacity, SafeAreaView } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { Screen } from '../../components/screen'
import { color } from '../../theme'
import { GiftedChat } from 'react-native-gifted-chat'
import { ChatMessage } from './ChatMessage'
import { values } from 'mobx'
import { ConnectionStore } from '../../models/connection-store'
import { observer, inject } from 'mobx-react'

export interface ChatScreenProps {
  onSendMessage: (string) => void;
  onToggleChat: () => void;
  isOpen: boolean;
  connectionStore?: ConnectionStore;
}

const ROOT: ViewStyle = {
  backgroundColor: color.palette.black
}

const BUTTON_VIEW: ViewStyle = {
  position: 'absolute',
  top: 25,
  left: 10
}

const SAFE_AREA_VIEW: ViewStyle = {
  flex: 1,
  alignContent: 'center',
  backgroundColor: 'rgba(127, 127, 127, 0.8)'
}

@inject('connectionStore')
@observer
export class ChatScreen extends React.Component<ChatScreenProps, {}> {
  
  onSend = ([message]) => {
    this.props.onSendMessage(message.text)
  }

  renderMessage = (message) => {
    const { currentMessage } = message

    return (
      <ChatMessage message = { currentMessage } />
    )
  }

  transformMessage = (message: any, index: number) => {
    return ({
      _id: index,
      createdAt: message._timestamp,
      isLocal: message._isLocal,
      text: message._message,
      user: {
        _id: message._id,
        name: message._displayName
      }
    })
  }

  render () {
    const messageModels = this.props.connectionStore.conference.messages
    const messages = values(messageModels).map(this.transformMessage).reverse()

    return (
      <Screen style={ ROOT } preset="fixedCenter">
        <Modal onRequestClose = { this.props.onToggleChat } transparent={ true } visible = { this.props.isOpen }>
          <View style={{ flex: 1 }}>
            <SafeAreaView style = { SAFE_AREA_VIEW } >
              <GiftedChat messages = { messages } onSend = { this.onSend } renderMessage = { this.renderMessage } />
            </SafeAreaView>
            <View style={ BUTTON_VIEW }>
              <TouchableOpacity onPress = { this.props.onToggleChat } >
                <Text>Close</Text>
                <Icon name = "close" size={ 30 } color="black"/>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </Screen>
    )
  }
}
