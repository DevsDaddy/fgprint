/**
 * FGPrint Component: CSS Features
 *
 * @developer                   Elijah Rastorguev
 * @version                     1.0.0
 * @build                       1000
 * @git                         https://github.com/DevsDaddy/fgprint
 */
import {FingerprintComponent} from "../core/component";

/**
 * CSS Features Fingerpting
 */
export class CSSFeaturesFingerprint extends FingerprintComponent {
    name = 'cssFeatures';

    public override getData() {
        const properties = [
            'display', 'grid', 'flex', 'subgrid',
            'gap', 'container-type', 'container', 'container-query',
            'color', 'lab()', 'lch()', 'oklab()', 'color-mix',
            'accent-color', 'color-scheme',
            'backdrop-filter', 'animation-timeline', 'view-timeline', 'scroll-timeline',
            'offset-path', 'offset-distance', 'offset-rotate',
            'font-palette', 'font-variant-alternates', 'size-adjust',
        ];

        const supportMap: Record<string, boolean> = {};
        properties.forEach(prop => {
            supportMap[prop] = CSS.supports(prop, 'initial');
        });

        return supportMap;
    }
}