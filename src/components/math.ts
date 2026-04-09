/**
 * FGPrint Component: Math Precision Fingerprint
 *
 * @developer                   Elijah Rastorguev
 * @version                     1.0.0
 * @build                       1000
 * @git                         https://github.com/DevsDaddy/fgprint
 */
import {FingerprintComponent} from "../core/component";

/**
 * Math Precision Fingerprint
 */
export class MathPrecisionFingerprint extends FingerprintComponent {
    name = 'mathPrecision';

    public override getData() {
        return {
            tanMinus1e16: Math.tan(-1e16),
            cos1e20: Math.cos(1e20),
            sin1e30: Math.sin(1e30),
            atan2Zero: Math.atan2(0, -0),
            powSpecial: Math.pow(0.9999999999999999, 1e20),
        };
    }
}