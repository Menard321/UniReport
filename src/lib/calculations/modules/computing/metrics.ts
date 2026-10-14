import { CalculationResult, FormulaCalculator } from "../../types";

export const bigOEstimator: FormulaCalculator = (inputs, assumptions = []) => {
  const n = inputs.datasetSize || 100000; // Elements
  const cpuCyclesPerOp = inputs.cpuCyclesPerOp || 10;
  const cpuFrequencyGhz = inputs.cpuFrequencyGhz || 2.5;

  // Compare O(N), O(N log N), O(N^2)
  const opsLinear = n;
  const opsLogLinear = n * Math.log2(n);
  const opsQuadratic = Math.pow(n, 2);

  const timeLinearMs = (opsLinear * cpuCyclesPerOp) / (cpuFrequencyGhz * 1e9) * 1000;
  const timeLogLinearMs = (opsLogLinear * cpuCyclesPerOp) / (cpuFrequencyGhz * 1e9) * 1000;
  const timeQuadraticSec = (opsQuadratic * cpuCyclesPerOp) / (cpuFrequencyGhz * 1e9);

  return {
    calculationId: `calc-bigo-${Date.now()}`,
    module: "computing/metrics",
    formulaCode: "BIG_O_ESTIMATOR",
    formulaName: "Algorithmic Time Complexity Growth & CPU Latency Sizing",
    discipline: "computing-it",
    latexEquation: "T(n) = \\frac{\\mathcal{O}(f(n)) \\cdot Cycles}{f_{CPU}}",
    inputs: {
      datasetSize: { key: "datasetSize", label: "Input Cardinality (N)", value: n, unit: "records" },
      cpuFrequencyGhz: { key: "cpuFrequencyGhz", label: "Processor Core Clock (f_CPU)", value: cpuFrequencyGhz, unit: "GHz" }
    },
    assumptions: [
      "Single-threaded CPU execution without SIMD vectorization.",
      "Uniform average-case instruction distribution.",
      ...assumptions
    ],
    intermediateSteps: [
      { stepNumber: 1, description: "Calculate O(N) linear operations", equation: `N = ${n.toLocaleString()}`, evaluated: `${timeLinearMs.toFixed(3)} ms` },
      { stepNumber: 2, description: "Calculate O(N log2 N) operations", equation: `${n.toLocaleString()} * log2(${n.toLocaleString()})`, evaluated: `${timeLogLinearMs.toFixed(2)} ms` },
      { stepNumber: 3, description: "Calculate O(N²) worst-case quadratic operations", equation: `(${n.toLocaleString()})²`, evaluated: `${timeQuadraticSec.toFixed(1)} seconds` }
    ],
    output: {
      value: Number(timeLogLinearMs.toFixed(2)),
      formatted: `O(N log N): ${timeLogLinearMs.toFixed(2)} ms (vs O(N): ${timeLinearMs.toFixed(2)} ms, O(N²): ${timeQuadraticSec.toFixed(1)}s)`,
      unit: "ms",
      interpretation: `For N = ${n.toLocaleString()}, an optimal O(N log N) algorithm processes in ${timeLogLinearMs.toFixed(2)} ms, avoiding catastrophic O(N²) quadratic scaling (${timeQuadraticSec.toFixed(1)}s).`
    },
    validationStatus: "VALID",
    professionalDisclaimer: "Asymptotic computational efficiency modeling for software engineering reports.",
    timestamp: new Date().toISOString()
  };
};

