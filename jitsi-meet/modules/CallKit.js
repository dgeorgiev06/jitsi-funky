import RNCallKit from 'react-native-callkit'

export default class CallKit extends RNCallKit {   
    
    static registerSubscriptions(delegate) {
        try {
            CallKit.setup({
                imageName: 'CallKitIcon',
                appName: "Jitsi Funk"
            })
        } catch(error) {
            console.log("RNCallKit Error: ", error)
        }

        CallKit.addEventListener('endCall', delegate._onPerformEndCallAction),
        CallKit.addEventListener('didPerformSetMutedCallAction', delegate._onPerformSetMutedCallAction)
       
    }
}


