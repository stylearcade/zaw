'use strict';

// src/conduit.ts
function alignUp(x, bytes) {
  const mask = bytes - 1;
  return x + mask & ~mask;
}
var Channel = class {
  constructor(buffer, offset = 0, sizeInBytes = buffer.byteLength) {
    this.offset = 0;
    this.storageUint8 = new Uint8Array(buffer, offset, sizeInBytes / Uint8Array.BYTES_PER_ELEMENT);
    this.storageUint32 = new Uint32Array(buffer, offset, sizeInBytes / Uint32Array.BYTES_PER_ELEMENT);
    this.storageInt32 = new Int32Array(buffer, offset, sizeInBytes / Int32Array.BYTES_PER_ELEMENT);
    this.storageFloat32 = new Float32Array(buffer, offset, sizeInBytes / Float32Array.BYTES_PER_ELEMENT);
    this.storageFloat64 = new Float64Array(buffer, offset, sizeInBytes / Float64Array.BYTES_PER_ELEMENT);
  }
  reset() {
    this.offset = 0;
  }
  offset8() {
    return this.offset;
  }
  offset32() {
    this.offset = alignUp(this.offset, 4);
    return this.offset >>> 2;
  }
  offset64() {
    this.offset = alignUp(this.offset, 8);
    return this.offset >>> 3;
  }
  advance8(count) {
    this.offset += count;
    if (this.offset > this.storageUint8.length) {
      throw Error("Reached end of channel");
    }
  }
  advance32(count) {
    this.advance8(count * 4);
  }
  advance64(count) {
    this.advance8(count * 8);
  }
};
var Writer = class extends Channel {
  writeUint8(value) {
    this.storageUint8[this.offset8()] = value;
    this.advance8(1);
  }
  writeUint32(value) {
    this.storageUint32[this.offset32()] = value;
    this.advance32(1);
  }
  writeInt32(value) {
    this.storageInt32[this.offset32()] = value;
    this.advance32(1);
  }
  writeFloat32(value) {
    this.storageFloat32[this.offset32()] = value;
    this.advance32(1);
  }
  writeFloat64(value) {
    this.storageFloat64[this.offset64()] = value;
    this.advance64(1);
  }
  allocateUint8() {
    const offset = this.offset8();
    this.advance8(1);
    return (value) => {
      this.storageUint8[offset] = value;
    };
  }
  allocateUint32() {
    const offset = this.offset32();
    this.advance32(1);
    return (value) => {
      this.storageUint32[offset] = value;
    };
  }
  allocateInt32() {
    const offset = this.offset32();
    this.advance32(1);
    return (value) => {
      this.storageInt32[offset] = value;
    };
  }
  allocateFloat32() {
    const offset = this.offset32();
    this.advance32(1);
    return (value) => {
      this.storageFloat32[offset] = value;
    };
  }
  allocateFloat64() {
    const offset = this.offset64();
    this.advance64(1);
    return (value) => {
      this.storageFloat64[offset] = value;
    };
  }
  allocateUint8Elements(length) {
    const start = this.offset8();
    this.advance8(length);
    return this.storageUint8.subarray(start, start + length);
  }
  allocateUint8Array(length) {
    this.writeUint32(length);
    return this.allocateUint8Elements(length);
  }
  allocateUint32Elements(length) {
    const start = this.offset32();
    this.advance32(length);
    return this.storageUint32.subarray(start, start + length);
  }
  allocateUint32Array(length) {
    this.writeUint32(length);
    return this.allocateUint32Elements(length);
  }
  allocateInt32Elements(length) {
    const start = this.offset32();
    this.advance32(length);
    return this.storageInt32.subarray(start, start + length);
  }
  allocateInt32Array(length) {
    this.writeUint32(length);
    return this.allocateInt32Elements(length);
  }
  allocateFloat32Elements(length) {
    const start = this.offset32();
    this.advance32(length);
    return this.storageFloat32.subarray(start, start + length);
  }
  allocateFloat32Array(length) {
    this.writeUint32(length);
    return this.allocateFloat32Elements(length);
  }
  allocateFloat64Elements(length) {
    const start = this.offset64();
    this.advance64(length);
    return this.storageFloat64.subarray(start, start + length);
  }
  allocateFloat64Array(length) {
    this.writeUint32(length);
    return this.allocateFloat64Elements(length);
  }
  copyUint8Elements(arr) {
    this.storageUint8.set(arr, this.offset8());
    this.advance8(arr.length);
  }
  copyUint32Elements(arr) {
    this.storageUint32.set(arr, this.offset32());
    this.advance32(arr.length);
  }
  copyInt32Elements(arr) {
    this.storageInt32.set(arr, this.offset32());
    this.advance32(arr.length);
  }
  copyFloat32Elements(arr) {
    this.storageFloat32.set(arr, this.offset32());
    this.advance32(arr.length);
  }
  copyFloat64Elements(arr) {
    this.storageFloat64.set(arr, this.offset64());
    this.advance64(arr.length);
  }
  copyUint8Array(arr) {
    this.writeUint32(arr.length);
    this.copyUint8Elements(arr);
  }
  copyUint32Array(arr) {
    this.writeUint32(arr.length);
    this.copyUint32Elements(arr);
  }
  copyInt32Array(arr) {
    this.writeUint32(arr.length);
    this.copyInt32Elements(arr);
  }
  copyFloat32Array(arr) {
    this.writeUint32(arr.length);
    this.copyFloat32Elements(arr);
  }
  copyFloat64Array(arr) {
    this.writeUint32(arr.length);
    this.copyFloat64Elements(arr);
  }
  writeAsciiString(value) {
    const data = this.allocateUint8Array(value.length);
    for (let i = value.length; i-- > 0; ) {
      data[i] = value.charCodeAt(i);
    }
  }
  writeUtf8String(value) {
    const encoder = new TextEncoder();
    const data = encoder.encode(value);
    this.copyUint8Array(data);
  }
};
var Reader = class extends Channel {
  readUint8() {
    const result = this.storageUint8[this.offset8()];
    this.advance8(1);
    return result;
  }
  readUint32() {
    const result = this.storageUint32[this.offset32()];
    this.advance32(1);
    return result;
  }
  readInt32() {
    const result = this.storageInt32[this.offset32()];
    this.advance32(1);
    return result;
  }
  readFloat32() {
    const result = this.storageFloat32[this.offset32()];
    this.advance32(1);
    return result;
  }
  readFloat64() {
    const result = this.storageFloat64[this.offset64()];
    this.advance64(1);
    return result;
  }
  readUint8Elements(length) {
    const start = this.offset8();
    const view = this.storageUint8.subarray(start, start + length);
    this.advance8(length);
    return view;
  }
  readUint32Elements(length) {
    const start = this.offset32();
    const view = this.storageUint32.subarray(start, start + length);
    this.advance32(length);
    return view;
  }
  readInt32Elements(length) {
    const start = this.offset32();
    const view = this.storageInt32.subarray(start, start + length);
    this.advance32(length);
    return view;
  }
  readFloat32Elements(length) {
    const start = this.offset32();
    const view = this.storageFloat32.subarray(start, start + length);
    this.advance32(length);
    return view;
  }
  readFloat64Elements(length) {
    const start = this.offset64();
    const view = this.storageFloat64.subarray(start, start + length);
    this.advance64(length);
    return view;
  }
  readUint8Array() {
    const length = this.readUint32();
    return this.readUint8Elements(length);
  }
  readUint32Array() {
    const length = this.readUint32();
    return this.readUint32Elements(length);
  }
  readInt32Array() {
    const length = this.readUint32();
    return this.readInt32Elements(length);
  }
  readFloat32Array() {
    const length = this.readUint32();
    return this.readFloat32Elements(length);
  }
  readFloat64Array() {
    const length = this.readUint32();
    return this.readFloat64Elements(length);
  }
  readUint8Arrays(count) {
    const result = new Array(count);
    for (let i = 0; i < count; i++) {
      result[i] = this.readUint8Array();
    }
    return result;
  }
  readUint32Arrays(count) {
    const result = new Array(count);
    for (let i = 0; i < count; i++) {
      result[i] = this.readUint32Array();
    }
    return result;
  }
  readInt32Arrays(count) {
    const result = new Array(count);
    for (let i = 0; i < count; i++) {
      result[i] = this.readInt32Array();
    }
    return result;
  }
  readFloat32Arrays(count) {
    const result = new Array(count);
    for (let i = 0; i < count; i++) {
      result[i] = this.readFloat32Array();
    }
    return result;
  }
  readFloat64Arrays(count) {
    const result = new Array(count);
    for (let i = 0; i < count; i++) {
      result[i] = this.readFloat64Array();
    }
    return result;
  }
  readAsciiString() {
    const data = this.readUint8Array();
    return String.fromCharCode(...data);
  }
  readAsciiStrings(count) {
    const results = new Array(count);
    for (let i = 0; i < count; i++) {
      results[i] = this.readAsciiString();
    }
    return results;
  }
  readUtf8String() {
    const data = this.readUint8Array();
    const decoder = new TextDecoder();
    return decoder.decode(data);
  }
  readUtf8Strings(count) {
    const results = new Array(count);
    for (let i = 0; i < count; i++) {
      results[i] = this.readUtf8String();
    }
    return results;
  }
};