export const bandwidthSizing: FormulaCalculator = (inputs, assumptions = []) => {
  const concurrentUsers = inputs.concurrentUsers || 500;
  const avgPayloadKb = inputs.avgPayloadKb || 120; // 120 KB per request
  const requestsPerMinute = inputs.requestsPerMinute || 6; // Requests per user per min

  const totalReqPerSec = (concurrentUsers * requestsPerMinute) / 60;
  const throughputKbps = totalReqPerSec * avgPayloadKb * 8;
  const throughputMbps = throughputKbps / 1000;
  // Apply 30% peak burst buffer
  const peakBandwidthMbps = throughputMbps * 1.30;

  return {
    calculationId: `calc-bandwidth-${Date.now()}`,
    module: "computing/metrics",
    formulaCode: "BANDWIDTH_SIZING",
    formulaName: "Network Throughput & Concurrent User Bandwidth Sizing",
    discipline: "computing-it",
    latexEquation: "BW_{peak} = 1.30 \\cdot \\left[\\frac{Users \\cdot RPM}{60} \\cdot Payload \\cdot 8\\right]",
    inputs: {
      concurrentUsers: { key: "concurrentUsers", label: "Concurrent Active Users", value: concurrentUsers, unit: "users" },
      avgPayloadKb: { key: "avgPayloadKb", label: "Average API/Page Payload", value: avgPayloadKb, unit: "KB" },
      requestsPerMinute: { key: "requestsPerMinute", label: "User Interaction Velocity", value: requestsPerMinute, unit: "req/min" }
    },
    assumptions: [
      "TCP/IP and TLS header overhead included in average payload.",
      "30% peak-to-average traffic multiplier for bursty traffic.",
      ...assumptions
    ],
    intermediateSteps: [
      { stepNumber: 1, description: "Calculate aggregate request throughput (RPS)", equation: `(${concurrentUsers} * ${requestsPerMinute}) / 60`, evaluated: `${totalReqPerSec.toFixed(1)} req/sec` },
      { stepNumber: 2, description: "Calculate sustained bit rate", equation: `${totalReqPerSec.toFixed(1)} * ${avgPayloadKb} KB * 8`, evaluated: `${throughputMbps.toFixed(2)} Mbps` },
      { stepNumber: 3, description: "Add 30% peak buffer", equation: `${throughputMbps.toFixed(2)} Mbps * 1.30`, evaluated: `${peakBandwidthMbps.toFixed(2)} Mbps` }
    ],
    output: {
      value: Number(peakBandwidthMbps.toFixed(2)),
      formatted: `${peakBandwidthMbps.toFixed(2)} Mbps (${Math.round(totalReqPerSec)} RPS sustained, ${throughputMbps.toFixed(2)} Mbps base)`,
      unit: "Mbps",
      interpretation: `Infrastructure must provision at least ${peakBandwidthMbps.toFixed(1)} Mbps dedicated uplink to comfortably support ${concurrentUsers} concurrent users without buffering.`
    },
    validationStatus: "VALID",
    professionalDisclaimer: "Infrastructure capacity planning for IT & computer engineering systems.",
    timestamp: new Date().toISOString()
  };
};

export const dbStorageEstimator: FormulaCalculator = (inputs, assumptions = []) => {
  const records = inputs.records || 500000; // 500,000 rows
  const bytesPerRow = inputs.bytesPerRow || 350; // bytes
  const indexOverheadPercent = inputs.indexOverheadPercent || 35; // 35% index overhead
  const annualGrowthPercent = inputs.annualGrowthPercent || 25; // 25% annual growth

  const rawDataMb = (records * bytesPerRow) / (1024 * 1024);
  const totalStorageMb = rawDataMb * (1 + indexOverheadPercent / 100);
  const year2StorageMb = totalStorageMb * (1 + annualGrowthPercent / 100);

  return {
    calculationId: `calc-db-${Date.now()}`,
    module: "computing/metrics",
    formulaCode: "DB_STORAGE_ESTIMATOR",
    formulaName: "Relational Database Table & Index Storage Capacity Sizing",
    discipline: "computing-it",
    latexEquation: "Storage = \\frac{Rows \\cdot Bytes_{row}}{1024^2} \\cdot (1 + Index\\%)",
    inputs: {
      records: { key: "records", label: "Initial Estimated Table Rows", value: records, unit: "rows" },
      bytesPerRow: { key: "bytesPerRow", label: "Average Row Width (Schema columns)", value: bytesPerRow, unit: "bytes" },
      indexOverheadPercent: { key: "indexOverheadPercent", label: "B-Tree Index Sizing Allowance", value: indexOverheadPercent, unit: "%" }
    },
    assumptions: [
      "PostgreSQL / MySQL InnoDB 16KB page fill factor of 80% to allow page splits.",
      "WAL and transaction logs provisioned on separate high-speed NVMe storage.",
      ...assumptions
    ],
    intermediateSteps: [
      { stepNumber: 1, description: "Calculate raw data size (Rows * Bytes/row)", equation: `(${records.toLocaleString()} * ${bytesPerRow}) / 1024²`, evaluated: `${rawDataMb.toFixed(1)} MB` },
      { stepNumber: 2, description: "Add B-tree index overhead", equation: `${rawDataMb.toFixed(1)} * 1.${indexOverheadPercent}`, evaluated: `${totalStorageMb.toFixed(1)} MB` },
      { stepNumber: 3, description: "Project Year-2 storage at 25% growth", equation: `${totalStorageMb.toFixed(1)} * 1.${annualGrowthPercent}`, evaluated: `${year2StorageMb.toFixed(1)} MB` }
    ],
    output: {
      value: Number(totalStorageMb.toFixed(1)),
      formatted: `${totalStorageMb.toFixed(1)} MB (${(totalStorageMb / 1024).toFixed(2)} GB, Year-2: ${(year2StorageMb / 1024).toFixed(2)} GB)`,
      unit: "MB",
      interpretation: `Database table with ${records.toLocaleString()} rows requires ${totalStorageMb.toFixed(1)} MB disk space including B-tree indexing.`
    },
    validationStatus: "VALID",
    professionalDisclaimer: "Database capacity estimation for computer science architecture.",
    timestamp: new Date().toISOString()
  };
};
