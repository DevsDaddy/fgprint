/**
 * FGPrint Component: Fonts
 *
 * @developer                   Elijah Rastorguev
 * @version                     1.0.0
 * @build                       1000
 * @git                         https://github.com/DevsDaddy/fgprint
 */
import {FingerprintComponent} from "../core/component";

/**
 * Fonts Fingerprint
 */
export class FontsFingerprint extends FingerprintComponent {
    name = 'fonts';

    public override getData() {
        const baseFonts = ['monospace', 'sans-serif', 'serif'];
        const testString = 'abcdefghijklmnopqrstuvwxyzабвгдеёжзийклмнопрстуфхцчшщъыьэюя';
        const testSize = '72px';

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return {};

        const getWidth = (font: string) => {
            ctx.font = `${testSize} "${font}"`;
            return ctx.measureText(testString).width;
        };

        const baseWidths = baseFonts.reduce((acc, font) => {
            acc[font] = getWidth(font);
            return acc;
        }, {} as Record<string, number>);

        const fontsToCheck = [
            'Arial', 'Verdana', 'Times New Roman', 'Courier New', 'Helvetica',
            'Comic Sans MS', 'Georgia', 'Impact', 'Trebuchet MS', 'Lucida Console',
            'Palatino Linotype', 'Tahoma', 'MS Sans Serif', 'MS Serif', 'Symbol',
            'Webdings', 'Wingdings', 'Arial Black', 'Calibri', 'Cambria', 'Candara',
            'Consolas', 'Constantia', 'Corbel', 'Franklin Gothic Medium', 'Segoe UI',
        ];

        const availableFonts = fontsToCheck.filter(font => {
            for (const base of baseFonts) {
                ctx.font = `${testSize} "${font}", ${base}`;
                if (ctx.measureText(testString).width !== baseWidths[base]) {
                    return true;
                }
            }
            return false;
        });

        return {
            baseWidths,
            availableFonts: availableFonts.join(','),
        };
    }
}