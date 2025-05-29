# Benchmarks

```console
  Running on 12th Gen Intel(R) Core(TM) i7-1255U


 ✓ examples/host-typescript/__tests__/example.bench.ts > Typescript example host > XOR Int32Array @ 10 elements 8359ms
     name                     hz     min     max    mean     p75     p99    p995    p999     rme  samples
   · js            14,446,049.52  0.0001  0.2823  0.0001  0.0001  0.0001  0.0001  0.0002  ±0.36%  7223026   fastest
   · zig            7,510,384.99  0.0001  0.5807  0.0001  0.0001  0.0003  0.0003  0.0004  ±0.60%  3755193
   · wasm-bindgen   3,435,706.44  0.0002  1.8464  0.0003  0.0003  0.0005  0.0005  0.0014  ±0.88%  1717892   slowest

 ✓ examples/host-typescript/__tests__/example.bench.ts > Typescript example host > XOR Int32Array @ 100 elements 5711ms
     name                    hz     min     max    mean     p75     p99    p995    p999     rme  samples
   · js            4,823,281.67  0.0002  0.7207  0.0002  0.0002  0.0004  0.0004  0.0004  ±0.64%  2411641
   · zig           6,911,875.60  0.0001  2.2369  0.0001  0.0001  0.0003  0.0003  0.0004  ±1.19%  3455938   fastest
   · wasm-bindgen  3,195,858.38  0.0002  1.7007  0.0003  0.0003  0.0007  0.0008  0.0015  ±0.93%  1597930   slowest

 ✓ examples/host-typescript/__tests__/example.bench.ts > Typescript example host > XOR Int32Array @ 1000 elements 3521ms
     name                    hz     min     max    mean     p75     p99    p995    p999     rme  samples
   · js              699,050.57  0.0013  1.0135  0.0014  0.0013  0.0029  0.0038  0.0154  ±0.63%   349526   slowest
   · zig           3,910,073.52  0.0002  0.4652  0.0003  0.0002  0.0005  0.0006  0.0009  ±0.55%  1955037   fastest
   · wasm-bindgen  1,565,958.66  0.0005  0.5376  0.0006  0.0006  0.0010  0.0010  0.0074  ±0.72%   782980

 ✓ examples/host-typescript/__tests__/example.bench.ts > Typescript example host > XOR Int32Array @ 10000 elements 2088ms
     name                  hz     min     max    mean     p75     p99    p995    p999     rme  samples
   · js             75,167.60  0.0126  0.2885  0.0133  0.0128  0.0277  0.0415  0.0912  ±0.42%    37584   slowest
   · zig           535,496.75  0.0016  0.7881  0.0019  0.0018  0.0025  0.0036  0.0353  ±0.64%   267749   fastest
   · wasm-bindgen  235,781.19  0.0037  0.6734  0.0042  0.0040  0.0068  0.0137  0.0545  ±0.66%   117891

 ✓ examples/host-typescript/__tests__/example.bench.ts > Typescript example host > XOR Int32Array @ 100000 elements 1852ms
     name                 hz     min     max    mean     p75     p99    p995    p999     rme  samples
   · js             7,467.65  0.1255  0.8896  0.1339  0.1298  0.2843  0.3817  0.4942  ±0.81%     3734   slowest
   · zig           53,299.24  0.0168  0.5055  0.0188  0.0175  0.0479  0.0696  0.1586  ±0.62%    26650   fastest
   · wasm-bindgen  22,553.27  0.0362  0.5318  0.0443  0.0410  0.1381  0.1885  0.3304  ±0.95%    11277

 ✓ examples/host-typescript/__tests__/example.bench.ts > Typescript example host > Sum Float64Array @ 10 elements 8614ms
     name                     hz     min     max    mean     p75     p99    p995    p999     rme  samples
   · js            14,040,477.05  0.0001  0.6284  0.0001  0.0001  0.0001  0.0001  0.0002  ±0.58%  7020239   fastest
   · zig            7,749,742.42  0.0001  0.6677  0.0001  0.0001  0.0003  0.0003  0.0004  ±0.58%  3874872
   · wasm-bindgen   3,608,100.92  0.0002  0.3507  0.0003  0.0003  0.0004  0.0005  0.0011  ±0.62%  1804051   slowest

 ✓ examples/host-typescript/__tests__/example.bench.ts > Typescript example host > Sum Float64Array @ 100 elements 6005ms
     name                    hz     min     max    mean     p75     p99    p995    p999     rme  samples
   · js            4,614,936.05  0.0002  0.4012  0.0002  0.0002  0.0004  0.0004  0.0006  ±0.55%  2307469
   · zig           6,897,361.18  0.0001  0.3398  0.0001  0.0001  0.0003  0.0003  0.0004  ±0.51%  3448725   fastest
   · wasm-bindgen  2,945,751.25  0.0003  0.3606  0.0003  0.0003  0.0006  0.0006  0.0014  ±0.59%  1472876   slowest

 ✓ examples/host-typescript/__tests__/example.bench.ts > Typescript example host > Sum Float64Array @ 1000 elements 3086ms
     name                    hz     min     max    mean     p75     p99    p995    p999     rme  samples
   · js              661,288.72  0.0013  0.4635  0.0015  0.0014  0.0029  0.0032  0.0246  ±0.52%   330645   slowest
   · zig           2,943,709.74  0.0003  0.3538  0.0003  0.0003  0.0004  0.0007  0.0010  ±0.61%  1471896   fastest
   · wasm-bindgen    983,916.00  0.0009  0.4561  0.0010  0.0010  0.0017  0.0022  0.0108  ±0.44%   491996

 ✓ examples/host-typescript/__tests__/example.bench.ts > Typescript example host > Sum Float64Array @ 10000 elements 1961ms
     name                  hz     min     max    mean     p75     p99    p995    p999     rme  samples
   · js             75,422.88  0.0126  1.3126  0.0133  0.0127  0.0254  0.0303  0.0799  ±0.64%    37712   slowest
   · zig           273,184.94  0.0033  0.6442  0.0037  0.0034  0.0078  0.0132  0.0426  ±0.62%   136593   fastest
   · wasm-bindgen  114,354.55  0.0080  0.5940  0.0087  0.0084  0.0180  0.0226  0.0678  ±0.47%    57178

 ✓ examples/host-typescript/__tests__/example.bench.ts > Typescript example host > Sum Float64Array @ 100000 elements 1826ms
     name                 hz     min     max    mean     p75     p99    p995    p999     rme  samples
   · js             7,502.81  0.1254  0.5530  0.1333  0.1319  0.2264  0.2840  0.4701  ±0.59%     3752   slowest
   · zig           21,704.62  0.0408  2.3660  0.0461  0.0436  0.1031  0.1462  0.2800  ±1.20%    10853   fastest
   · wasm-bindgen  10,271.86  0.0890  0.4556  0.0974  0.0941  0.1932  0.2131  0.3053  ±0.57%     5136

 ✓ examples/host-typescript/__tests__/example.bench.ts > Typescript example host > 4x4 Float32 Matrix Multiplication, batch size 1 2716ms
     name                    hz     min     max    mean     p75     p99    p995    p999     rme  samples
   · js            3,690,929.32  0.0002  1.7702  0.0003  0.0002  0.0005  0.0007  0.0019  ±1.00%  1845465   fastest
   · wasm-bindgen  1,258,825.48  0.0006  2.0021  0.0008  0.0007  0.0012  0.0017  0.0159  ±2.56%   629413

 ✓ examples/host-typescript/__tests__/example.bench.ts > Typescript example host > 4x4 Float32 Matrix Multiplication, batch size 10 1536ms
     name                  hz     min     max    mean     p75     p99    p995    p999     rme  samples
   · js            488,645.20  0.0015  0.9284  0.0020  0.0018  0.0032  0.0047  0.0520  ±1.33%   244323   fastest
   · wasm-bindgen  487,149.14  0.0009  2.0632  0.0021  0.0020  0.0151  0.0173  0.0477  ±1.87%   243575

 ✓ examples/host-typescript/__tests__/example.bench.ts > Typescript example host > 4x4 Float32 Matrix Multiplication, batch size 100 1311ms
     name                  hz     min     max    mean     p75     p99    p995    p999     rme  samples
   · js             53,782.82  0.0138  1.2348  0.0186  0.0172  0.0533  0.1847  0.3807  ±1.65%    26892
   · wasm-bindgen  233,039.65  0.0028  0.8947  0.0043  0.0034  0.0233  0.0295  0.0621  ±1.20%   116520   fastest

 ✓ examples/host-typescript/__tests__/example.bench.ts > Typescript example host > 4x4 Float32 Matrix Multiplication, batch size 1000 1218ms
     name                 hz     min     max    mean     p75     p99    p995    p999     rme  samples
   · js             5,655.93  0.1409  0.8849  0.1768  0.1670  0.5400  0.5623  0.6792  ±1.59%     2828
   · wasm-bindgen  33,428.74  0.0224  1.0736  0.0299  0.0260  0.1036  0.1754  0.5569  ±1.52%    16715   fastest

 BENCH  Summary

  js - examples/host-typescript/__tests__/example.bench.ts > Typescript example host > XOR Int32Array @ 10 elements
    1.92x faster than zig
    4.20x faster than wasm-bindgen

  zig - examples/host-typescript/__tests__/example.bench.ts > Typescript example host > XOR Int32Array @ 100 elements
    1.43x faster than js
    2.16x faster than wasm-bindgen

  zig - examples/host-typescript/__tests__/example.bench.ts > Typescript example host > XOR Int32Array @ 1000 elements
    2.50x faster than wasm-bindgen
    5.59x faster than js

  zig - examples/host-typescript/__tests__/example.bench.ts > Typescript example host > XOR Int32Array @ 10000 elements
    2.27x faster than wasm-bindgen
    7.12x faster than js

  zig - examples/host-typescript/__tests__/example.bench.ts > Typescript example host > XOR Int32Array @ 100000 elements
    2.36x faster than wasm-bindgen
    7.14x faster than js

  js - examples/host-typescript/__tests__/example.bench.ts > Typescript example host > Sum Float64Array @ 10 elements
    1.81x faster than zig
    3.89x faster than wasm-bindgen

  zig - examples/host-typescript/__tests__/example.bench.ts > Typescript example host > Sum Float64Array @ 100 elements
    1.49x faster than js
    2.34x faster than wasm-bindgen

  zig - examples/host-typescript/__tests__/example.bench.ts > Typescript example host > Sum Float64Array @ 1000 elements
    2.99x faster than wasm-bindgen
    4.45x faster than js

  zig - examples/host-typescript/__tests__/example.bench.ts > Typescript example host > Sum Float64Array @ 10000 elements
    2.39x faster than wasm-bindgen
    3.62x faster than js

  zig - examples/host-typescript/__tests__/example.bench.ts > Typescript example host > Sum Float64Array @ 100000 elements
    2.11x faster than wasm-bindgen
    2.89x faster than js

  js - examples/host-typescript/__tests__/example.bench.ts > Typescript example host > 4x4 Float32 Matrix Multiplication, batch size 1
    2.93x faster than wasm-bindgen

  js - examples/host-typescript/__tests__/example.bench.ts > Typescript example host > 4x4 Float32 Matrix Multiplication, batch size 10
    1.00x faster than wasm-bindgen

  wasm-bindgen - examples/host-typescript/__tests__/example.bench.ts > Typescript example host > 4x4 Float32 Matrix Multiplication, batch size 100
    4.33x faster than js

  wasm-bindgen - examples/host-typescript/__tests__/example.bench.ts > Typescript example host > 4x4 Float32 Matrix Multiplication, batch size 1000
    5.91x faster than js
```
