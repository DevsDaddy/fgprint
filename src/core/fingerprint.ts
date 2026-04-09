/**
 * FGPrint general implementation
 *
 * @developer                   Elijah Rastorguev
 * @version                     1.0.0
 * @build                       1000
 * @git                         https://github.com/DevsDaddy/fgprint
 */
/* Import required modules */
import { FingerprintComponent } from "./component";
import { HashUtil } from "../utils/hash";
import {AudioFingerprint} from "../components/audio";
import {CanvasFingerprint} from "../components/canvas";
import {FontsFingerprint} from "../components/fonts";
import {NavigatorFingerprint} from "../components/navigator";
import {PluginsFingerprint} from "../components/plugins";
import {ScreenFingerprint} from "../components/screen";
import {TimezoneFingerprint} from "../components/timezone";
import {WebGLFingerprint} from "../components/webgl";
import {MiscFingerprint} from "../components/misc";
import {PerformanceFingerprint} from "../components/performance";
import {WebGPUFingerprint} from "../components/webgpu";
import {NetworkFingerprint} from "../components/network";
import {MathPrecisionFingerprint} from "../components/math";

/**
 * Fingerprint Options
 */
export interface FingerprintOptions {
    components?: FingerprintComponent[];
    exclude?: string[];
    asyncHash?: boolean;
    timeout?: number;
    debug?: boolean;
    customHash?: (data: string) => string | Promise<string>;
}

// Default Fingerprint Timeout
const DEFAULT_TIMEOUT = 2000;

/**
 * Fingerprinting Class
 */
export class Fingerprint {
    // Fingerprint fields
    private components: Map<string, FingerprintComponent> = new Map();
    private cache: Map<string, any> = new Map();
    private options: Required<Omit<FingerprintOptions, 'components'>>;

    /**
     * Create fingerprint class
     * @param options
     */
    constructor(options: FingerprintOptions = {}) {
        this.options = {
            exclude: options.exclude || [],
            asyncHash: options.asyncHash ?? false,
            timeout: options.timeout ?? DEFAULT_TIMEOUT,
            debug: options.debug ?? false,
            customHash: options.customHash ?? ((data) => HashUtil.hashSync(data)),
        };

        if (options.components) {
            for (const comp of options.components) {
                this.components.set(comp.name, comp);
            }
        }
    }

    /**
     * Register component
     * @param component {FingerprintComponent} Fingerprint Component
     */
    public registerComponent(component: FingerprintComponent): void {
        this.components.set(component.name, component);
    }

    /**
     * Clear fingerprint cache
     */
    public clearCache(): void {
        this.cache.clear();
    }

    /**
     * Get component data
     * @param name {string} Name of component
     * @returns {Promise<any>} Component data
     */
    public async getComponentData(name: string): Promise<any> {
        if (this.cache.has(name)) return this.cache.get(name);

        const component = this.components.get(name);
        if (!component) throw new Error(`Component "${name}" not registered`);

        let data = component.getData();
        if (data instanceof Promise) {
            data = await this.withTimeout(data, this.options.timeout);
        }
        this.cache.set(name, data);
        return data;
    }

    /**
     * Get all components data
     * @returns {Promise<Record<string, any>>} Returns all components data
     */
    public async getAllData(): Promise<Record<string, any>> {
        const activeComponents = Array.from(this.components.keys())
            .filter(name => !this.options.exclude.includes(name));

        const result: Record<string, any> = {};
        await Promise.all(
            activeComponents.map(async (name) => {
                result[name] = await this.getComponentData(name);
            })
        );
        return result;
    }

    /**
     * Get fingerprint async
     * @returns {Promise<string>} Fingerprint HEX string
     */
    public async getFingerprint(): Promise<string> {
        const data = await this.getAllData();
        const serialized = JSON.stringify(data);
        if (this.options.debug) return serialized;

        const hash = await this.options.customHash(serialized);
        if (typeof hash === 'string') return hash;
        return this.options.asyncHash ? await HashUtil.hashAsync(serialized) : HashUtil.hashSync(serialized);
    }

    /**
     * Create Default Fingerprint
     */
    public static createDefault() : Fingerprint {
        return new Fingerprint({
            components: [
                new AudioFingerprint(),
                new CanvasFingerprint(),
                new FontsFingerprint(),
                new NavigatorFingerprint(),
                new PluginsFingerprint(),
                new ScreenFingerprint(),
                new TimezoneFingerprint(),
                new WebGLFingerprint(),
                new MiscFingerprint(),
                new WebGPUFingerprint(),
                new MathPrecisionFingerprint()
            ]
        });
    }

    public static createFull(): Fingerprint {
        return new Fingerprint({
            components: [
                new AudioFingerprint(),
                new CanvasFingerprint(),
                new FontsFingerprint(),
                new NavigatorFingerprint(),
                new PluginsFingerprint(),
                new ScreenFingerprint(),
                new TimezoneFingerprint(),
                new WebGLFingerprint(),
                new MiscFingerprint(),
                new PerformanceFingerprint(),
                new WebGPUFingerprint(),
                new NetworkFingerprint(),
                new MathPrecisionFingerprint()
            ]
        })
    }

    /**
     * Get fingerprint sync
     * @returns {string} Fingerprint HEX string
     */
    public getFingerprintSync(): string {
        const syncComponents = Array.from(this.components.entries())
            .filter(([name, comp]) => {
                if (this.options.exclude.includes(name)) return false;
                const data = comp.getData();
                return !(data instanceof Promise);
            })
            .map(([name]) => name);

        const data: Record<string, any> = {};
        for (const name of syncComponents) {
            data[name] = this.getComponentDataSync(name);
        }

        const serialized = JSON.stringify(data);
        if (this.options.debug) return serialized;
        return HashUtil.hashSync(serialized);
    }

    private getComponentDataSync(name: string): any {
        if (this.cache.has(name)) return this.cache.get(name);
        const component = this.components.get(name);
        if (!component) throw new Error(`Component "${name}" not registered`);
        const data = component.getData();
        if (data instanceof Promise) {
            throw new Error(`Component "${name}" is async and cannot be used synchronously`);
        }
        this.cache.set(name, data);
        return data;
    }

    private withTimeout<T>(promise: Promise<T>, ms: number): Promise<T | null> {
        return new Promise((resolve) => {
            const timer = setTimeout(() => resolve(null), ms);
            promise.then(
                (val) => { clearTimeout(timer); resolve(val); },
                () => { clearTimeout(timer); resolve(null); }
            );
        });
    }
}