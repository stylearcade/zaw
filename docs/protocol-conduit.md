# `zaw::conduit` Fixed-Buffer Channel Protocol

## 1. Overview

This document specifies a lightweight, zero-allocation binary channel protocol for inter‑language communication over a fixed‑size buffer.

This protocol defines a shared memory layout and read/write semantics enabling zero-allocation data exchange between producers (writers) and consumers (readers). It is suitable for tight coupling between languages such as JavaScript, Zig, or Rust within a single address space.

## 2. Conformance

Implementations that conform to this specification MUST:

1. Provide a contiguous, 8-byte aligned buffer as the backing store for the channel.

2. Expose operations to write and read primitive and array types with correct alignment.

3. Support resetting the read/write cursor.

4. Enforce bounds checks in debug builds.

5. Use separate memory regions for input and output channels.

Implementations MAY:

1. Expose convenience methods to convert Uint8 values to and from strings
2. Support additional primitives.
3. Use language idioms to refer to primitives e.g. `u8` or `Uint8`
4. Specify element types in either comptime parameters or function names aligned with language idioms e.g.
   - OK
     - `writer.writeArray(u8, value)`
     - `writer.writeUint8Array(value)`
   - Not OK
     - `writer.writeArray('u8', value)` (do not use strings)

## 3. Terminology

- **Buffer**: A contiguous block of memory with 8-byte alignment.
- **Writer**: An entity that serializes values into the buffer.
- **Reader**: An entity that deserializes values from the buffer.
- **Offset**: The current byte index within the buffer.
- **Alignment**: Byte boundary alignment required by certain types (e.g., 8‑byte for `Float64`).

## 4. Data Types

The protocol supports the following primitive types:

- `Uint8`: 8-bit unsigned integer, little endian, no alignment.
- `Uint32`: 32‑bit unsigned integer, little‑endian, aligned to 4-byte boundary.
- `Int32`: 32‑bit signed integer, little‑endian, aligned to 4-byte boundary.
- `Float32`: 32‑bit IEEE‑754 floating point, little‑endian, aligned to 4-byte boundary.
- `Float64`: 64‑bit IEEE‑754 floating point, little‑endian, aligned to 8‑byte boundary.

It also supports arrays of these primitives:

- `Uint8[]`
- `Uint32[]`
- `Int32[]`
- `Float32[]`
- `Float64[]`

## 5. Encoding Rules

All multi‑byte values use little‑endian byte order.

### 5.1 Primitive Values

1. **Uint8**: Stored at the current `offset`; `offset` advances by 1.
2. **Uint32 / Int32 / Float32**: `offset` aligned up to 4 bytes, then value stored; `offset` advances by 4.
3. **Float64**: `offset` aligned up to 8 bytes, then value stored; `offset` advances by 8.

### 5.2 Arrays

An array encoding consists of:

1. A length prefix: a `Uint32` indicating element count, aligned to 4 bytes.

2. Raw contiguous element values, with the first element aligned up to 1, 4 or 8 byte boundary as required by the element type.

3. Advance `offset` past the element region.

### 5.3 Elements

"Elements" refers a fixed-length array with no length prefix. An elements encoding consists of:

1. Raw contiguous element values, with the first element aligned up to 1, 4 or 8 byte boundary as required by the element type.

2. Advance `offset` past the element region.

## 6. API Operations

### 6.1 Common

Where `type` is a **primitive type**:

| Operation                | Semantics                                                                          |
| ------------------------ | ---------------------------------------------------------------------------------- |
| `sizeOf(type)`\*         | Returns `1` for `Uint8`, `4` for `Uint32` / `Int32` / `Float32`, `8` for `Float64` |
| `alignTo(type)`\*        | Aligns `offset` up to a multiple of `sizeOf(type)`.                                |
| `advance(type, count)`\* | Advances the offset by `count * sizeOf(type)`.                                     |
| `reset()`                | Set `offset = 0`.                                                                  |

_\*Internal methods - not strictily required as a part of the API, included here to illustrate behaviour and simplify implementations_

### 6.2 Writer

| Operation                 | Semantics                                                                                                 |
| ------------------------- | --------------------------------------------------------------------------------------------------------- |
| `write(type, value)`      | `alignTo(type)`;<br>encode value at `offset`;<br>`advance(type, 1)`.                                      |
| `init(type)`              | `alignTo(type)`;<br>return mutable pointer or setter for `offset`;<br>`advance(type, 1)`.                 |
| `initElements(type, len)` | `alignTo(type)`;<br>return mutable slice of `len` elements starting at `offset`;<br>`advance(type, len)`. |
| `initArray(type, len)`    | `write(Uint32, len)`;<br>return `initElements(type, len)`.                                                |
| `copyElements(type, arr)` | `alignTo(type)`;<br>encode raw elements into storage starting at `offset`;<br>`advance(type, len)`.       |
| `copyArray(type, arr)`    | `write(Uint32, len)`;<br>`copyElements(type, arr)`.                                                       |

### 6.3 Reader

| Operation                 | Semantics                                                                                                                            |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `read(type)`              | `alignTo(type)`;<br>return value at `offset`;<br>`advance(type, 1)`;                                                                 |
| `readArray(type)`         | `len = read(Uint32)`;<br>`alignTo(type)`;<br>return immutable slice of `len` elements starting at `offset`;<br>`advance(type, len)`. |
| `readElements(type, len)` | `alignTo(type)`;<br>return immutable slice of `len` elements starting at `offset`;<br>`advance(type, len)`.                          |
