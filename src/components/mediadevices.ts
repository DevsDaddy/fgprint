/**
 * FGPrint Component: Additional Media Devices
 *
 * @developer                   Elijah Rastorguev
 * @version                     1.0.0
 * @build                       1000
 * @git                         https://github.com/DevsDaddy/fgprint
 */
import {FingerprintComponent} from "../core/component";

/**
 * Additional Media Devices Fingerprint
 */
export class MediaDevicesFingerprint extends FingerprintComponent {
    name = 'mediaDevices';

    public override async getData(): Promise<Record<string, string>> {
        if (!navigator.mediaDevices?.enumerateDevices) return {};

        try {
            const devices = await navigator.mediaDevices.enumerateDevices();
            return {
                audioInputs: devices.filter(d => d.kind === 'audioinput').map(d => d.label).join('|'),
                audioOutputs: devices.filter(d => d.kind === 'audiooutput').map(d => d.label).join('|'),
                videoInputs: devices.filter(d => d.kind === 'videoinput').map(d => d.label).join('|'),
                deviceIds: devices.map(d => d.deviceId).join('|'),
            };
        } catch {
            return {};
        }
    }
}