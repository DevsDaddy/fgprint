/**
 * FGPrint Component: Virtual Keyboard
 *
 * @developer                   Elijah Rastorguev
 * @version                     1.0.0
 * @build                       1000
 * @git                         https://github.com/DevsDaddy/fgprint
 */
import {FingerprintComponent} from "../core/component";

/**
 * Virtual Keyboard Fingerprint
 */
export class VirtualKeyboardFingerprint extends FingerprintComponent {
    name = 'virtualKeyboard';

    public override getData() {
        const vk = (navigator as any).virtualKeyboard;
        if (!vk) return { supported: false };

        return {
            supported: true,
            overlaysContent: vk.overlaysContent,
            boundingRect: vk.boundingRect ? {
                width: vk.boundingRect.width,
                height: vk.boundingRect.height,
                x: vk.boundingRect.x,
                y: vk.boundingRect.y,
            } : null,
        };
    }
}