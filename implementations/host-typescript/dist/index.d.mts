declare class Channel {
    private offset;
    storageUint8: Uint8Array;
    storageUint32: Uint32Array;
    storageInt32: Int32Array;
    storageFloat32: Float32Array;
    storageFloat64: Float64Array;
    constructor(buffer: ArrayBuffer, offset?: number, sizeInBytes?: number);
    reset(): void;
    offset8(): number;
    offset32(): number;
    offset64(): number;
    advance8(count: number): void;
    advance32(count: number): void;
    advance64(count: number): void;
}
declare class Writer extends Channel {
    writeUint8(value: number): void;
    writeUint32(value: number): void;
    writeInt32(value: number): void;
    writeFloat32(value: number): void;
    writeFloat64(value: number): void;
    allocateUint8(): (value: number) => void;
    allocateUint32(): (value: number) => void;
    allocateInt32(): (value: number) => void;
    allocateFloat32(): (value: number) => void;
    allocateFloat64(): (value: number) => void;
    allocateUint8Elements(length: number): Uint8Array;
    allocateUint8Array(length: number): Uint8Array;
    allocateUint32Elements(length: number): Uint32Array;
    allocateUint32Array(length: number): Uint32Array;
    allocateInt32Elements(length: number): Int32Array;
    allocateInt32Array(length: number): Int32Array;
    allocateFloat32Elements(length: number): Float32Array;
    allocateFloat32Array(length: number): Float32Array;
    allocateFloat64Elements(length: number): Float64Array;
    allocateFloat64Array(length: number): Float64Array;
    copyUint8Elements(arr: Uint8Array | number[]): void;
    copyUint32Elements(arr: Uint32Array | number[]): void;
    copyInt32Elements(arr: Int32Array | number[]): void;
    copyFloat32Elements(arr: Float32Array | number[]): void;
    copyFloat64Elements(arr: Float64Array | number[]): void;
    copyUint8Array(arr: Uint8Array | number[]): void;
    copyUint32Array(arr: Uint32Array | number[]): void;
    copyInt32Array(arr: Int32Array | number[]): void;
    copyFloat32Array(arr: Float32Array | number[]): void;
    copyFloat64Array(arr: Float64Array | number[]): void;
    writeAsciiString(value: string): void;
    writeUtf8String(value: string): void;
}
declare class Reader extends Channel {
    readUint8(): number;
    readUint32(): number;
    readInt32(): number;
    readFloat32(): number;
    readFloat64(): number;
    readUint8Elements(length: number): Uint8Array;
    readUint32Elements(length: number): Uint32Array;
    readInt32Elements(length: number): Int32Array;
    readFloat32Elements(length: number): Float32Array;
    readFloat64Elements(length: number): Float64Array;
    readUint8Array(): Uint8Array;
    readUint32Array(): Uint32Array;
    readInt32Array(): Int32Array;
    readFloat32Array(): Float32Array;
    readFloat64Array(): Float64Array;
    readUint8Arrays(count: number): Uint8Array[];
    readUint32Arrays(count: number): Uint32Array[];
    readInt32Arrays(count: number): Int32Array[];
    readFloat32Arrays(count: number): Float32Array[];
    readFloat64Arrays(count: number): Float64Array[];
    readAsciiString(): string;
    readAsciiStrings(count: number): string[];
    readUtf8String(): string;
    readUtf8Strings(count: number): string[];
}

type BindableExport = () => 0 | 1;
type InstanceOptions = {
    inputChannelSize: number;
    outputChannelSize: number;
    initialMemoryPages?: number;
    log?: (message: string) => void;
};
type ExportBase = Record<string, () => number> & {
    getLogPtr: () => number;
    getErrorPtr: () => number;
    allocateInputChannel: (sizeInBytes: number) => number;
    allocateOutputChannel: (sizeInBytes: number) => number;
};
type BindingFactory = <Args extends unknown[], Result>(func: BindableExport, handleInput: (input: Writer, args: Args) => void, handleOutput: (output: Reader) => Result) => (...args: Args) => Result;
type Instance<T extends Record<string, unknown>> = {
    getMemory: () => ArrayBuffer;
    getBytes: () => Uint8ClampedArray;
    exports: ExportBase & T;
    createView: <T>(init: (buffer: ArrayBuffer) => T) => () => T;
    getInput: () => Writer;
    getOutput: () => Reader;
    handleError: (func: () => number) => void;
    getSize: () => number;
    bind: BindingFactory;
};
declare function createInstance<T extends Record<string, BindableExport>>(wasmBuffer: Buffer, options: InstanceOptions): Promise<Instance<T>>;

export { type BindableExport, type BindingFactory, type ExportBase, type Instance, type InstanceOptions, createInstance };
