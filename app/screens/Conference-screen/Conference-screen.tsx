import * as React from 'react'
import { observer, inject } from 'mobx-react'
import { ViewStyle, StatusBar, View, ScrollView, Dimensions, TouchableWithoutFeedback, ActivityIndicator } from 'react-native'
import { Screen } from '../../components/screen'
import { color } from '../../theme'
import { NavigationScreenProps } from 'react-navigation'
import { ConnectionStore } from '../../models/connection-store'
import { ThumbnailScreen } from '../Thumbnail-screen'
import { VideoScreen } from '../Video-screen'
import { ActionBarScreen } from '../ActionBar-screen'
import KeepAwake from 'react-native-keep-awake'
import { values } from 'mobx'
import { ChatScreen } from '../Chat-screen'

const { height, width } = Dimensions.get('window')

export interface ConferenceScreenProps extends NavigationScreenProps<{}> {
  connectionStore: ConnectionStore;
}

export interface ConferenceScreenState {
  hideActionBar: boolean;
  dominantParticipantId: string;
  dominantParticipantVideoStream: any;
}

const ROOT: ViewStyle = {
  backgroundColor: color.palette.white
}

const LARGE_VIDEO: ViewStyle = {
  flexDirection: 'column',
  height: '100%',
  width: '100%'
}

const SCROLL_VIEW: ViewStyle = {
  width: width / 3,
  height: height - 10,
  flexDirection: 'column',
  alignItems: 'flex-start',
  position: 'absolute',
  top: 10,
  left: width / 1.4
}

const ACTIVITY_INDICATOR: ViewStyle = {
  position: 'absolute',
  top: height / 2.5,
  alignContent: 'center'
}

@inject('connectionStore')
@observer
export class ConferenceScreen extends React.Component<ConferenceScreenProps, ConferenceScreenState> {
  constructor (props) {
    super(props)
    this.state = {
      hideActionBar: false,
      dominantParticipantId: null,
      dominantParticipantVideoStream: null
    }
  }

  renderScrowViewContent () {
    const participants = values(this.props.connectionStore.conference.participantStore.participants)
    const dominantParticipant = this.props.connectionStore.conference.participantStore.dominantParticipant
    let thumbnails = []

    if (participants && participants.length > 0) {
      for (let i = 0; i < participants.length; i++) {
        let participant = participants[i]
        if (participant.tracks) {
          const tracks = participant.tracks
          const audioTrack = tracks['audio']
          const videoTrack = tracks['video']
          const isDominantParticipant = dominantParticipant && participant._id === dominantParticipant._id
          const displayName = participant._displayName ? participant._displayName : 'anonymous'
          thumbnails.push(
            <ThumbnailScreen key={participant._id} id={participant._id} isDominantParticipant={isDominantParticipant} audioTrack={audioTrack} videoTrack={videoTrack} name={displayName}/>
          )
        }
      }
    }

    return thumbnails
  }

  async componentDidMount () {
    await this.props.connectionStore.createConnection()
  }

  toggleActionBar = () => {
    this.setState({
      hideActionBar: !this.state.hideActionBar
    })
  }

  onHangupButtonClicked = () => {
    this.props.connectionStore.disconnect()
    this.props.navigation.navigate('entryScreen')
  }

  dominantVideoStream = () => {
    const participantStore = this.props.connectionStore.conference.participantStore
    const dominantParticipantVideoStream = participantStore.dominantParticipant && participantStore.dominantParticipant.hasVideoTrack()
      ? participantStore.dominantParticipant.tracks['video'].jitsiTrack.getOriginalStream() : null

    return dominantParticipantVideoStream
  }

  onSendMessage = (message) => {
    this.props.connectionStore.conference.sendMessage(message)
  }

  onToggleChat = () => {
    this.props.connectionStore.conference.toggleChat(!this.props.connectionStore.conference.isChatOpen)
  }

  render () {
    const dominantParticipantVideoStream = this.dominantVideoStream()
    const joining = this.props.connectionStore.conference.joining

    return (
      <Screen style={ROOT} preset="fixedCenter">
        <StatusBar barStyle = 'light-content' hidden = { true } translucent = { true } />
        <KeepAwake />
        <ChatScreen onSendMessage={this.onSendMessage} onToggleChat={this.onToggleChat} isOpen={this.props.connectionStore.conference.isChatOpen}/>
        <TouchableWithoutFeedback onPress={this.toggleActionBar}>
          <View style={LARGE_VIDEO}>
            <VideoScreen zOrder={1} stream={dominantParticipantVideoStream}/>
          </View>
        </TouchableWithoutFeedback>
        <View style={SCROLL_VIEW}>
          <ScrollView>
            { this.renderScrowViewContent() }
          </ScrollView>
        </View>
        <View style={ACTIVITY_INDICATOR}>
          { joining && <ActivityIndicator size="large" color="black" /> }
        </View>
        <ActionBarScreen hide={this.state.hideActionBar} onToggleChat={this.onToggleChat} onHangupButtonClicked={this.onHangupButtonClicked}/>
      </Screen>
    )
  }
}
