UI Functionality:

Support video and audio conferences
Support conference chat
Ability to specify the name of the room to connect to and your display name in the conference
Hook into iPhone’s telephony API ( CallKit )
The building blocks that i used for this prototype are:

lib-jitsi-meet — a low level javascript client library for managing Jitsi Meet Video conferences

react-native-webrtc — provides web browsers and mobile applications with real-time communication (RTC) via simple application programming interfaces (APIs)

react-native-callkit — utilises the new iOS 10 framework CallKit for VOIP apps to interact with the iPhone UI

mobx-state-tree — a library that helps you organize your application states in a very structured manner. It allows you to create a component model, but for your data

react-native-gifted-chat — chat UI for React Native

INSTALLATION INSTRUCTIONS:

1. Download the code 
2. cd into the root directory and run npm install
3. cd into the ios directory and run pod install
4. open 2 terminals and make sure you are in the root directory:
5. run npm start — — reset-cache
6. run react-native run-ios — device ( TO RUN ON THE DEVICE YOU WILL NEED TO SIGN THE PROJECT IN XCODE )

More details here:

https://medium.com/@dgeorgiev06/chat-and-video-conference-app-with-react-native-ignite-lib-jitsi-meet-react-native-callkit-21089944ba54
