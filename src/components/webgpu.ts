/**
 * FGPrint Component: WebGPU
 *
 * @developer                   Elijah Rastorguev
 * @version                     1.0.0
 * @build                       1000
 * @git                         https://github.com/DevsDaddy/fgprint
 */
import {FingerprintComponent} from "../core/component";

/**
 * WebGPU Fingerprint
 */
export class WebGPUFingerprint extends FingerprintComponent {
    name = 'webgpu';

    /**
     * WebGPU Version
     */
    public async getData(): Promise<Record<string, any>> {
        if (!('gpu' in navigator)) return { supported: false };

        try {
            //@ts-ignore
            const adapter = await navigator.gpu.requestAdapter();
            if (!adapter) return { supported: true, adapter: null };

            const info = await adapter.requestAdapterInfo();
            return {
                supported: true,
                vendor: info.vendor,
                architecture: info.architecture,
                device: info.device,
                description: info.description,
                limits: {
                    maxTextureDimension2D: adapter.limits.maxTextureDimension2D,
                    maxBufferSize: adapter.limits.maxBufferSize,
                    maxComputeWorkgroupSizeX: adapter.limits.maxComputeWorkgroupSizeX,
                },
                features: Array.from(adapter.features).sort(),
            };
        } catch {
            return { supported: true, error: 'Unable to retrieve WebGPU info' };
        }
    }
}