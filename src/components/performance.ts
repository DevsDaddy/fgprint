/**
 * FGPrint Component: Performance
 *
 * @developer                   Elijah Rastorguev
 * @version                     1.0.0
 * @build                       1000
 * @git                         https://github.com/DevsDaddy/fgprint
 */
import {FingerprintComponent} from "../core/component";

/**
 * Performance Fingerprint
 */
export class PerformanceFingerprint extends FingerprintComponent {
    name = 'performance';

    public override getData() {
        return {
            jsHeapSizeLimit: (performance as any).memory?.jsHeapSizeLimit ?? null,
            totalJSHeapSize: (performance as any).memory?.totalJSHeapSize ?? null,
            usedJSHeapSize: (performance as any).memory?.usedJSHeapSize ?? null,
            mathLoopSpeed: this.measureMathSpeed(),
        };
    }

    private measureMathSpeed(): number {
        const start = performance.now();
        for (let i = 0; i < 100000; i++) {
            Math.sqrt(Math.random());
        }
        return performance.now() - start;
    }
}