/**
 * FGPrint Component: Network Fingerprint
 *
 * @developer                   Elijah Rastorguev
 * @version                     1.0.0
 * @build                       1000
 * @git                         https://github.com/DevsDaddy/fgprint
 */
import {FingerprintComponent} from "../core/component";

/**
 * Network Fingerprint
 */
export class NetworkFingerprint extends FingerprintComponent {
    name = 'network';

    public override getData() {
        const conn = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
        if (!conn) return { supported: false };

        return {
            supported: true,
            effectiveType: conn.effectiveType,
            rtt: conn.rtt,
            downlink: conn.downlink,
            saveData: conn.saveData,
            type: conn.type,
        };
    }
}