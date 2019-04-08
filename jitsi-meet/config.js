export function configOverrides () {
  return {
    hosts: {
      bridge: 'jitsi-videobridge.localhost',
      domain: 'localhost',
      focus: 'focus.localhost',
      muc: 'conference.localhost'
    },
    bosh: '//192.168.1.5:7070/http-bind',
    p2p: {
      enabled: true,
      stunServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
        { urls: 'stun:stun2.l.google.com:19302' }
      ],
      preferH264: true
    }
  }
}
