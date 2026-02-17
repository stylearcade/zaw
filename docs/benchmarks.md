# Benchmarks

```console
Running on AMD Ryzen 9 9950X3D 16-Core Processor

 ✓ examples/host-typescript/__tests__/example.bench.ts > Typescript example host > XOR Int32Array @ 10 elements 7628ms
     name                     hz     min     max    mean     p75     p99    p995    p999     rme  samples
   · js            17,681,821.08  0.0000  0.4823  0.0001  0.0001  0.0001  0.0002  0.0003  ±0.54%  8840911   fastest
   · zig           10,596,261.87  0.0001  0.8279  0.0001  0.0001  0.0001  0.0002  0.0003  ±0.47%  5298131
   · rust          10,647,196.94  0.0001  0.0977  0.0001  0.0001  0.0001  0.0002  0.0003  ±0.17%  5323599
   · rust-bindgen   7,511,733.31  0.0001  4.1542  0.0001  0.0001  0.0002  0.0002  0.0005  ±1.69%  3755867   slowest

 ✓ examples/host-typescript/__tests__/example.bench.ts > Typescript example host > XOR Int32Array @ 100 elements 5367ms
     name                    hz     min     max    mean     p75     p99    p995    p999     rme  samples
   · js            1,631,622.42  0.0002  8.1147  0.0006  0.0005  0.0038  0.0051  0.0140  ±3.43%   815813
   · zig           9,785,143.82  0.0001  0.0854  0.0001  0.0001  0.0001  0.0001  0.0003  ±0.16%  4892572
   · rust          9,831,208.13  0.0001  1.0151  0.0001  0.0001  0.0001  0.0002  0.0003  ±0.43%  4915605   fastest
   · rust-bindgen  1,584,821.62  0.0003  0.5330  0.0006  0.0006  0.0030  0.0049  0.0148  ±0.70%   792411   slowest

 ✓ examples/host-typescript/__tests__/example.bench.ts > Typescript example host > XOR Int32Array @ 1000 elements 4039ms
     name                    hz     min     max    mean     p75     p99    p995    p999     rme  samples
   · js              539,915.19  0.0012  0.6530  0.0019  0.0016  0.0106  0.0180  0.0333  ±0.99%   269958   slowest
   · zig           5,233,622.84  0.0002  0.0541  0.0002  0.0002  0.0002  0.0002  0.0004  ±0.11%  2616812
   · rust          6,150,536.15  0.0001  0.0567  0.0002  0.0002  0.0002  0.0002  0.0003  ±0.13%  3075269   fastest
   · rust-bindgen    893,865.28  0.0004  0.7503  0.0011  0.0008  0.0085  0.0194  0.0320  ±1.57%   446933

 ✓ examples/host-typescript/__tests__/example.bench.ts > Typescript example host > XOR Int32Array @ 10000 elements 2787ms
     name                  hz     min     max    mean     p75     p99    p995    p999     rme  samples
   · js             73,132.92  0.0118  0.8483  0.0137  0.0128  0.0252  0.0330  0.4694  ±1.47%    36567   slowest
   · zig           725,371.65  0.0013  0.0594  0.0014  0.0014  0.0016  0.0018  0.0122  ±0.13%   362686
   · rust          935,915.16  0.0009  0.1006  0.0011  0.0010  0.0014  0.0015  0.0091  ±0.14%   467958   fastest
   · rust-bindgen  282,039.20  0.0023  0.5287  0.0035  0.0032  0.0135  0.0217  0.1234  ±0.82%   141020

 ✓ examples/host-typescript/__tests__/example.bench.ts > Typescript example host > XOR Int32Array @ 100000 elements 2453ms
     name                  hz     min     max    mean     p75     p99    p995    p999     rme  samples
   · js              7,628.23  0.1194  0.7511  0.1311  0.1287  0.2927  0.3208  0.4150  ±0.68%     3815   slowest
   · zig            76,081.08  0.0125  0.3103  0.0131  0.0129  0.0247  0.0265  0.0361  ±0.20%    38041
   · rust          104,868.29  0.0089  0.0751  0.0095  0.0094  0.0166  0.0222  0.0268  ±0.15%    52435   fastest
   · rust-bindgen   24,278.83  0.0245  0.4438  0.0412  0.0333  0.2567  0.2886  0.3606  ±1.55%    12140

 ✓ examples/host-typescript/__tests__/example.bench.ts > Typescript example host > Transfer In Float64Array @ 10 elements 8211ms
     name                     hz     min     max    mean     p75     p99    p995    p999     rme   samples
   · zig           16,541,551.54  0.0000  0.2486  0.0001  0.0001  0.0001  0.0001  0.0002  ±0.18%   8270776
   · rust          16,528,150.55  0.0000  0.1874  0.0001  0.0001  0.0001  0.0001  0.0001  ±0.15%   8264076   slowest
   · rust-bindgen  20,230,511.47  0.0000  0.0484  0.0000  0.0001  0.0001  0.0001  0.0001  ±0.13%  10115256   fastest

 ✓ examples/host-typescript/__tests__/example.bench.ts > Typescript example host > Transfer In Float64Array @ 100 elements 7351ms
     name                     hz     min     max    mean     p75     p99    p995    p999     rme  samples
   · zig           15,739,457.87  0.0000  0.0564  0.0001  0.0001  0.0001  0.0001  0.0001  ±0.12%  7869729
   · rust          15,122,144.22  0.0001  0.0548  0.0001  0.0001  0.0001  0.0001  0.0001  ±0.12%  7561073   slowest
   · rust-bindgen  18,041,133.82  0.0000  0.2844  0.0001  0.0001  0.0001  0.0001  0.0001  ±0.17%  9020567   fastest

 ✓ examples/host-typescript/__tests__/example.bench.ts > Typescript example host > Transfer In Float64Array @ 1000 elements 5529ms
     name                     hz     min     max    mean     p75     p99    p995    p999     rme  samples
   · zig           11,100,846.51  0.0001  0.0766  0.0001  0.0001  0.0001  0.0001  0.0002  ±0.14%  5550424
   · rust          10,851,118.33  0.0001  0.0551  0.0001  0.0001  0.0001  0.0001  0.0002  ±0.12%  5425560   slowest
   · rust-bindgen  12,707,079.19  0.0001  0.0943  0.0001  0.0001  0.0001  0.0001  0.0002  ±0.13%  6353540   fastest

 ✓ examples/host-typescript/__tests__/example.bench.ts > Typescript example host > Transfer In Float64Array @ 10000 elements 2422ms
     name                    hz     min     max    mean     p75     p99    p995    p999     rme  samples
   · zig           1,377,612.34  0.0005  0.1602  0.0007  0.0007  0.0009  0.0010  0.0014  ±0.14%   688807
   · rust          1,376,485.98  0.0006  0.0469  0.0007  0.0007  0.0009  0.0010  0.0015  ±0.14%   688243   slowest
   · rust-bindgen  1,418,789.63  0.0005  0.0598  0.0007  0.0007  0.0008  0.0009  0.0013  ±0.13%   709395   fastest

 ✓ examples/host-typescript/__tests__/example.bench.ts > Typescript example host > Transfer In Float64Array @ 100000 elements 1867ms
     name                  hz     min     max    mean     p75     p99    p995    p999     rme  samples
   · zig           100,539.70  0.0093  0.8980  0.0099  0.0098  0.0172  0.0218  0.0276  ±0.37%    50270   slowest
   · rust          110,570.93  0.0083  0.0627  0.0090  0.0090  0.0129  0.0209  0.0259  ±0.12%    55286   fastest
   · rust-bindgen  102,028.37  0.0094  0.0706  0.0098  0.0097  0.0173  0.0215  0.0234  ±0.12%    51015

 ✓ examples/host-typescript/__tests__/example.bench.ts > Typescript example host > Transfer Out Float64Array @ 10 elements 5699ms
     name                     hz     min     max    mean     p75     p99    p995    p999     rme  samples
   · zig           14,792,295.08  0.0001  0.0873  0.0001  0.0001  0.0001  0.0001  0.0001  ±0.15%  7396148   fastest
   · rust          13,880,599.14  0.0001  0.0694  0.0001  0.0001  0.0001  0.0001  0.0001  ±0.14%  6940300
   · rust-bindgen   3,418,123.98  0.0002  0.7484  0.0003  0.0003  0.0007  0.0009  0.0013  ±0.75%  1709063   slowest

 ✓ examples/host-typescript/__tests__/example.bench.ts > Typescript example host > Transfer Out Float64Array @ 100 elements 4903ms
     name                     hz     min     max    mean     p75     p99    p995    p999     rme  samples
   · zig           12,987,267.14  0.0001  1.2251  0.0001  0.0001  0.0001  0.0001  0.0002  ±0.50%  6493634   fastest
   · rust          12,620,639.12  0.0001  0.9185  0.0001  0.0001  0.0001  0.0001  0.0002  ±0.39%  6310320
   · rust-bindgen   1,800,382.71  0.0002  0.7431  0.0006  0.0005  0.0028  0.0045  0.0125  ±0.55%   900193   slowest

 ✓ examples/host-typescript/__tests__/example.bench.ts > Typescript example host > Transfer Out Float64Array @ 1000 elements 3296ms
     name                    hz     min     max    mean     p75     p99    p995    p999     rme  samples
   · zig           5,897,550.62  0.0002  0.0776  0.0002  0.0002  0.0002  0.0002  0.0003  ±0.13%  2948776   fastest
   · rust          5,683,808.07  0.0002  0.0657  0.0002  0.0002  0.0002  0.0002  0.0004  ±0.24%  2841905
   · rust-bindgen  1,007,642.92  0.0004  0.4360  0.0010  0.0008  0.0062  0.0109  0.0306  ±0.98%   503822   slowest

 ✓ examples/host-typescript/__tests__/example.bench.ts > Typescript example host > Transfer Out Float64Array @ 10000 elements 2127ms
     name                  hz     min     max    mean     p75     p99    p995    p999     rme  samples
   · zig           927,767.60  0.0010  0.0502  0.0011  0.0010  0.0014  0.0015  0.0084  ±0.11%   463884
   · rust          961,160.84  0.0010  0.0311  0.0010  0.0010  0.0011  0.0012  0.0085  ±0.11%   480581   fastest
   · rust-bindgen  223,487.26  0.0022  0.4238  0.0045  0.0035  0.0221  0.0353  0.1837  ±1.39%   111744   slowest

 ✓ examples/host-typescript/__tests__/example.bench.ts > Typescript example host > Transfer Out Float64Array @ 100000 elements 1847ms
     name                  hz     min     max    mean     p75     p99    p995    p999     rme  samples
   · zig            97,299.61  0.0092  0.0569  0.0103  0.0122  0.0170  0.0207  0.0243  ±0.16%    48650
   · rust          107,323.73  0.0091  0.0574  0.0093  0.0092  0.0105  0.0209  0.0248  ±0.11%    53662   fastest
   · rust-bindgen   10,081.37  0.0252  0.9288  0.0992  0.1261  0.4535  0.5056  0.8618  ±2.48%     5041   slowest

 ✓ examples/host-typescript/__tests__/example.bench.ts > Typescript example host > 4x4 Float32 Matrix Multiplication, batch size 1 6565ms
     name                     hz     min      max    mean     p75     p99    p995    p999     rme  samples
   · js             8,155,387.01  0.0001  17.8623  0.0001  0.0001  0.0002  0.0003  0.0005  ±7.01%  4077694
   · zig            9,090,194.13  0.0001   0.0779  0.0001  0.0001  0.0001  0.0001  0.0002  ±0.23%  4545098
   · rust          10,009,841.62  0.0001   0.1044  0.0001  0.0001  0.0001  0.0001  0.0002  ±0.19%  5004921   fastest
   · rust-bindgen   6,867,095.67  0.0001   0.2253  0.0001  0.0001  0.0002  0.0002  0.0003  ±0.16%  3433548   slowest

 ✓ examples/host-typescript/__tests__/example.bench.ts > Typescript example host > 4x4 Float32 Matrix Multiplication, batch size 10 4541ms
     name                    hz     min     max    mean     p75     p99    p995    p999     rme  samples
   · js            1,152,619.65  0.0007  0.4994  0.0009  0.0008  0.0012  0.0013  0.0123  ±0.65%   576310   slowest
   · zig           6,819,842.99  0.0001  0.0681  0.0001  0.0001  0.0002  0.0002  0.0002  ±0.13%  3409922
   · rust          7,169,431.78  0.0001  1.1743  0.0001  0.0001  0.0002  0.0002  0.0003  ±0.48%  3584716   fastest
   · rust-bindgen  1,782,123.85  0.0003  0.3381  0.0006  0.0005  0.0020  0.0024  0.0104  ±0.43%   891064

 ✓ examples/host-typescript/__tests__/example.bench.ts > Typescript example host > 4x4 Float32 Matrix Multiplication, batch size 100 3168ms
     name                    hz     min     max    mean     p75     p99    p995    p999     rme  samples
   · js              122,710.34  0.0071  0.3692  0.0081  0.0077  0.0187  0.0514  0.0883  ±0.58%    61356   slowest
   · zig           2,458,829.45  0.0004  0.0588  0.0004  0.0004  0.0006  0.0006  0.0008  ±0.12%  1229415   fastest
   · rust          2,338,433.26  0.0004  0.0514  0.0004  0.0004  0.0005  0.0006  0.0077  ±0.23%  1169217
   · rust-bindgen    814,315.97  0.0007  0.4091  0.0012  0.0010  0.0061  0.0124  0.0327  ±0.82%   407158

 ✓ examples/host-typescript/__tests__/example.bench.ts > Typescript example host > 4x4 Float32 Matrix Multiplication, batch size 1000 2537ms
     name                  hz     min     max    mean     p75     p99    p995    p999     rme  samples
   · js             12,174.55  0.0725  0.4675  0.0821  0.0755  0.1820  0.1868  0.2330  ±0.69%     6088   slowest
   · zig           296,433.30  0.0031  0.0525  0.0034  0.0033  0.0038  0.0178  0.0255  ±0.23%   148217   fastest
   · rust          283,318.86  0.0033  0.0502  0.0035  0.0035  0.0038  0.0040  0.0146  ±0.11%   141660
   · rust-bindgen  170,188.81  0.0047  0.4516  0.0059  0.0055  0.0185  0.0268  0.1480  ±0.85%    85095

 BENCH  Summary

  js - examples/host-typescript/__tests__/example.bench.ts > Typescript example host > XOR Int32Array @ 10 elements
    1.66x faster than rust
    1.67x faster than zig
    2.35x faster than rust-bindgen

  rust - examples/host-typescript/__tests__/example.bench.ts > Typescript example host > XOR Int32Array @ 100 elements
    1.00x faster than zig
    6.03x faster than js
    6.20x faster than rust-bindgen

  rust - examples/host-typescript/__tests__/example.bench.ts > Typescript example host > XOR Int32Array @ 1000 elements
    1.18x faster than zig
    6.88x faster than rust-bindgen
    11.39x faster than js

  rust - examples/host-typescript/__tests__/example.bench.ts > Typescript example host > XOR Int32Array @ 10000 elements
    1.29x faster than zig
    3.32x faster than rust-bindgen
    12.80x faster than js

  rust - examples/host-typescript/__tests__/example.bench.ts > Typescript example host > XOR Int32Array @ 100000 elements
    1.38x faster than zig
    4.32x faster than rust-bindgen
    13.75x faster than js

  rust-bindgen - examples/host-typescript/__tests__/example.bench.ts > Typescript example host > Transfer In Float64Array @ 10 elements
    1.22x faster than zig
    1.22x faster than rust

  rust-bindgen - examples/host-typescript/__tests__/example.bench.ts > Typescript example host > Transfer In Float64Array @ 100 elements
    1.15x faster than zig
    1.19x faster than rust

  rust-bindgen - examples/host-typescript/__tests__/example.bench.ts > Typescript example host > Transfer In Float64Array @ 1000 elements
    1.14x faster than zig
    1.17x faster than rust

  rust-bindgen - examples/host-typescript/__tests__/example.bench.ts > Typescript example host > Transfer In Float64Array @ 10000 elements
    1.03x faster than zig
    1.03x faster than rust

  rust - examples/host-typescript/__tests__/example.bench.ts > Typescript example host > Transfer In Float64Array @ 100000 elements
    1.08x faster than rust-bindgen
    1.10x faster than zig

  zig - examples/host-typescript/__tests__/example.bench.ts > Typescript example host > Transfer Out Float64Array @ 10 elements
    1.07x faster than rust
    4.33x faster than rust-bindgen

  zig - examples/host-typescript/__tests__/example.bench.ts > Typescript example host > Transfer Out Float64Array @ 100 elements
    1.03x faster than rust
    7.21x faster than rust-bindgen

  zig - examples/host-typescript/__tests__/example.bench.ts > Typescript example host > Transfer Out Float64Array @ 1000 elements
    1.04x faster than rust
    5.85x faster than rust-bindgen

  rust - examples/host-typescript/__tests__/example.bench.ts > Typescript example host > Transfer Out Float64Array @ 10000 elements
    1.04x faster than zig
    4.30x faster than rust-bindgen

  rust - examples/host-typescript/__tests__/example.bench.ts > Typescript example host > Transfer Out Float64Array @ 100000 elements
    1.10x faster than zig
    10.65x faster than rust-bindgen

  rust - examples/host-typescript/__tests__/example.bench.ts > Typescript example host > 4x4 Float32 Matrix Multiplication, batch size 1
    1.10x faster than zig
    1.23x faster than js
    1.46x faster than rust-bindgen

  rust - examples/host-typescript/__tests__/example.bench.ts > Typescript example host > 4x4 Float32 Matrix Multiplication, batch size 10
    1.05x faster than zig
    4.02x faster than rust-bindgen
    6.22x faster than js

  zig - examples/host-typescript/__tests__/example.bench.ts > Typescript example host > 4x4 Float32 Matrix Multiplication, batch size 100
    1.05x faster than rust
    3.02x faster than rust-bindgen
    20.04x faster than js

  zig - examples/host-typescript/__tests__/example.bench.ts > Typescript example host > 4x4 Float32 Matrix Multiplication, batch size 1000
    1.05x faster than rust
    1.74x faster than rust-bindgen
    24.35x faster than js
```
