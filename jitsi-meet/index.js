import './polyfills-browser';
import './WiFiStats';

// The library lib-jitsi-meet (externally) depends on the libraries jQuery
(global => {
    // jQuery
    if (typeof global.$ === 'undefined') {
        const jQuery = require('jquery');

        jQuery(global);
        global.$ = jQuery;
    }
})(global || window || this); // eslint-disable-line no-invalid-this

// Re-export JitsiMeetJS from the library lib-jitsi-meet to (the other features
// of) the project jitsi-meet.
//
// TODO The Web support implemented by the jitsi-meet project explicitly uses
// the library lib-jitsi-meet as a binary and keeps it out of the application
// bundle. The mobile support implemented by the jitsi-meet project did not get
// to keeping the lib-jitsi-meet library out of the application bundle and even
// used it from source. As an intermediate step, start using the library
// lib-jitsi-meet as a binary on mobile at the time of this writing. In the
// future, implement not packaging it in the application bundle.
import JitsiMeetJS from 'lib-jitsi-meet/lib-jitsi-meet.min';
export { JitsiMeetJS as default };

// XXX Re-export the properties exported by JitsiMeetJS in order to prevent
// undefined imported JitsiMeetJS. It may be caused by import cycles but I have
// not confirmed the theory.
export const analytics = JitsiMeetJS.analytics;
export const browser = JitsiMeetJS.util.browser;
export const JitsiConferenceErrors = JitsiMeetJS.errors.conference;
export const JitsiConferenceEvents = JitsiMeetJS.events.conference;
export const JitsiConnectionErrors = JitsiMeetJS.errors.connection;
export const JitsiConnectionEvents = JitsiMeetJS.events.connection;
export const JitsiConnectionQualityEvents
    = JitsiMeetJS.events.connectionQuality;
export const JitsiE2ePingEvents = JitsiMeetJS.events.e2eping;
export const JitsiMediaDevicesEvents = JitsiMeetJS.events.mediaDevices;
export const JitsiParticipantConnectionStatus
    = JitsiMeetJS.constants.participantConnectionStatus;
export const JitsiRecordingConstants = JitsiMeetJS.constants.recording;
export const JitsiSIPVideoGWStatus = JitsiMeetJS.constants.sipVideoGW;
export const JitsiTrackErrors = JitsiMeetJS.errors.track;
export const JitsiTrackEvents = JitsiMeetJS.events.track;