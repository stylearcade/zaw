# `zaw::interop` WASM <> Host Interop Protocol

## 1. Overview

This document specifies how the [Fixed-Buffer Channel](channel.md) can be incorporated into a WASM module, in addition to "batteries-included" features for logging and error handling.

## 2. Conformance

Implementations **MUST**:

1. Use the Fixed‑Buffer Channel memory layout (8‑byte aligned buffer) for both input and output channels, allocating separate regions for each.

2. Export the Protocol Methods (Section 4).

3. Reserve two static regions in linear memory for error and log message.:

4. Follow the error/log workflow defined in Section 6.

## 3. Terminology

- **Module**: The WebAssembly module implementing accelerated logic.
- **Host**: The environment initializing and interacting with the Module.
- **Input Channel**: The shared memory region used to transfer method arguments from the WASM Host to the WASM Module, using a Channel Writer on the Host side and a Channel Reader on the Module side.
- **Output Channel**: The shared memory region used to transfer return data from the WASM Module to the WASM Host, using a Channel Writer on the Module side and a Channel Reader on the Host side.
- **Error Region**: A static, 256-byte region of Module memory for null-terminated error messages.
- **Log Region**: A static, 1024-byte region of Module memory for null-terminated log messages.

## 4. Protocol Methods (WASM Exports)

| Method Signature                                     | Details                                                                                                                                               |
| ---------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `allocateInputChannel(sizeInBytes: Int32) => Int32`  | - Allocates a block of memory of the desired size <br> - Constructs a Channel Reader <br> - Returns an integer pointer to the allocated memory region |
| `allocateOutputChannel(sizeInBytes: Int32) => Int32` | - Allocates a block of memory of the desired size <br> - Constructs a Channel Writer <br> - Returns an integer pointer to the allocated memory region |
| `getErrorPtr() => Int32`                             | - Returns a pointer to a 256-byte, static region in memory used to store null-terminated error messages                                               |
| `getLogPtr() => Int32`                               | - Returns a pointer to a 1024-byte, static region in memory used to store null-terminated log messages                                                |

## 5. WASM Host Requirements

1. **Initialization**: During startup, hosts **MUST**:
   - Call `allocateInputChannel` with the desired size, retain the returned pointer, slice a buffer view from the WASM memory and construct a Channel Writer.
   - Call `allocateOutputChannel` with the desired size and retain the returned pointer, slice a buffer view from the WASM memory and construct a Channel Writer.
2. **Channel Binding**: hosts **MUST** maintain freshly bound Channels:
   - If `memory.grow()` is invoked, the backing storage of any Channel Readers or Writers will become stale, however the pointers returned by `allocateInputChannel` and `allocateOutputChannel` will remain valid due to the lineary memory model of WebAssembly
   - In this scenario, hosts **MUST** rebind any buffer views (using the previously returned pointers) and replace or refresh any Channels with the new buffer views.
   - Hosts **MUST NOT** call `allocateInputChannel` or `allocateOutputChannel` again.
3. **Calling conventions**:
   - Before invoking a module function, the host must fetch a fresh `Channel Writer` and write any input arguments
   - After execution, check the return code:
     - `0` (`OK`): Fetch a fresh `Channel Reader` and read output data from output channel.
     - `1` (`ERROR`): Call `getErrorPtr()` and read a null‑terminated string to retrieve the error message; propagate or throw.
   - If execution fails (`panic`):
     - Call `getErrorPtr()` and read a null‑terminated string to retrieve the error message; propagate or throw.
4. **Import definitions**:
   - Expose a `hostLog()` external method that uses `getLogPtr()` to read a null-terminated log message and print to console / stdout

## 6. WASM Module Logging & Error Flows

1. **On Success**:

   - Module writes 0 on the host-visible return.

   - Error Region is set to a single null byte ("\0").

2. **On Error**:

   - Module writes 1 on return.

   - Module writes a null‑terminated error message into the Error Region.

3. **On Panic**:

   - Module traps or returns a special panic code (e.g., 2), then writes message in Error Region.

4. **Logging**:

   - Module may log messages at any time by writing into the Log Region and then invoking the imported `log()` hook.
