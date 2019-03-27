import * as React from 'react'
import { View, Text, ViewStyle, TextStyle } from 'react-native'
import { VideoScreen } from '../Video-screen'
import { AudioScreen } from '../Audio-screen'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

export interface ThumbnailScreenProps {
  videoTrack: any;
  audioTrack: any;
  name: string;
  id: string;
  isDominantParticipant: boolean;
}

const DOMINANT_ICON_VIEW: ViewStyle = {
  position: 'absolute',
  flex: 1,
  left: 5,
  top: 5
}

const CONTAINER_VIEW: ViewStyle = {
  padding: 5,
  zIndex: 2,
  width: '100%',
  height: '100%',
  flex: 1
}

const VIDEO_VIEW: ViewStyle = {
  borderWidth: 1.5,
  width: 100,
  height: 100
}

const TRACKS_VIEW: ViewStyle = {
  flex: 1
}

const TEXT_VIEW: TextStyle = {
  color: 'white'
}

export class ThumbnailScreen extends React.Component<ThumbnailScreenProps, {}> {
  renderVideoTrack = () => {
    if (this.props.videoTrack) {
      return <VideoScreen zOrder={0} stream={this.props.videoTrack.jitsiTrack.getOriginalStream()} />
    } else {
      return null
    }
  }

  render () {
    let borderColor = 'white'

    if (this.props.isDominantParticipant) {
      borderColor = 'blue'
    }

    return (
      <View style={CONTAINER_VIEW}>
        <Text style={TEXT_VIEW}>
          {this.props.name}
        </Text>
        <View style={TRACKS_VIEW}>
          { this.props.audioTrack && !this.props.audioTrack.local && <AudioScreen stream={this.props.audioTrack.jitsiTrack.getOriginalStream()}/> }
          <View style={[VIDEO_VIEW, { borderColor: borderColor }]}>
            { this.renderVideoTrack() }
            <View style={DOMINANT_ICON_VIEW}>
              { this.props.isDominantParticipant && <Icon name={'phone-in-talk'} color='blue' size={20}/> }
            </View>
          </View>
        </View>
      </View>
    )
  }
}
