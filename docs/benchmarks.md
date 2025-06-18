# Benchmarks

```console
  Running on AMD Ryzen 9 3900X 12-Core Processor


 ✓ examples/host-typescript/__tests__/example.bench.ts > Typescript example host > XOR Int32Array @ 10 elements 11869ms
     name                     hz     min     max    mean     p75     p99    p995    p999     rme  samples
   · js            11,511,227.77  0.0001  0.6338  0.0001  0.0001  0.0003  0.0005  0.0008  ±0.77%  5755614   fastest
   · zig            5,644,240.19  0.0001  0.6407  0.0002  0.0002  0.0003  0.0004  0.0009  ±0.62%  2822121
   · rust           5,630,117.80  0.0001  0.8158  0.0002  0.0002  0.0003  0.0004  0.0009  ±0.70%  2817354
   · rust-bindgen   2,902,861.09  0.0003  0.6807  0.0003  0.0003  0.0006  0.0008  0.0018  ±0.56%  1451431   slowest

 ✓ examples/host-typescript/__tests__/example.bench.ts > Typescript example host > XOR Int32Array @ 100 elements 8957ms
     name                    hz     min     max    mean     p75     p99    p995    p999     rme  samples
   · js            4,218,820.87  0.0002  0.6489  0.0002  0.0002  0.0005  0.0006  0.0010  ±0.52%  2109411
   · zig           5,207,776.47  0.0001  0.8167  0.0002  0.0002  0.0004  0.0005  0.0011  ±0.67%  2603890   fastest
   · rust          5,160,011.72  0.0001  0.4687  0.0002  0.0002  0.0004  0.0005  0.0011  ±0.54%  2580006
   · rust-bindgen  2,659,941.96  0.0003  0.2934  0.0004  0.0003  0.0008  0.0010  0.0024  ±0.48%  1329971   slowest

 ✓ examples/host-typescript/__tests__/example.bench.ts > Typescript example host > XOR Int32Array @ 1000 elements 5786ms
     name                    hz     min     max    mean     p75     p99    p995    p999     rme  samples
   · js              648,340.71  0.0014  0.2311  0.0015  0.0015  0.0022  0.0024  0.0164  ±0.30%   324171   slowest
   · zig           3,466,966.86  0.0002  0.5958  0.0003  0.0003  0.0005  0.0006  0.0013  ±0.58%  1733484
   · rust          3,566,155.32  0.0002  0.2859  0.0003  0.0003  0.0004  0.0005  0.0011  ±0.42%  1783078   fastest
   · rust-bindgen  1,380,373.36  0.0006  0.9653  0.0007  0.0006  0.0012  0.0015  0.0136  ±0.91%   690187

 ✓ examples/host-typescript/__tests__/example.bench.ts > Typescript example host > XOR Int32Array @ 10000 elements 3122ms
     name                  hz     min     max    mean     p75     p99    p995    p999     rme  samples
   · js             67,419.27  0.0134  1.6051  0.0148  0.0141  0.0280  0.0374  0.0893  ±0.74%    33710   slowest
   · zig           665,731.52  0.0014  0.2076  0.0015  0.0014  0.0020  0.0022  0.0159  ±0.32%   332866   fastest
   · rust          640,345.20  0.0014  0.5524  0.0016  0.0015  0.0022  0.0024  0.0177  ±0.54%   320173
   · rust-bindgen  254,724.54  0.0036  0.3587  0.0039  0.0038  0.0056  0.0082  0.0319  ±0.41%   127363

 ✓ examples/host-typescript/__tests__/example.bench.ts > Typescript example host > XOR Int32Array @ 100000 elements 2498ms
     name                 hz     min     max    mean     p75     p99    p995    p999     rme  samples
   · js             6,705.40  0.1331  0.7031  0.1491  0.1488  0.2769  0.3389  0.5923  ±0.77%     3353   slowest
   · zig           61,367.17  0.0135  0.6313  0.0163  0.0146  0.0494  0.0676  0.1527  ±0.79%    30684
   · rust          64,797.94  0.0134  0.4324  0.0154  0.0144  0.0335  0.0513  0.1400  ±0.59%    32399   fastest
   · rust-bindgen  26,069.86  0.0335  0.8571  0.0384  0.0359  0.0855  0.1155  0.2488  ±0.78%    13035

 ✓ examples/host-typescript/__tests__/example.bench.ts > Typescript example host > Sum Float64Array @ 10 elements 11624ms
     name                     hz     min     max    mean     p75     p99    p995    p999     rme  samples
   · js            10,969,756.33  0.0001  1.0560  0.0001  0.0001  0.0003  0.0004  0.0008  ±0.66%  5484879   fastest
   · zig            5,624,696.36  0.0001  0.5347  0.0002  0.0002  0.0003  0.0004  0.0010  ±0.57%  2812366
   · rust           5,587,951.88  0.0001  1.0990  0.0002  0.0002  0.0003  0.0004  0.0010  ±0.89%  2793976
   · rust-bindgen   2,708,713.47  0.0003  0.3386  0.0004  0.0003  0.0008  0.0010  0.0023  ±0.52%  1354357   slowest

 ✓ examples/host-typescript/__tests__/example.bench.ts > Typescript example host > Sum Float64Array @ 100 elements 8709ms
     name                    hz     min     max    mean     p75     p99    p995    p999     rme  samples
   · js            4,290,923.33  0.0002  1.4783  0.0002  0.0002  0.0005  0.0007  0.0011  ±0.92%  2145462
   · zig           4,853,764.35  0.0002  0.6633  0.0002  0.0002  0.0003  0.0004  0.0010  ±0.63%  2426883
   · rust          4,912,025.13  0.0002  0.6371  0.0002  0.0002  0.0003  0.0004  0.0010  ±0.69%  2456013   fastest
   · rust-bindgen  2,140,517.29  0.0004  0.4858  0.0005  0.0004  0.0010  0.0012  0.0035  ±0.78%  1070259   slowest

 ✓ examples/host-typescript/__tests__/example.bench.ts > Typescript example host > Sum Float64Array @ 1000 elements 4832ms
     name                    hz     min     max    mean     p75     p99    p995    p999     rme  samples
   · js              600,961.60  0.0014  0.7919  0.0017  0.0016  0.0024  0.0026  0.0330  ±1.05%   300481   slowest
   · zig           2,271,335.06  0.0003  0.5593  0.0004  0.0004  0.0007  0.0009  0.0023  ±0.83%  1135668
   · rust          2,489,891.25  0.0003  0.3546  0.0004  0.0004  0.0006  0.0007  0.0016  ±0.51%  1244946   fastest
   · rust-bindgen    822,514.71  0.0011  0.4270  0.0012  0.0011  0.0017  0.0020  0.0156  ±0.50%   411258

 ✓ examples/host-typescript/__tests__/example.bench.ts > Typescript example host > Sum Float64Array @ 10000 elements 2813ms
     name                  hz     min     max    mean     p75     p99    p995    p999     rme  samples
   · js             66,817.94  0.0135  0.5179  0.0150  0.0139  0.0307  0.0498  0.1075  ±0.54%    33409   slowest
   · zig           354,863.48  0.0025  0.3819  0.0028  0.0027  0.0040  0.0056  0.0258  ±0.43%   177432   fastest
   · rust          353,646.94  0.0025  0.4109  0.0028  0.0026  0.0040  0.0049  0.0276  ±0.44%   176824
   · rust-bindgen  105,437.53  0.0086  0.5203  0.0095  0.0090  0.0227  0.0358  0.1063  ±0.64%    52719

 ✓ examples/host-typescript/__tests__/example.bench.ts > Typescript example host > Sum Float64Array @ 100000 elements 2454ms
     name                 hz     min     max    mean     p75     p99    p995    p999     rme  samples
   · js             6,889.66  0.1340  0.4850  0.1451  0.1460  0.2238  0.2438  0.3347  ±0.46%     3445   slowest
   · zig           32,345.75  0.0269  0.4331  0.0309  0.0290  0.0664  0.0919  0.1957  ±0.57%    16173
   · rust          33,827.99  0.0262  0.4335  0.0296  0.0280  0.0558  0.0755  0.1608  ±0.49%    16914   fastest
   · rust-bindgen  10,524.54  0.0869  1.0149  0.0950  0.0916  0.1911  0.2616  0.4156  ±0.80%     5263

 ✓ examples/host-typescript/__tests__/example.bench.ts > Typescript example host > 4x4 Float32 Matrix Multiplication, batch size 1 4354ms
     name                    hz     min     max    mean     p75     p99    p995    p999     rme  samples
   · js            2,824,193.66  0.0002  7.3881  0.0004  0.0003  0.0012  0.0016  0.0032  ±3.35%  1412097
   ↓ zig [skipped]
   · rust          2,893,899.06  0.0003  0.3013  0.0003  0.0003  0.0008  0.0009  0.0019  ±0.44%  1446950   fastest
   · rust-bindgen    958,847.97  0.0007  1.0247  0.0010  0.0009  0.0027  0.0033  0.0172  ±1.51%   479425   slowest

 ✓ examples/host-typescript/__tests__/example.bench.ts > Typescript example host > 4x4 Float32 Matrix Multiplication, batch size 10 3051ms
     name                    hz     min     max    mean     p75     p99    p995    p999     rme  samples
   · js              333,725.76  0.0020  3.4339  0.0030  0.0027  0.0078  0.0127  0.0889  ±2.21%   166863
   ↓ zig [skipped]
   · rust          2,331,921.94  0.0004  1.4557  0.0004  0.0004  0.0009  0.0010  0.0022  ±0.87%  1165962   fastest
   · rust-bindgen    309,452.59  0.0012  0.9393  0.0032  0.0034  0.0114  0.0241  0.0952  ±1.30%   154727   slowest

 ✓ examples/host-typescript/__tests__/example.bench.ts > Typescript example host > 4x4 Float32 Matrix Multiplication, batch size 100 2241ms
     name                  hz     min     max    mean     p75     p99    p995    p999     rme  samples
   · js             27,794.90  0.0197  1.8288  0.0360  0.0327  0.2148  0.4487  0.9464  ±2.78%    13898   slowest
   ↓ zig [skipped]
   · rust          804,815.70  0.0010  0.8275  0.0012  0.0012  0.0019  0.0022  0.0180  ±0.63%   402408   fastest
   · rust-bindgen  113,270.78  0.0031  9.9288  0.0088  0.0085  0.0344  0.0513  0.1961  ±7.79%    57604

 ✓ examples/host-typescript/__tests__/example.bench.ts > Typescript example host > 4x4 Float32 Matrix Multiplication, batch size 1000 1874ms
     name                  hz     min     max    mean     p75     p99    p995    p999     rme  samples
   · js              2,925.12  0.2045  1.8075  0.3419  0.3491  1.1553  1.2820  1.5434  ±2.88%     1463   slowest
   ↓ zig [skipped]
   · rust          103,041.13  0.0084  1.1079  0.0097  0.0088  0.0234  0.0342  0.1121  ±0.80%    51521   fastest
   · rust-bindgen   14,988.37  0.0228  7.5492  0.0667  0.0713  0.2129  0.3765  5.2584  ±8.32%     7497

 BENCH  Summary

  js - examples/host-typescript/__tests__/example.bench.ts > Typescript example host > XOR Int32Array @ 10 elements
    2.04x faster than zig
    2.04x faster than rust
    3.97x faster than rust-bindgen

  zig - examples/host-typescript/__tests__/example.bench.ts > Typescript example host > XOR Int32Array @ 100 elements
    1.01x faster than rust
    1.23x faster than js
    1.96x faster than rust-bindgen

  rust - examples/host-typescript/__tests__/example.bench.ts > Typescript example host > XOR Int32Array @ 1000 elements
    1.03x faster than zig
    2.58x faster than rust-bindgen
    5.50x faster than js

  zig - examples/host-typescript/__tests__/example.bench.ts > Typescript example host > XOR Int32Array @ 10000 elements
    1.04x faster than rust
    2.61x faster than rust-bindgen
    9.87x faster than js

  rust - examples/host-typescript/__tests__/example.bench.ts > Typescript example host > XOR Int32Array @ 100000 elements
    1.06x faster than zig
    2.49x faster than rust-bindgen
    9.66x faster than js

  js - examples/host-typescript/__tests__/example.bench.ts > Typescript example host > Sum Float64Array @ 10 elements
    1.95x faster than zig
    1.96x faster than rust
    4.05x faster than rust-bindgen

  rust - examples/host-typescript/__tests__/example.bench.ts > Typescript example host > Sum Float64Array @ 100 elements
    1.01x faster than zig
    1.14x faster than js
    2.29x faster than rust-bindgen

  rust - examples/host-typescript/__tests__/example.bench.ts > Typescript example host > Sum Float64Array @ 1000 elements
    1.10x faster than zig
    3.03x faster than rust-bindgen
    4.14x faster than js

  zig - examples/host-typescript/__tests__/example.bench.ts > Typescript example host > Sum Float64Array @ 10000 elements
    1.00x faster than rust
    3.37x faster than rust-bindgen
    5.31x faster than js

  rust - examples/host-typescript/__tests__/example.bench.ts > Typescript example host > Sum Float64Array @ 100000 elements
    1.05x faster than zig
    3.21x faster than rust-bindgen
    4.91x faster than js

  rust - examples/host-typescript/__tests__/example.bench.ts > Typescript example host > 4x4 Float32 Matrix Multiplication, batch size 1
    1.02x faster than js
    3.02x faster than rust-bindgen

  rust - examples/host-typescript/__tests__/example.bench.ts > Typescript example host > 4x4 Float32 Matrix Multiplication, batch size 10
    6.99x faster than js
    7.54x faster than rust-bindgen

  rust - examples/host-typescript/__tests__/example.bench.ts > Typescript example host > 4x4 Float32 Matrix Multiplication, batch size 100
    7.11x faster than rust-bindgen
    28.96x faster than js

  rust - examples/host-typescript/__tests__/example.bench.ts > Typescript example host > 4x4 Float32 Matrix Multiplication, batch size 1000
    6.87x faster than rust-bindgen
    35.23x faster than js
```