// src/constants.ts
var MAX_LOG_SIZE = 1024;
var MAX_ERROR_SIZE = 256;
var DEFAULT_INITIAL_PAGES = 17;

// src/interop.ts
async function createInstance(wasmBuffer, options) {
  const { inputChannelSize, outputChannelSize, initialMemoryPages = DEFAULT_INITIAL_PAGES, log = console.log.bind(console) } = options;
  const memory = new WebAssembly.Memory({ initial: initialMemoryPages });
  const imports = {
    env: {
      memory,
      hostLog: () => {
        hostLog();
      }
    }
  };
  const { instance } = await WebAssembly.instantiate(wasmBuffer, imports);
  const exports = instance.exports;
  const createView = (createFunc) => {
    let buffer;
    let instance2;
    return () => {
      if (instance2 === void 0 || memory.buffer !== buffer) {
        buffer = memory.buffer;
        instance2 = createFunc(buffer);
      }
      return instance2;
    };
  };
  const logPtr = exports.getLogPtr();
  const errPtr = exports.getErrorPtr();
  const inputPtr = exports.allocateInputChannel(inputChannelSize);
  const outputPtr = exports.allocateOutputChannel(outputChannelSize);
  const getBytes = createView((buffer) => new Uint8ClampedArray(buffer));
  const getLogData = createView((buffer) => new Uint8ClampedArray(buffer, logPtr, MAX_LOG_SIZE));
  const getErrorData = createView((buffer) => new Uint8ClampedArray(buffer, errPtr, MAX_ERROR_SIZE));
  const getInputChannel = createView((buffer) => new Writer(buffer, inputPtr, inputChannelSize));
  const getOutputChannel = createView((buffer) => new Reader(buffer, outputPtr, outputChannelSize));
  const hostLog = () => {
    const data = getLogData();
    const length = data.indexOf(0);
    const message = Buffer.from(data.subarray(0, length)).toString("utf8");
    log(message);
  };
  const throwWasmError = (e) => {
    const data = getErrorData();
    const length = data.indexOf(0);
    if (length > 0) {
      const message = Buffer.from(data.subarray(0, length)).toString("utf8");
      throw Error(message);
    } else if (e !== void 0) {
      throw e;
    } else {
      throw Error("Unknown error");
    }
  };
  const handleError = (func) => {
    let result;
    try {
      result = func();
    } catch (e) {
      throwWasmError(e);
    }
    if (result !== 0) {
      throwWasmError();
    }
  };
  const getInput = () => {
    const input = getInputChannel();
    input.reset();
    return input;
  };
  const getOutput = () => {
    const input = getOutputChannel();
    input.reset();
    return input;
  };
  return {
    exports,
    getMemory: () => memory.buffer,
    getSize: () => memory.buffer.byteLength,
    createView,
    getBytes,
    getInput,
    getOutput,
    handleError
  };
}

exports.createInstance = createInstance;
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map