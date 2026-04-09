/**
 * FGPrint Component: Sensors
 *
 * @developer                   Elijah Rastorguev
 * @version                     1.0.0
 * @build                       1000
 * @git                         https://github.com/DevsDaddy/fgprint
 */
import {FingerprintComponent} from "../core/component";

/**
 * Sensor Fingerprint
 */
export class SensorFingerprint extends FingerprintComponent {
    name = 'sensors';

    public override getData(): Record<string, any> {
        const sensors = [
            'Accelerometer', 'Gyroscope', 'Magnetometer', 'AmbientLightSensor',
            'ProximitySensor', 'AbsoluteOrientationSensor', 'RelativeOrientationSensor'
        ];

        const result: Record<string, boolean> = {};
        sensors.forEach(sensor => {
            result[sensor] = sensor in window;
        });

        if ('Accelerometer' in window) {
            try {
                // @ts-ignore
                const acc = new Accelerometer();
                result['accelerometerPrecision'] = acc.constructor?.frequencyHint || 'unknown';
            } catch { /* ignore */ }
        }

        return result;
    }
}