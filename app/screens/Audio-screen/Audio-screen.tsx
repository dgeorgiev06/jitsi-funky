import * as React from 'react'
import Sound from 'react-native-sound'

export interface AudioScreenProps {
  stream?: any;
  source?: any;
}

export class AudioScreen extends React.Component<AudioScreenProps, {}> {
  sound: Sound

  constructor (props) {
    super(props)
    this.sound = null
  }

  componentDidMount () {
    this.sound = this.props.source ? new Sound(this.props.source, null, this.soundLoadedCallback.bind(this)) : null
  }

  componentWillUnmount () {
    if (this.sound) {
      this.sound.release()
      this.sound = null
    }
  }

  soundLoadedCallback (error) {
    if (error) {
      console.error('Failed to load sound', error)
    } else {
      if (this.sound) {
        this.sound.setNumberOfLoops(0)
        // Play the sound with an onEnd callback
        this.sound.play((done) => {
          if (done) {
            console.log('successfully finished playing sound')
          } else {
            console.log('sound failed due to audio decoding errors')
          }
        })
      }
    }
  }

  render () {
    return (
      null
    )
  }
}
