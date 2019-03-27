import * as React from 'react'
import { observer, inject } from 'mobx-react'
import { ViewStyle, View, TouchableOpacity, Text, ScrollView, TextStyle } from 'react-native'
import { color } from '../../theme'
import { NavigationScreenProps } from 'react-navigation'
import { ConnectionStore } from '../../models/connection-store'
import t from 'tcomb-form-native'

export interface EntryScreenProps extends NavigationScreenProps<{}> {
  connectionStore: ConnectionStore;
}

export interface EntryScreenState {
  roomEntryModel: any;
  options: any;
}

const FORM_VIEW: ViewStyle = {
  flex: 1,
  flexDirection: 'column',
  padding: 30,
  marginTop: 100
}

const BUTTON_VIEW: ViewStyle = {
  flexDirection: 'row'
}

const TEXT: TextStyle = {
  textAlign: 'center',
  color: color.palette.black,
  fontSize: 17
}

const TEXT_VIEW: TextStyle = {
  flex: 1,
  borderWidth: 0,
  backgroundColor: 'white',
  padding: 6
}

let Form = t.form.Form

@inject('connectionStore')
@observer
export class EntryScreen extends React.Component<EntryScreenProps, EntryScreenState> {
  constructor (props) {
    super(props)
    this.state = {
      roomEntryModel: t.struct({
        displayName: t.String,
        room: t.String
      }),
      options: {
        fields: {
          displayName: {
            label: 'Display Name',
            returnKeyType: 'next',
            onSubmitEditing: () => this.refs.form.getComponent('room').refs.input.focus()
          },
          room: {
            label: 'Room',
            returnKeyType: 'join',
            onSubmitEditing: () => this.handlePressJoinConference(),
            autoCapitalize: 'none'
          }
        }
      }
    }
  }

  handlePressJoinConference = () => {
    const value = this.refs.form.getValue()
    if (value) {
      this.props.connectionStore.setRoom(value.room)
      this.props.connectionStore.setDisplayName(value.displayName)
      this.props.navigation.navigate('conferenceScreen')
    }
  }

  render () {
    return (
      <ScrollView>
        <View style={FORM_VIEW}>
          <Form ref='form' type={this.state.roomEntryModel} options={this.state.options}/>
          <View style={BUTTON_VIEW}>
            <TouchableOpacity style={{ flex: 1, borderColor: 'black' }} onPress={this.handlePressJoinConference}>
              <View style={TEXT_VIEW}>
                <Text style={TEXT}>Join</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    )
  }
}
