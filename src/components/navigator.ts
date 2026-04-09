/**
 * FGPrint Component: Navigator
 *
 * @developer                   Elijah Rastorguev
 * @version                     1.0.0
 * @build                       1000
 * @git                         https://github.com/DevsDaddy/fgprint
 */
import {FingerprintComponent} from "../core/component";
import {Helpers} from "../utils/helpers";

/**
 * Navigator Fingerprint
 */
export class NavigatorFingerprint extends FingerprintComponent {
    name = 'navigator';

    public override getData() {
        const nav = navigator;
        return {
            userAgent: nav.userAgent,
            platform: nav.platform,
            language: nav.language,
            languages: [...(nav.languages || [])].join(','),
            cookieEnabled: nav.cookieEnabled,
            doNotTrack: nav.doNotTrack || 'unspecified',
            hardwareConcurrency: nav.hardwareConcurrency || 'unknown',
            deviceMemory: (nav as any).deviceMemory || 'unknown',
            productSub: (nav as any).productSub || '',
            vendor: nav.vendor || '',
            vendorSub: (nav as any).vendorSub || '',
            webdriver: nav.webdriver || false,
            maxTouchPoints: nav.maxTouchPoints || 0,
            pdfViewerEnabled: Helpers.getSafe(() => (nav as any).pdfViewerEnabled, false),
        };
    }
}