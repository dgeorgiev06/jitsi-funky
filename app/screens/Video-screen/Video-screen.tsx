import * as React from 'react'
import { RTCView } from 'react-native-webrtc'

export interface VideoScreenProps {
  stream: any;
  zOrder: number;
}

export interface VideoScreenState {
  ready: boolean;
}

export class VideoScreen extends React.Component<VideoScreenProps, VideoScreenState> {
  constructor (props) {
    super(props)
    this.state = {
      ready: false
    }
  }

  render () {
    if (!this.props.stream) {
      return null
    }

    return (
      <RTCView
        objectFit = "cover"
        streamURL = { this.props.stream.toURL() }
        style={{ flex: 1 }}
        zOrder={this.props.zOrder}
      />

    )
  }
}
