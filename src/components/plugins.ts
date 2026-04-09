/**
 * FGPrint Component: Browser Plugins
 *
 * @developer                   Elijah Rastorguev
 * @version                     1.0.0
 * @build                       1000
 * @git                         https://github.com/DevsDaddy/fgprint
 */
import {FingerprintComponent} from "../core/component";

/**
 * Plugins Fingerprint
 */
export class PluginsFingerprint extends FingerprintComponent {
    name = 'plugins';

    getData() {
        return {
            plugins: Array.from(navigator.plugins || [])
                .map(p => `${p.name}::${p.filename}`)
                .join('|'),
            mimeTypes: Array.from(navigator.mimeTypes || [])
                .map(m => m.type)
                .join('|'),
        };
    }
}