/**
 * FGPrint Component: Timezone
 *
 * @developer                   Elijah Rastorguev
 * @version                     1.0.0
 * @build                       1000
 * @git                         https://github.com/DevsDaddy/fgprint
 */
import {FingerprintComponent} from "../core/component";
import {Helpers} from "../utils/helpers";

/**
 * Timezone Fingerprint
 */
export class TimezoneFingerprint extends FingerprintComponent {
    name = 'timezone';

    public override getData() {
        return {
            timezoneOffset: new Date().getTimezoneOffset(),
            timezone: Helpers.getSafe(() => Intl.DateTimeFormat().resolvedOptions().timeZone, ''),
        };
    }
}