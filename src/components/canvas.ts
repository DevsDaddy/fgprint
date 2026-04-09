/**
 * FGPrint Component: Canvas
 *
 * @developer                   Elijah Rastorguev
 * @version                     1.0.0
 * @build                       1000
 * @git                         https://github.com/DevsDaddy/fgprint
 */
import {FingerprintComponent} from "../core/component";

/**
 * Canvas Fingerprint
 */
export class CanvasFingerprint extends FingerprintComponent<string> {
    name = 'canvas';

    public override getData(): string {
        try {
            const canvas = document.createElement('canvas');
            canvas.width = 240;
            canvas.height = 60;
            const ctx = canvas.getContext('2d');
            if (!ctx) return '';

            ctx.textBaseline = 'top';
            ctx.font = '14px "Arial"';
            ctx.fillStyle = '#f60';
            ctx.fillRect(10, 5, 50, 20);
            ctx.fillStyle = '#069';
            ctx.font = 'italic 16px "Times New Roman"';
            ctx.fillText('Fingerprint 👤', 2, 15);
            ctx.font = 'bold 12px "Courier New"';
            ctx.fillStyle = '#0a0';
            ctx.fillText('Canvas', 100, 30);
            ctx.beginPath();
            ctx.arc(160, 20, 10, 0, 2 * Math.PI);
            const gradient = ctx.createLinearGradient(0, 0, 240, 60);
            gradient.addColorStop(0, 'blue');
            gradient.addColorStop(1, 'red');
            ctx.fillStyle = gradient;
            ctx.fill();

            return canvas.toDataURL();
        } catch {
            return '';
        }
    }
}