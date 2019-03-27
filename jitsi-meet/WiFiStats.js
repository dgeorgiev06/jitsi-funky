import { NativeModules } from 'react-native';

export function getJitsiMeetGlobalNS() {
    if (!window.JitsiMeetJS) {
        window.JitsiMeetJS = {};
    }

    if (!window.JitsiMeetJS.app) {
        window.JitsiMeetJS.app = {};
    }

    return window.JitsiMeetJS.app;
}

/**
 * If WiFiStats native module exist attach it to JitsiMeetGlobalNS.
 */
if (NativeModules.WiFiStats) {
    getJitsiMeetGlobalNS().getWiFiStats = NativeModules.WiFiStats.getWiFiStats;
}