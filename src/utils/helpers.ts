/**
 * FGPrint helpers utils
 *
 * @developer                   Elijah Rastorguev
 * @version                     1.0.0
 * @build                       1000
 * @git                         https://github.com/DevsDaddy/fgprint
 */
/**
 * Helpers Utils
 */
export class Helpers {
    /**
     * Get Safe
     * @param fn {Function} Function
     * @param fallback {any} Fallback
     */
    public static getSafe<T>(fn: () => T, fallback: T = '' as T): T {
        try {
            return fn();
        } catch {
            return fallback;
        }
    }

    /**
     * Round for stable screen
     * @param value {number} Initial value
     * @returns {number} Rounded safe screen
     */
    public static stableScreen(value: number): number {
        return Math.floor(value / 10) * 10;
    }

    /**
     * Check API is supported
     * @param api {string} API name in window
     * @returns {boolean}
     */
    public static isSupported(api: string): boolean {
        return this.getSafe(() => api in window, false);
    }
}