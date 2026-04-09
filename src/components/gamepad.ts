/**
 * FGPrint Component: Gamepad Fingerprint
 *
 * @developer                   Elijah Rastorguev
 * @version                     1.0.0
 * @build                       1000
 * @git                         https://github.com/DevsDaddy/fgprint
 */
import {FingerprintComponent} from "../core/component";

/**
 * Gamepad Fingerprint
 */
export class GamepadFingerprint extends FingerprintComponent {
    name = 'gamepad';

    public override getData() {
        if (!('getGamepads' in navigator)) return { supported: false };

        const gamepads = navigator.getGamepads();
        const info = [];
        for (const gp of gamepads) {
            if (gp) info.push(`${gp.id}::${gp.mapping}`);
        }
        return {
            supported: true,
            count: info.length,
            list: info.join('|'),
        };
    }
}