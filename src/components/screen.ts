/**
 * FGPrint Component: Screen Data
 *
 * @developer                   Elijah Rastorguev
 * @version                     1.0.0
 * @build                       1000
 * @git                         https://github.com/DevsDaddy/fgprint
 */
import {FingerprintComponent} from "../core/component";
import { Helpers } from "../utils/helpers";

/**
 * Screen Fingerprint
 */
export class ScreenFingerprint extends FingerprintComponent {
    name = 'screen';

    public override getData() {
        const s : any = screen;
        return {
            width: Helpers.stableScreen(s.width),
            height: Helpers.stableScreen(s.height),
            availWidth: Helpers.stableScreen(s.availWidth),
            availHeight: Helpers.stableScreen(s.availHeight),
            colorDepth: s.colorDepth,
            pixelDepth: s.pixelDepth,
            availLeft: Helpers.stableScreen(s?.availLeft || 0),
            availTop: Helpers.stableScreen(s?.availTop || 0),
            orientation: Helpers.getSafe(() => (s.orientation as any)?.type, ''),
        };
    }
}