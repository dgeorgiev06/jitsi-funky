import React from 'react'
import { Text, View, ViewStyle } from 'react-native'
import { TextStyle } from 'react-native-gifted-chat'
import moment from 'moment'

const TIMESTAMP_FORMAT = 'H:mm'

export interface ChatMessageProps {
    message: any;
}

const MESSAGE: ViewStyle = {
  alignItems: 'flex-start',
  flex: 1,
  flexDirection: 'row',
  marginHorizontal: 17,
  marginVertical: 4
}

const DETAILS: ViewStyle = {
  alignItems: 'flex-start',
  flex: 1,
  flexDirection: 'column'
}
const TEXT: TextStyle = {
  alignItems: 'flex-start',
  backgroundColor: 'rgb(240, 243, 247)',
  borderRadius: 8,
  borderTopLeftRadius: 0,
  flexDirection: 'column',
  padding: 9
}

const TIME: TextStyle = {
  color: 'white',
  fontSize: 13
}

const DISPLAY_NAME: TextStyle = {
  color: 'rgb(118, 136, 152)',
  fontSize: 13
}

export class ChatMessage extends React.Component<ChatMessageProps, {}> {
  getLocalizedDateFormatter (dateOrTimeStamp: Date | number) {
    return moment(dateOrTimeStamp).locale('en')
  }

  render () {
    const message = this.props.message
    const timeStamp = this.getLocalizedDateFormatter(message.createdAt.getTime()).format(TIMESTAMP_FORMAT)
    const localMessage = message.isLocal

    let detailsWrapperStyle = [ DETAILS ]
    let textWrapperStyle = [ TEXT ]

    if (localMessage) {
      // The wrapper needs to be aligned to the right.
      detailsWrapperStyle.push({ alignItems: 'flex-end' })

      // The bubble needs to be differently styled.
      textWrapperStyle.push({
        backgroundColor: 'rgb(210, 231, 249)',
        borderTopLeftRadius: 8,
        borderTopRightRadius: 0
      })
    }

    return (
      <View style = { MESSAGE } >
        <View style = { detailsWrapperStyle }>
          <View style = { textWrapperStyle } >
            { !localMessage && this._renderDisplayName() }
            <Text style = { TEXT }>
              { message.text }
            </Text>
          </View>
          <Text style = { TIME }>
            { timeStamp }
          </Text>
        </View>
      </View>
    )
  }

  _renderDisplayName () {
    const message = this.props.message

    return (
      <Text style = { DISPLAY_NAME }>
        { message.user.name }
      </Text>
    )
  }
}
