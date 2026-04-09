/**
 * FGPrint Component: Additional Fingerprinting
 *
 * @developer                   Elijah Rastorguev
 * @version                     1.0.0
 * @build                       1000
 * @git                         https://github.com/DevsDaddy/fgprint
 */
import {FingerprintComponent} from "../core/component";
import {Helpers} from "../utils/helpers";

/**
 * Misc Fingerprint
 */
export class MiscFingerprint extends FingerprintComponent {
    name = 'misc';

    public override getData() {
        return {
            touchSupport: 'ontouchstart' in window,
            pointerSupport: !!window.PointerEvent,
            passiveSupported: (() => {
                let supports = false;
                try {
                    const opts = Object.defineProperty({}, 'passive', {
                        get: () => (supports = true),
                    });
                    window.addEventListener('test', () => {}, opts);
                } catch {}
                return supports;
            })(),
            colorGamut: Helpers.getSafe(() => matchMedia('(color-gamut: p3)').matches ? 'p3' : 'srgb', 'srgb'),
            reducedMotion: Helpers.getSafe(() => matchMedia('(prefers-reduced-motion: reduce)').matches, false),
            darkMode: Helpers.getSafe(() => matchMedia('(prefers-color-scheme: dark)').matches, false),
        };
    }
}