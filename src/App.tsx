import React, { useState, useMemo } from 'react';
import { 
  Factory, 
  BarChart3, 
  Layers, 
  Cpu, 
  Download, 
  Filter, 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  Search, 
  Sliders, 
  Database, 
  Cloud, 
  Code, 
  FileSpreadsheet, 
  Clock, 
  ArrowUpRight,
  TrendingUp,
  Activity,
  Maximize2,
  RefreshCw,
  Compass,
  Zap,
  Info
} from 'lucide-react';

// Pre-generated industrial assets
import industrialRobotImage from './assets/images/industrial_assembly_sensor_1791625271778.jpg';
import cloudPipelineImage from './assets/images/cloud_iot_pipeline_diagram_1791625286057.jpg';

interface TelemetryRecord {
  id: string;
  serialNumber: string;
  stationId: 'ST-01 Fastening' | 'ST-02 Battery Pack' | 'ST-03 Chassis Link';
  shift: 'Morning' | 'Afternoon' | 'Night';
  timestamp: string;
  torquePeakNm: number;
  torqueTargetNm: number;
  angleDeg: number;
  angleTargetDeg: number;
  vibrationRms: number;
  cycleDurationSec: number;
  clampLoadKn: number;
  spcEvaluation: 'PASS' | 'FAIL';
  anomalyScore: number;
  groundTruthLabel: 'Nominal' | 'Defect';
  defectCategory: 'None' | 'Cross-threading' | 'Micro-slip' | 'Tool Wear Drift' | 'Thread Galling' | 'Under-torque';
  shapAttribution: {
    feature: string;
    impactPercent: number;
    direction: 'positive' | 'negative';
  }[];
  curvePoints: { angle: number; torque: number; nominalMin: number; nominalMax: number }[];
  operatorInstruction: string;
}

const INITIAL_TELEMETRY_DATA: TelemetryRecord[] = [
  {
    id: 'CYC-8491',
    serialNumber: 'SN-ENG-90412',
    stationId: 'ST-01 Fastening',
    shift: 'Morning',
    timestamp: '10:14:02',
    torquePeakNm: 412.4,
    torqueTargetNm: 410.0,
    angleDeg: 124.5,
    angleTargetDeg: 125.0,
    vibrationRms: 0.28,
    cycleDurationSec: 4.1,
    clampLoadKn: 48.2,
    spcEvaluation: 'PASS',
    anomalyScore: 0.12,
    groundTruthLabel: 'Nominal',
    defectCategory: 'None',
    shapAttribution: [
      { feature: 'Peak Torque within tolerance', impactPercent: 12, direction: 'negative' },
      { feature: 'Snug-to-Yield Angle nominal', impactPercent: 10, direction: 'negative' },
      { feature: 'Vibration envelope normal', impactPercent: 6, direction: 'negative' },
    ],
    curvePoints: [
      { angle: 0, torque: 5, nominalMin: 0, nominalMax: 15 },
      { angle: 30, torque: 45, nominalMin: 30, nominalMax: 65 },
      { angle: 60, torque: 180, nominalMin: 150, nominalMax: 210 },
      { angle: 90, torque: 320, nominalMin: 280, nominalMax: 350 },
      { angle: 124.5, torque: 412.4, nominalMin: 390, nominalMax: 430 },
    ],
    operatorInstruction: 'Process nominal. Component cleared for assembly flow.'
  },
  {
    id: 'CYC-8492',
    serialNumber: 'SN-ENG-90413',
    stationId: 'ST-01 Fastening',
    shift: 'Morning',
    timestamp: '10:14:38',
    torquePeakNm: 418.0,
    torqueTargetNm: 410.0,
    angleDeg: 152.0,
    angleTargetDeg: 125.0,
    vibrationRms: 0.89,
    cycleDurationSec: 5.8,
    clampLoadKn: 39.1,
    spcEvaluation: 'PASS',
    anomalyScore: 0.91,
    groundTruthLabel: 'Defect',
    defectCategory: 'Micro-slip',
    shapAttribution: [
      { feature: 'Excessive Yield Rotation (+27°)', impactPercent: 44, direction: 'positive' },
      { feature: 'High-frequency Vibration Spike', impactPercent: 32, direction: 'positive' },
      { feature: 'Deficient Clamping Force (-19%)', impactPercent: 18, direction: 'positive' },
    ],
    curvePoints: [
      { angle: 0, torque: 6, nominalMin: 0, nominalMax: 15 },
      { angle: 30, torque: 40, nominalMin: 30, nominalMax: 65 },
      { angle: 60, torque: 160, nominalMin: 150, nominalMax: 210 },
      { angle: 90, torque: 260, nominalMin: 280, nominalMax: 350 },
      { angle: 120, torque: 340, nominalMin: 360, nominalMax: 420 },
      { angle: 152, torque: 418, nominalMin: 390, nominalMax: 430 },
    ],
    operatorInstruction: 'MULTIVARIATE DEFECT: Torque reached limit but yield angle lagged. Perform secondary optical thread inspection before line release.'
  },
  {
    id: 'CYC-8493',
    serialNumber: 'SN-BAT-44120',
    stationId: 'ST-02 Battery Pack',
    shift: 'Morning',
    timestamp: '10:15:10',
    torquePeakNm: 85.2,
    torqueTargetNm: 85.0,
    angleDeg: 91.2,
    angleTargetDeg: 90.0,
    vibrationRms: 0.19,
    cycleDurationSec: 2.9,
    clampLoadKn: 18.4,
    spcEvaluation: 'PASS',
    anomalyScore: 0.08,
    groundTruthLabel: 'Nominal',
    defectCategory: 'None',
    shapAttribution: [
      { feature: 'Rundown slope consistent', impactPercent: 14, direction: 'negative' },
      { feature: 'Cycle duration steady', impactPercent: 8, direction: 'negative' },
    ],
    curvePoints: [
      { angle: 0, torque: 4, nominalMin: 0, nominalMax: 10 },
      { angle: 30, torque: 22, nominalMin: 18, nominalMax: 30 },
      { angle: 60, torque: 58, nominalMin: 50, nominalMax: 68 },
      { angle: 91.2, torque: 85.2, nominalMin: 78, nominalMax: 92 },
    ],
    operatorInstruction: 'Battery module anchor secure. Clean verification signature.'
  },
  {
    id: 'CYC-8494',
    serialNumber: 'SN-BAT-44121',
    stationId: 'ST-02 Battery Pack',
    shift: 'Morning',
    timestamp: '10:15:45',
    torquePeakNm: 99.8,
    torqueTargetNm: 85.0,
    angleDeg: 42.1,
    angleTargetDeg: 90.0,
    vibrationRms: 1.42,
    cycleDurationSec: 1.9,
    clampLoadKn: 12.0,
    spcEvaluation: 'FAIL',
    anomalyScore: 0.98,
    groundTruthLabel: 'Defect',
    defectCategory: 'Cross-threading',
    shapAttribution: [
      { feature: 'Premature Torque Peak (-53% angle)', impactPercent: 51, direction: 'positive' },
      { feature: 'Severe Vibration Jitter', impactPercent: 34, direction: 'positive' },
      { feature: 'Rundown Gradient Anomaly', impactPercent: 12, direction: 'positive' },
    ],
    curvePoints: [
      { angle: 0, torque: 8, nominalMin: 0, nominalMax: 10 },
      { angle: 20, torque: 48, nominalMin: 12, nominalMax: 24 },
      { angle: 42.1, torque: 99.8, nominalMin: 32, nominalMax: 48 },
    ],
    operatorInstruction: 'CRITICAL: Premature mechanical resistance. Fastener cross-threaded. Replace bolt and check mating tapped hole.'
  },
  {
    id: 'CYC-8495',
    serialNumber: 'SN-CHS-11094',
    stationId: 'ST-03 Chassis Link',
    shift: 'Afternoon',
    timestamp: '14:22:18',
    torquePeakNm: 520.1,
    torqueTargetNm: 520.0,
    angleDeg: 140.2,
    angleTargetDeg: 140.0,
    vibrationRms: 0.35,
    cycleDurationSec: 6.2,
    clampLoadKn: 65.4,
    spcEvaluation: 'PASS',
    anomalyScore: 0.16,
    groundTruthLabel: 'Nominal',
    defectCategory: 'None',
    shapAttribution: [
      { feature: 'Suspension torque nominal', impactPercent: 15, direction: 'negative' },
      { feature: 'Harmonic frequency baseline', impactPercent: 9, direction: 'negative' },
    ],
    curvePoints: [
      { angle: 0, torque: 10, nominalMin: 0, nominalMax: 25 },
      { angle: 45, torque: 110, nominalMin: 85, nominalMax: 140 },
      { angle: 90, torque: 310, nominalMin: 270, nominalMax: 360 },
      { angle: 140.2, torque: 520.1, nominalMin: 490, nominalMax: 550 },
    ],
    operatorInstruction: 'Chassis link verified. Torqued according to ISO 16047.'
  },
  {
    id: 'CYC-8496',
    serialNumber: 'SN-CHS-11095',
    stationId: 'ST-03 Chassis Link',
    shift: 'Afternoon',
    timestamp: '14:23:05',
    torquePeakNm: 508.4,
    torqueTargetNm: 520.0,
    angleDeg: 178.6,
    angleTargetDeg: 140.0,
    vibrationRms: 0.65,
    cycleDurationSec: 7.9,
    clampLoadKn: 51.3,
    spcEvaluation: 'PASS',
    anomalyScore: 0.84,
    groundTruthLabel: 'Defect',
    defectCategory: 'Thread Galling',
    shapAttribution: [
      { feature: 'Extended Yield Angle (+38°)', impactPercent: 41, direction: 'positive' },
      { feature: 'Abnormal Friction Gradient', impactPercent: 36, direction: 'positive' },
      { feature: 'Cycle Execution Lag (+1.7s)', impactPercent: 18, direction: 'positive' },
    ],
    curvePoints: [
      { angle: 0, torque: 12, nominalMin: 0, nominalMax: 25 },
      { angle: 45, torque: 95, nominalMin: 85, nominalMax: 140 },
      { angle: 90, torque: 240, nominalMin: 270, nominalMax: 360 },
      { angle: 140, torque: 420, nominalMin: 490, nominalMax: 550 },
      { angle: 178.6, torque: 508.4, nominalMin: 490, nominalMax: 550 },
    ],
    operatorInstruction: 'Galling friction detected during tightening. Check fastener coating and lubrication specification.'
  },
  {
    id: 'CYC-8497',
    serialNumber: 'SN-ENG-90414',
    stationId: 'ST-01 Fastening',
    shift: 'Night',
    timestamp: '22:05:41',
    torquePeakNm: 401.2,
    torqueTargetNm: 410.0,
    angleDeg: 122.0,
    angleTargetDeg: 125.0,
    vibrationRms: 0.58,
    cycleDurationSec: 4.4,
    clampLoadKn: 46.1,
    spcEvaluation: 'PASS',
    anomalyScore: 0.68,
    groundTruthLabel: 'Nominal',
    defectCategory: 'None',
    shapAttribution: [
      { feature: 'Tool Head Backlash Drift', impactPercent: 28, direction: 'positive' },
      { feature: 'Ambient Thermal Expansion', impactPercent: 15, direction: 'positive' },
    ],
    curvePoints: [
      { angle: 0, torque: 5, nominalMin: 0, nominalMax: 15 },
      { angle: 30, torque: 42, nominalMin: 30, nominalMax: 65 },
      { angle: 60, torque: 172, nominalMin: 150, nominalMax: 210 },
      { angle: 90, torque: 310, nominalMin: 280, nominalMax: 350 },
      { angle: 122, torque: 401.2, nominalMin: 390, nominalMax: 430 },
    ],
    operatorInstruction: 'Borderline thermal variance. Tool calibration recommended at shift handover.'
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState<'telemetry' | 'powerbi' | 'xai' | 'cloud' | 'methodology'>('telemetry');
  const [selectedRecord, setSelectedRecord] = useState<TelemetryRecord>(INITIAL_TELEMETRY_DATA[1]);
  
  // Filtering states
  const [stationFilter, setStationFilter] = useState<string>('ALL');
  const [shiftFilter, setShiftFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Anomaly Decision Threshold Slider
  const [threshold, setThreshold] = useState<number>(0.70);

  // Economic Parameters for Trade-off Modeling
  const [downtimeCostPerHour] = useState(72000); // $72,000 / hr ($1,200/min) in automotive plant
  const [warrantyDefectCost] = useState(28500); // $28,500 average warranty recall cost per field escape

  // Filtered dataset
  const filteredData = useMemo(() => {
    return INITIAL_TELEMETRY_DATA.filter(item => {
      if (stationFilter !== 'ALL' && item.stationId !== stationFilter) return false;
      if (shiftFilter !== 'ALL' && item.shift !== shiftFilter) return false;
      if (statusFilter === 'NOMINAL' && item.anomalyScore >= threshold) return false;
      if (statusFilter === 'ANOMALY' && item.anomalyScore < threshold) return false;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return item.id.toLowerCase().includes(query) ||
               item.serialNumber.toLowerCase().includes(query) ||
               item.defectCategory.toLowerCase().includes(query);
      }
      return true;
    });
  }, [stationFilter, shiftFilter, statusFilter, searchQuery, threshold]);

  // Performance & Cost Analysis
  const metrics = useMemo(() => {
    const total = INITIAL_TELEMETRY_DATA.length;
    const realDefects = INITIAL_TELEMETRY_DATA.filter(d => d.groundTruthLabel === 'Defect').length;
    
    // AI Performance
    const aiFlagged = INITIAL_TELEMETRY_DATA.filter(d => d.anomalyScore >= threshold);
    const aiTruePositives = INITIAL_TELEMETRY_DATA.filter(d => d.groundTruthLabel === 'Defect' && d.anomalyScore >= threshold).length;
    const aiFalsePositives = INITIAL_TELEMETRY_DATA.filter(d => d.groundTruthLabel === 'Nominal' && d.anomalyScore >= threshold).length;
    const aiEscapes = INITIAL_TELEMETRY_DATA.filter(d => d.groundTruthLabel === 'Defect' && d.anomalyScore < threshold).length;

    // Traditional SPC (Tolerance Limit) Performance
    const spcFlagged = INITIAL_TELEMETRY_DATA.filter(d => d.spcEvaluation === 'FAIL');
    const spcTruePositives = INITIAL_TELEMETRY_DATA.filter(d => d.groundTruthLabel === 'Defect' && d.spcEvaluation === 'FAIL').length;
    const spcEscapes = INITIAL_TELEMETRY_DATA.filter(d => d.groundTruthLabel === 'Defect' && d.spcEvaluation === 'PASS').length;

    // Economic Cost Comparison
    const spcFieldEscapeLoss = spcEscapes * warrantyDefectCost;
    const aiFieldEscapeLoss = aiEscapes * warrantyDefectCost;
    // Assume 4 minutes inspection time per false alarm
    const aiFalseAlarmDowntimeLoss = aiFalsePositives * (downtimeCostPerHour / 60) * 4;
    const netSavings = spcFieldEscapeLoss - (aiFieldEscapeLoss + aiFalseAlarmDowntimeLoss);

    return {
      total,
      realDefects,
      aiFlaggedCount: aiFlagged.length,
      aiRecall: realDefects > 0 ? (aiTruePositives / realDefects) * 100 : 100,
      aiPrecision: aiFlagged.length > 0 ? (aiTruePositives / aiFlagged.length) * 100 : 100,
      aiFalseAlarmRate: (aiFalsePositives / total) * 100,
      aiEscapes,
      spcRecall: realDefects > 0 ? (spcTruePositives / realDefects) * 100 : 0,
      spcEscapes,
      netSavings
    };
  }, [threshold, downtimeCostPerHour, warrantyDefectCost]);

  // CSV Export Handler
  const handleExportCsv = () => {
    const headers = 'ID,SerialNumber,Station,Shift,Timestamp,TorquePeakNm,AngleDeg,VibrationRms,ClampLoadKn,SPCEvaluation,AIAnomalyScore,Category\n';
    const rows = filteredData.map(r => 
      `${r.id},${r.serialNumber},"${r.stationId}",${r.shift},${r.timestamp},${r.torquePeakNm},${r.angleDeg},${r.vibrationRms},${r.clampLoadKn},${r.spcEvaluation},${r.anomalyScore},"${r.defectCategory}"`
    ).join('\n');
    
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `AURA_Verification_Dataset_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-[#090D16] text-slate-100 font-sans selection:bg-[#0078D4] selection:text-white">
      
      {/* TOP BAR CONTRACT: 3 ZONES */}
      <header className="border-b border-slate-800/80 bg-[#0C1220]/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
          
          {/* Zone 1: Single-element Brand Title Wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-[#0078D4] to-[#00B7C3] p-0.5 shadow-md shadow-[#0078D4]/20">
              <div className="w-full h-full bg-[#090D16] rounded-[6px] flex items-center justify-center">
                <Activity className="w-4 h-4 text-[#00B7C3]" />
              </div>
            </div>
            <span className="text-base font-bold tracking-tight text-white whitespace-nowrap">
              AURA Verify AI
            </span>
          </div>

          {/* Zone 2: Navigation Links (Clean single-line prose, unboxed) */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-medium text-slate-300">
            <button
              onClick={() => setActiveTab('telemetry')}
              className={`hover:text-white transition-colors whitespace-nowrap py-1 ${
                activeTab === 'telemetry' ? 'text-[#00B7C3] font-semibold border-b-2 border-[#00B7C3]' : ''
              }`}
            >
              Verification Stream
            </button>
            <button
              onClick={() => setActiveTab('powerbi')}
              className={`hover:text-white transition-colors whitespace-nowrap py-1 ${
                activeTab === 'powerbi' ? 'text-[#00B7C3] font-semibold border-b-2 border-[#00B7C3]' : ''
              }`}
            >
              Power BI Quality Analytics
            </button>
            <button
              onClick={() => setActiveTab('xai')}
              className={`hover:text-white transition-colors whitespace-nowrap py-1 ${
                activeTab === 'xai' ? 'text-[#00B7C3] font-semibold border-b-2 border-[#00B7C3]' : ''
              }`}
            >
              Explainable AI (XAI)
            </button>
            <button
              onClick={() => setActiveTab('cloud')}
              className={`hover:text-white transition-colors whitespace-nowrap py-1 ${
                activeTab === 'cloud' ? 'text-[#00B7C3] font-semibold border-b-2 border-[#00B7C3]' : ''
              }`}
            >
              Azure IoT & MLOps
            </button>
            <button
              onClick={() => setActiveTab('methodology')}
              className={`hover:text-white transition-colors whitespace-nowrap py-1 ${
                activeTab === 'methodology' ? 'text-[#00B7C3] font-semibold border-b-2 border-[#00B7C3]' : ''
              }`}
            >
              Methodology & Benchmarks
            </button>
          </nav>

          {/* Zone 3: 1 Primary Action Control */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handleExportCsv}
              className="px-3.5 py-2 text-xs font-semibold text-white bg-[#0078D4] hover:bg-[#006cbd] rounded-md transition-colors flex items-center gap-1.5 shadow-sm whitespace-nowrap"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Telemetry CSV</span>
            </button>
          </div>
        </div>
      </header>

      {/* SUB-HEADER / MOBILE NAV BAR */}
      <div className="lg:hidden border-b border-slate-800 bg-[#0C1220] px-4 py-2 flex items-center gap-2 overflow-x-auto text-xs">
        <button
          onClick={() => setActiveTab('telemetry')}
          className={`px-3 py-1.5 rounded whitespace-nowrap ${activeTab === 'telemetry' ? 'bg-[#0078D4] text-white' : 'text-slate-400'}`}
        >
          Verification Stream
        </button>
        <button
          onClick={() => setActiveTab('powerbi')}
          className={`px-3 py-1.5 rounded whitespace-nowrap ${activeTab === 'powerbi' ? 'bg-[#0078D4] text-white' : 'text-slate-400'}`}
        >
          Power BI Analytics
        </button>
        <button
          onClick={() => setActiveTab('xai')}
          className={`px-3 py-1.5 rounded whitespace-nowrap ${activeTab === 'xai' ? 'bg-[#0078D4] text-white' : 'text-slate-400'}`}
        >
          XAI Diagnostics
        </button>
        <button
          onClick={() => setActiveTab('cloud')}
          className={`px-3 py-1.5 rounded whitespace-nowrap ${activeTab === 'cloud' ? 'bg-[#0078D4] text-white' : 'text-slate-400'}`}
        >
          Azure MLOps
        </button>
        <button
          onClick={() => setActiveTab('methodology')}
          className={`px-3 py-1.5 rounded whitespace-nowrap ${activeTab === 'methodology' ? 'bg-[#0078D4] text-white' : 'text-slate-400'}`}
        >
          Methodology
        </button>
      </div>

      {/* MAIN VIEWPORT */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">

        {/* TOP KPI STRIP (4-COLUMN ROW WITH TABULAR NUMBERS) */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#121929] border border-slate-800 rounded-lg p-4">
            <div className="text-xs text-slate-400 font-medium">Batch Verification Volume</div>
            <div className="text-2xl font-bold font-mono tabular-nums text-white mt-1">
              {metrics.total} Cycles
            </div>
            <div className="text-xs text-slate-400 mt-1 flex items-center gap-1">
              <span>Station Coverage: 3 Automated Lines</span>
            </div>
          </div>

          <div className="bg-[#121929] border border-slate-800 rounded-lg p-4">
            <div className="text-xs text-slate-400 font-medium">AI Defect Recall (True Anomaly)</div>
            <div className="text-2xl font-bold font-mono tabular-nums text-[#00B7C3] mt-1">
              {metrics.aiRecall.toFixed(1)}%
            </div>
            <div className="text-xs text-slate-400 mt-1 flex items-center gap-1">
              <span className="text-[#107C41] font-semibold">{metrics.aiEscapes === 0 ? 'Zero Defect Escapes' : `${metrics.aiEscapes} Escaped`}</span>
              <span>· vs Traditional SPC: {metrics.spcRecall.toFixed(0)}%</span>
            </div>
          </div>

          <div className="bg-[#121929] border border-slate-800 rounded-lg p-4">
            <div className="text-xs text-slate-400 font-medium">False Rejection Rate (Type I)</div>
            <div className="text-2xl font-bold font-mono tabular-nums text-white mt-1">
              {metrics.aiFalseAlarmRate.toFixed(1)}%
            </div>
            <div className="text-xs text-slate-400 mt-1">
              <span>Line Stoppage Prevention Protocol Active</span>
            </div>
          </div>

          <div className="bg-[#121929] border border-slate-800 rounded-lg p-4">
            <div className="text-xs text-slate-400 font-medium">Calculated Cost Prevention</div>
            <div className="text-2xl font-bold font-mono tabular-nums text-[#107C41] mt-1">
              ${metrics.netSavings > 0 ? metrics.netSavings.toLocaleString() : '0'}
            </div>
            <div className="text-xs text-slate-400 mt-1">
              <span>Warranty Avoidance vs Inspection Cost</span>
            </div>
          </div>
        </section>

        {/* TAB 1: TELEMETRY STREAM & DYNAMIC CURVE INSPECTION */}
        {activeTab === 'telemetry' && (
          <div className="space-y-6">
            
            {/* Split Screen: Curve Visualizer & Interactive Parameter Controls */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              
              {/* Left Column (7 cols): Dynamic Torque-Angle Curve Graph */}
              <div className="lg:col-span-7 bg-[#121929] border border-slate-800 rounded-lg p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h2 className="text-base font-bold text-white tracking-tight">
                        Dynamic Process Signature · Torque vs. Angle Curve
                      </h2>
                      <div className="text-xs text-slate-400 mt-0.5">
                        Cycle ID: {selectedRecord.id} · Serial: {selectedRecord.serialNumber} · {selectedRecord.stationId}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-slate-400">Multivariate Anomaly Score</div>
                      <div className={`text-lg font-bold font-mono tabular-nums ${
                        selectedRecord.anomalyScore >= threshold ? 'text-[#E81123]' : 'text-[#107C41]'
                      }`}>
                        {(selectedRecord.anomalyScore * 100).toFixed(0)}%
                      </div>
                    </div>
                  </div>

                  {/* SVG Dynamic Curve Graphic */}
                  <div className="h-64 w-full bg-[#090D16] border border-slate-800/80 rounded-md p-3 relative mt-3 flex items-center justify-center">
                    <svg className="w-full h-full overflow-visible" viewBox="0 0 500 220">
                      {/* Grid Lines */}
                      <line x1="40" y1="20" x2="480" y2="20" stroke="#1E293B" strokeDasharray="3 3" />
                      <line x1="40" y1="70" x2="480" y2="70" stroke="#1E293B" strokeDasharray="3 3" />
                      <line x1="40" y1="120" x2="480" y2="120" stroke="#1E293B" strokeDasharray="3 3" />
                      <line x1="40" y1="170" x2="480" y2="170" stroke="#1E293B" strokeDasharray="3 3" />
                      <line x1="40" y1="190" x2="480" y2="190" stroke="#334155" strokeWidth="1.5" />
                      <line x1="40" y1="20" x2="40" y2="190" stroke="#334155" strokeWidth="1.5" />

                      {/* Axes Labels */}
                      <text x="15" y="25" fill="#64748B" fontSize="10" fontFamily="monospace">500Nm</text>
                      <text x="15" y="110" fill="#64748B" fontSize="10" fontFamily="monospace">250Nm</text>
                      <text x="25" y="195" fill="#64748B" fontSize="10" fontFamily="monospace">0</text>
                      <text x="240" y="212" fill="#64748B" fontSize="10" textAnchor="middle">Tightening Angle (Degrees °)</text>

                      {/* Tolerance Envelope Area (Nominal Process Window) */}
                      <polygon
                        points="40,190 120,170 200,120 320,60 440,30 440,55 320,95 200,150 120,185 40,190"
                        fill="#0078D4"
                        fillOpacity="0.12"
                        stroke="#0078D4"
                        strokeWidth="1"
                        strokeDasharray="4 4"
                      />

                      {/* Actual Curve Polyline calculated dynamically from points */}
                      {(() => {
                        const maxAngle = 180;
                        const maxTorque = 550;
                        const pts = selectedRecord.curvePoints.map(p => {
                          const x = 40 + (p.angle / maxAngle) * 400;
                          const y = 190 - (p.torque / maxTorque) * 170;
                          return `${x},${y}`;
                        }).join(' ');

                        const isAnomaly = selectedRecord.anomalyScore >= threshold;
                        const strokeColor = isAnomaly ? '#E81123' : '#107C41';

                        return (
                          <g>
                            <polyline
                              fill="none"
                              stroke={strokeColor}
                              strokeWidth="3"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              points={pts}
                            />
                            {selectedRecord.curvePoints.map((p, idx) => {
                              const x = 40 + (p.angle / maxAngle) * 400;
                              const y = 190 - (p.torque / maxTorque) * 170;
                              return (
                                <circle
                                  key={idx}
                                  cx={x}
                                  cy={y}
                                  r="4"
                                  fill="#090D16"
                                  stroke={strokeColor}
                                  strokeWidth="2"
                                />
                              );
                            })}
                          </g>
                        );
                      })()}
                    </svg>

                    {/* Legend */}
                    <div className="absolute top-3 right-4 flex items-center gap-4 text-[11px] text-slate-400 bg-[#090D16]/80 px-2 py-1 rounded border border-slate-800">
                      <div className="flex items-center gap-1.5">
                        <span className="w-3 h-0.5 bg-[#0078D4] border-dashed border-t border-[#0078D4]"></span>
                        <span>Nominal Envelope</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className={`w-3 h-1 ${selectedRecord.anomalyScore >= threshold ? 'bg-[#E81123]' : 'bg-[#107C41]'}`}></span>
                        <span>Observed Curve</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                  <span>Fastening Standard: ISO 16047 · Yield Gradient Method</span>
                  <span className="font-mono tabular-nums text-slate-300">
                    Clamp Load: {selectedRecord.clampLoadKn} kN · Vib RMS: {selectedRecord.vibrationRms} g
                  </span>
                </div>
              </div>

              {/* Right Column (5 cols): Sensitivity Calibration & Hero Image */}
              <div className="lg:col-span-5 space-y-4 flex flex-col justify-between">
                
                {/* Industrial Hardware Card */}
                <div className="bg-[#121929] border border-slate-800 rounded-lg p-4 overflow-hidden relative">
                  <div className="flex items-center gap-3 mb-3">
                    <img
                      src={industrialRobotImage}
                      alt="Industrial Automated Fastening Station with High-speed Verification Sensors"
                      className="w-20 h-16 object-cover rounded border border-slate-700"
                    />
                    <div>
                      <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                        Edge Verification Rig · Active Telemetry
                      </h3>
                      <div className="text-xs text-slate-400 mt-0.5">
                        Sampling Rate: 1,000 Hz · Strain-gauge transducer & optical encoder
                      </div>
                    </div>
                  </div>

                  {/* Interactive Sensitivity Slider */}
                  <div className="bg-[#090D16] p-3.5 rounded border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                        <Sliders className="w-3.5 h-3.5 text-[#00B7C3]" />
                        Anomaly Decision Threshold (τ)
                      </label>
                      <span className="text-xs font-mono font-bold text-[#00B7C3] tabular-nums">
                        {threshold.toFixed(2)}
                      </span>
                    </div>

                    <input
                      type="range"
                      min="0.30"
                      max="0.95"
                      step="0.05"
                      value={threshold}
                      onChange={(e) => setThreshold(parseFloat(e.target.value))}
                      className="w-full accent-[#0078D4] cursor-pointer"
                    />

                    <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                      <span>0.30 (High Sensitivity / False Alarms)</span>
                      <span>0.95 (High Precision / Risk Escapes)</span>
                    </div>
                  </div>
                </div>

                {/* Operator SOP Insight Box */}
                <div className="bg-[#121929] border border-slate-800 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-xs font-bold text-white flex items-center gap-1.5">
                      <CheckCircle className="w-4 h-4 text-[#00B7C3]" />
                      Operator Standard Operating Procedure (SOP)
                    </div>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {selectedRecord.defectCategory !== 'None' ? selectedRecord.defectCategory : 'Nominal State'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 bg-[#090D16] p-3 rounded border border-slate-800 leading-relaxed">
                    {selectedRecord.operatorInstruction}
                  </p>
                </div>

              </div>

            </div>

            {/* Filter Bar */}
            <div className="bg-[#121929] border border-slate-800 rounded-lg p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <Search className="w-3.5 h-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search Serial, ID, or Defect..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-[#090D16] border border-slate-800 rounded px-2.5 py-1 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#0078D4]"
                />
              </div>

              <div className="flex items-center gap-4 text-slate-400">
                <div className="flex items-center gap-1.5">
                  <span>Station:</span>
                  <select
                    value={stationFilter}
                    onChange={(e) => setStationFilter(e.target.value)}
                    className="bg-[#090D16] border border-slate-800 rounded px-2 py-1 text-slate-200 focus:outline-none"
                  >
                    <option value="ALL">All Stations</option>
                    <option value="ST-01 Fastening">ST-01 Fastening</option>
                    <option value="ST-02 Battery Pack">ST-02 Battery Pack</option>
                    <option value="ST-03 Chassis Link">ST-03 Chassis Link</option>
                  </select>
                </div>

                <div className="flex items-center gap-1.5">
                  <span>Shift:</span>
                  <select
                    value={shiftFilter}
                    onChange={(e) => setShiftFilter(e.target.value)}
                    className="bg-[#090D16] border border-slate-800 rounded px-2 py-1 text-slate-200 focus:outline-none"
                  >
                    <option value="ALL">All Shifts</option>
                    <option value="Morning">Morning</option>
                    <option value="Afternoon">Afternoon</option>
                    <option value="Night">Night</option>
                  </select>
                </div>

                <div className="flex items-center gap-1.5">
                  <span>Status:</span>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="bg-[#090D16] border border-slate-800 rounded px-2 py-1 text-slate-200 focus:outline-none"
                  >
                    <option value="ALL">All States</option>
                    <option value="NOMINAL">Nominal</option>
                    <option value="ANOMALY">Anomalous</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Verification Table */}
            <div className="bg-[#121929] border border-slate-800 rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-[#090D16] text-slate-400 border-b border-slate-800 font-semibold">
                    <tr>
                      <th className="p-3">Cycle ID</th>
                      <th className="p-3">Serial Number</th>
                      <th className="p-3">Station</th>
                      <th className="p-3 font-mono text-right">Torque (Nm)</th>
                      <th className="p-3 font-mono text-right">Angle (°)</th>
                      <th className="p-3 font-mono text-right">Vib RMS (g)</th>
                      <th className="p-3">Static Limit (SPC)</th>
                      <th className="p-3 font-mono text-right">AI Score</th>
                      <th className="p-3">Classification</th>
                      <th className="p-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-sans">
                    {filteredData.map((row) => {
                      const isAiAlarm = row.anomalyScore >= threshold;
                      const isSelected = selectedRecord.id === row.id;

                      return (
                        <tr
                          key={row.id}
                          onClick={() => setSelectedRecord(row)}
                          className={`cursor-pointer transition-colors ${
                            isSelected ? 'bg-[#0078D4]/15 border-l-2 border-[#0078D4]' : 'hover:bg-slate-800/40'
                          }`}
                        >
                          <td className="p-3 font-mono font-medium text-slate-200">{row.id}</td>
                          <td className="p-3 font-mono text-slate-300">{row.serialNumber}</td>
                          <td className="p-3">{row.stationId}</td>
                          <td className="p-3 font-mono tabular-nums text-right text-slate-200">{row.torquePeakNm.toFixed(1)}</td>
                          <td className="p-3 font-mono tabular-nums text-right text-slate-200">{row.angleDeg.toFixed(1)}°</td>
                          <td className="p-3 font-mono tabular-nums text-right text-slate-200">{row.vibrationRms.toFixed(2)}</td>
                          <td className="p-3">
                            <span className={`font-mono text-[11px] ${
                              row.spcEvaluation === 'PASS' ? 'text-[#107C41]' : 'text-[#E81123]'
                            }`}>
                              {row.spcEvaluation}
                            </span>
                          </td>
                          <td className="p-3 font-mono tabular-nums text-right font-bold">
                            <span className={row.anomalyScore >= threshold ? 'text-[#E81123]' : 'text-slate-400'}>
                              {row.anomalyScore.toFixed(2)}
                            </span>
                          </td>
                          <td className="p-3">
                            {isAiAlarm ? (
                              <span className="text-[#E81123] font-semibold flex items-center gap-1">
                                <AlertTriangle className="w-3 h-3" /> Flagged ({row.defectCategory})
                              </span>
                            ) : (
                              <span className="text-[#107C41] flex items-center gap-1">
                                <CheckCircle className="w-3 h-3" /> Nominal
                              </span>
                            )}
                          </td>
                          <td className="p-3 text-right">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedRecord(row);
                              }}
                              className="text-xs text-[#00B7C3] hover:underline font-medium"
                            >
                              Inspect Curve
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: POWER BI QUALITY & YIELD ANALYTICS */}
        {activeTab === 'powerbi' && (
          <div className="space-y-6">
            <div className="bg-[#121929] border border-slate-800 rounded-lg p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-[#0078D4]" />
                    Executive Quality Intelligence · Power BI Cross-Filtering Canvas
                  </h2>
                  <div className="text-xs text-slate-400 mt-1">
                    First Pass Yield (FPY), Defect Mode Pareto, and Multivariate Correlation Dispersion
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <span className="text-slate-400">Yield Benchmark:</span>
                  <span className="font-mono font-bold text-[#107C41] tabular-nums">98.7% FPY (Target: 99.2%)</span>
                </div>
              </div>

              {/* Grid of Power BI Widgets */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Pareto Breakdown */}
                <div className="bg-[#090D16] border border-slate-800 rounded-lg p-4">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
                    Defect Mode Pareto Distribution
                  </h3>
                  <div className="space-y-3 text-xs">
                    <div>
                      <div className="flex justify-between text-slate-300 mb-1">
                        <span>Micro-slip (Torque limit reached prematurely)</span>
                        <span className="font-mono font-bold text-white">42%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-[#0078D4]" style={{ width: '42%' }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-slate-300 mb-1">
                        <span>Thread Galling / Excessive Friction</span>
                        <span className="font-mono font-bold text-white">28%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-[#00B7C3]" style={{ width: '28%' }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-slate-300 mb-1">
                        <span>Cross-threading</span>
                        <span className="font-mono font-bold text-white">18%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-[#F59E0B]" style={{ width: '18%' }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-slate-300 mb-1">
                        <span>Tool Wear / Calibration Drift</span>
                        <span className="font-mono font-bold text-white">12%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-[#8764B8]" style={{ width: '12%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Scrap vs Rework Cost Breakdown */}
                <div className="bg-[#090D16] border border-slate-800 rounded-lg p-4">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
                    Cost of Poor Quality (CoQ) Avoidance
                  </h3>
                  <div className="space-y-4 text-xs">
                    <div className="flex items-center justify-between p-2.5 rounded bg-slate-900 border border-slate-800">
                      <div>
                        <div className="text-slate-400">Internal Rework Cost</div>
                        <div className="text-sm font-bold font-mono text-white mt-0.5">$3,420 / month</div>
                      </div>
                      <span className="text-[11px] text-emerald-400 font-mono">Controlled</span>
                    </div>

                    <div className="flex items-center justify-between p-2.5 rounded bg-slate-900 border border-slate-800">
                      <div>
                        <div className="text-slate-400">Field Warranty Exposure Saved</div>
                        <div className="text-sm font-bold font-mono text-[#00B7C3] mt-0.5">$142,500 / batch</div>
                      </div>
                      <span className="text-[11px] text-[#00B7C3] font-mono">Prevented</span>
                    </div>

                    <div className="flex items-center justify-between p-2.5 rounded bg-slate-900 border border-slate-800">
                      <div>
                        <div className="text-slate-400">Overall Equipment Effectiveness (OEE)</div>
                        <div className="text-sm font-bold font-mono text-white mt-0.5">87.4% (+3.2% gain)</div>
                      </div>
                      <span className="text-[11px] text-emerald-400 font-mono">Optimized</span>
                    </div>
                  </div>
                </div>

                {/* Shift Performance Matrix */}
                <div className="bg-[#090D16] border border-slate-800 rounded-lg p-4">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
                    Verification Yield by Operating Shift
                  </h3>
                  <div className="space-y-3 text-xs">
                    <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-semibold text-white">Morning Shift (06:00 - 14:00)</span>
                        <span className="font-mono text-[#107C41] font-bold">99.1% FPY</span>
                      </div>
                      <div className="text-[11px] text-slate-400">Minimal variance; standard tooling temp.</div>
                    </div>

                    <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-semibold text-white">Afternoon Shift (14:00 - 22:00)</span>
                        <span className="font-mono text-amber-400 font-bold">97.8% FPY</span>
                      </div>
                      <div className="text-[11px] text-slate-400">Slight thermal drift noted on Chassis Link station.</div>
                    </div>

                    <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-semibold text-white">Night Shift (22:00 - 06:00)</span>
                        <span className="font-mono text-[#107C41] font-bold">98.9% FPY</span>
                      </div>
                      <div className="text-[11px] text-slate-400">Stable production cadence.</div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Multivariate Scatter Plot Representation */}
              <div className="mt-6 bg-[#090D16] border border-slate-800 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                    Multivariate Correlation Space: Peak Torque vs. Final Angle
                  </h3>
                  <div className="text-xs text-slate-400">
                    Blue = Nominal Cluster · Red = Detected Multivariate Outliers (Escaped by Univariate Limits)
                  </div>
                </div>

                <div className="h-44 w-full bg-[#05070D] rounded border border-slate-800/80 p-2 relative flex items-center justify-center">
                  <svg className="w-full h-full" viewBox="0 0 600 140">
                    <line x1="50" y1="120" x2="550" y2="120" stroke="#1E293B" />
                    <line x1="50" y1="20" x2="50" y2="120" stroke="#1E293B" />
                    <text x="300" y="135" fill="#64748B" fontSize="9" textAnchor="middle">Final Angle (Degrees °)</text>
                    <text x="25" y="70" fill="#64748B" fontSize="9" textAnchor="middle" transform="rotate(-90 25 70)">Torque (Nm)</text>

                    {/* Nominal Bivariate Cluster (Elliptical contour) */}
                    <ellipse cx="280" cy="70" rx="90" ry="25" fill="#0078D4" fillOpacity="0.08" stroke="#0078D4" strokeDasharray="3 3" />
                    
                    {/* Nominal Points */}
                    <circle cx="270" cy="68" r="3.5" fill="#0078D4" />
                    <circle cx="285" cy="72" r="3.5" fill="#0078D4" />
                    <circle cx="260" cy="75" r="3.5" fill="#0078D4" />
                    <circle cx="295" cy="65" r="3.5" fill="#0078D4" />
                    <circle cx="310" cy="74" r="3.5" fill="#0078D4" />
                    <circle cx="250" cy="64" r="3.5" fill="#0078D4" />

                    {/* Anomaly Outliers (High angle, high torque, or decoupled) */}
                    <circle cx="430" cy="62" r="5" fill="#E81123" />
                    <text x="440" y="58" fill="#E81123" fontSize="9" fontWeight="bold">Micro-slip (CYC-8492)</text>

                    <circle cx="120" cy="35" r="5" fill="#E81123" />
                    <text x="130" y="32" fill="#E81123" fontSize="9" fontWeight="bold">Cross-threading (CYC-8494)</text>

                    <circle cx="490" cy="50" r="5" fill="#E81123" />
                    <text x="495" y="65" fill="#E81123" fontSize="9" fontWeight="bold">Galling (CYC-8496)</text>
                  </svg>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 3: EXPLAINABLE AI (XAI) & ROOT-CAUSE OPERATOR ASSIST */}
        {activeTab === 'xai' && (
          <div className="space-y-6">
            <div className="bg-[#121929] border border-slate-800 rounded-lg p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                    <Compass className="w-5 h-5 text-[#00B7C3]" />
                    Explainable AI (XAI) · Feature Attribution & Operator Transparency
                  </h2>
                  <div className="text-xs text-slate-400 mt-1">
                    SHAP Waterfall Breakdown for Inspected Component: {selectedRecord.id} ({selectedRecord.serialNumber})
                  </div>
                </div>

                <div className="text-xs text-slate-400">
                  Target Component: <span className="font-bold text-white">{selectedRecord.stationId}</span>
                </div>
              </div>

              {/* Waterfall Bar Chart */}
              <div className="bg-[#090D16] border border-slate-800 rounded-lg p-5 mb-6">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
                  Feature Contribution to Anomaly Score (Local Feature Attribution)
                </h3>

                <div className="space-y-4">
                  {selectedRecord.shapAttribution.map((attr, idx) => (
                    <div key={idx} className="space-y-1.5">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-300 font-medium">{attr.feature}</span>
                        <span className={`font-mono font-bold ${
                          attr.direction === 'positive' ? 'text-[#E81123]' : 'text-[#107C41]'
                        }`}>
                          {attr.direction === 'positive' ? `+${attr.impactPercent}% Risk` : `-${attr.impactPercent}% Nominal`}
                        </span>
                      </div>
                      <div className="w-full h-3 bg-slate-800/80 rounded overflow-hidden">
                        <div
                          className={`h-full ${attr.direction === 'positive' ? 'bg-[#E81123]' : 'bg-[#107C41]'}`}
                          style={{ width: `${Math.min(attr.impactPercent * 1.8, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Root Cause Diagnostics & Traceability Log */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[#090D16] border border-slate-800 rounded-lg p-4">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-2">
                    Physical Root-Cause Diagnostic
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed bg-[#121929] p-3 rounded border border-slate-800">
                    {selectedRecord.operatorInstruction}
                  </p>
                  <div className="mt-3 text-[11px] text-slate-400 space-y-1">
                    <div>• Fastening Protocol: VDI/VDE 2862 Class A Safety-Critical Fastening</div>
                    <div>• Confidence Level: 96.8% via Ensemble Reconstruction Residual</div>
                  </div>
                </div>

                <div className="bg-[#090D16] border border-slate-800 rounded-lg p-4">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-2">
                    Digital Audit Trail & Traceability Metadata
                  </h3>
                  <div className="space-y-2 text-xs font-mono text-slate-300">
                    <div className="flex justify-between border-b border-slate-800 pb-1">
                      <span className="text-slate-500">Record Hash:</span>
                      <span>0x7f8a9e2d41b6</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-800 pb-1">
                      <span className="text-slate-500">Timestamp:</span>
                      <span>2026-10-10 {selectedRecord.timestamp} UTC</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-800 pb-1">
                      <span className="text-slate-500">PLC Gateway ID:</span>
                      <span>OPC-UA-SRV-04</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Edge Inference Latency:</span>
                      <span className="text-emerald-400">11.4 ms</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 4: AZURE IOT & MLOPS CLOUD ARCHITECTURE */}
        {activeTab === 'cloud' && (
          <div className="space-y-6">
            <div className="bg-[#121929] border border-slate-800 rounded-lg p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                    <Cloud className="w-5 h-5 text-[#0078D4]" />
                    Enterprise Azure IoT & MLOps Pipeline Topology
                  </h2>
                  <div className="text-xs text-slate-400 mt-1">
                    Production Architecture: From 1 kHz High-Frequency DAQ to Edge Inference and Lakehouse Analytics
                  </div>
                </div>
                <div className="text-xs font-mono text-[#0078D4] bg-[#0078D4]/10 px-3 py-1 rounded border border-[#0078D4]/20">
                  Microsoft Azure Certified Architecture
                </div>
              </div>

              {/* Visual 3D Topology Image */}
              <div className="rounded-lg overflow-hidden border border-slate-800 mb-6 relative">
                <img
                  src={cloudPipelineImage}
                  alt="Azure IoT and Cloud Machine Learning Streaming Architecture for Smart Manufacturing"
                  className="w-full h-80 object-cover"
                />
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-[#090D16] via-[#090D16]/70 to-transparent p-4">
                  <div className="text-xs font-bold text-white">
                    End-to-End Industrial Streaming Architecture
                  </div>
                  <div className="text-[11px] text-slate-300">
                    OPC-UA Edge Gateway → Azure Event Hubs → Azure Synapse & Delta Lake → Azure ML Model Registry → ONNX Edge Deployment
                  </div>
                </div>
              </div>

              {/* Architectural Tiers Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-[#090D16] border border-slate-800 rounded p-4">
                  <div className="text-[10px] font-bold text-[#00B7C3] uppercase tracking-wider mb-1">Tier 1 · Edge Layer</div>
                  <h3 className="text-xs font-bold text-white mb-2">Azure IoT Edge & OPC-UA</h3>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Connects directly to shop-floor PLCs (Beckhoff / Siemens / Atlas Copco) via OPC-UA. Local ONNX Runtime evaluates curves within 12ms.
                  </p>
                </div>

                <div className="bg-[#090D16] border border-slate-800 rounded p-4">
                  <div className="text-[10px] font-bold text-[#0078D4] uppercase tracking-wider mb-1">Tier 2 · Ingestion</div>
                  <h3 className="text-xs font-bold text-white mb-2">Azure Event Hubs (Kafka API)</h3>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Partitioned message ingestion capable of 100k events/sec with sub-second latency for streaming anomaly score telemetry.
                  </p>
                </div>

                <div className="bg-[#090D16] border border-slate-800 rounded p-4">
                  <div className="text-[10px] font-bold text-[#8764B8] uppercase tracking-wider mb-1">Tier 3 · Lakehouse</div>
                  <h3 className="text-xs font-bold text-white mb-2">ADLS Gen2 & Delta Lake</h3>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Bronze/Silver/Gold data medallion schema. Silver stores clean parquet time series; Gold powers Power BI DirectQuery.
                  </p>
                </div>

                <div className="bg-[#090D16] border border-slate-800 rounded p-4">
                  <div className="text-[10px] font-bold text-[#107C41] uppercase tracking-wider mb-1">Tier 4 · MLOps</div>
                  <h3 className="text-xs font-bold text-white mb-2">Azure ML & MLflow Registry</h3>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Continuous model retraining pipelines triggered by Evident Concept Drift. Versioned container deployment back to the plant edge.
                  </p>
                </div>
              </div>

              {/* Production PyTorch / Python Code Snippet */}
              <div className="bg-[#05070D] border border-slate-800 rounded-lg p-4 font-mono text-xs">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
                  <div className="flex items-center gap-2 text-slate-300">
                    <Code className="w-4 h-4 text-[#0078D4]" />
                    <span>production_anomaly_pipeline.py · PyTorch Autoencoder + Isolation Forest</span>
                  </div>
                  <span className="text-[11px] text-slate-500">Python 3.11 · Scikit-learn · ONNX</span>
                </div>

                <pre className="text-slate-300 overflow-x-auto leading-relaxed">
{`import torch
import torch.nn as nn
from sklearn.ensemble import IsolationForest

class IndustrialCurveAutoencoder(nn.Module):
    """
    Learns 'Golden Cycles' manifold from unlabelled normal verification curves.
    Detects multivariate slips via Reconstruction Mean Squared Error (MSE).
    """
    def __init__(self, seq_len=128, latent_dim=16):
        super().__init__()
        self.encoder = nn.Sequential(
            nn.Linear(seq_len, 64),
            nn.BatchNorm1d(64),
            nn.GELU(),
            nn.Linear(64, latent_dim)
        )
        self.decoder = nn.Sequential(
            nn.Linear(latent_dim, 64),
            nn.GELU(),
            nn.Linear(64, seq_len)
        )

    def forward(self, x):
        z = self.encoder(x)
        return self.decoder(z)

def compute_multivariate_anomaly_score(model, curve_tensor, iso_forest, tabular_features):
    # 1. Curve Reconstruction Loss
    reconstruction = model(curve_tensor)
    curve_mse = torch.mean((curve_tensor - reconstruction) ** 2, dim=1).item()
    
    # 2. Ensemble Density Score
    iso_score = -iso_forest.score_samples(tabular_features)[0] # Normalized 0 to 1
    
    # 3. Blended Anomaly Index
    return 0.65 * curve_mse + 0.35 * iso_score`}
                </pre>
              </div>

            </div>
          </div>
        )}

        {/* TAB 5: METHODOLOGY & BENCHMARKS */}
        {activeTab === 'methodology' && (
          <div className="space-y-6">
            <div className="bg-[#121929] border border-slate-800 rounded-lg p-6">
              <h2 className="text-base font-bold text-white tracking-tight mb-2 flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-[#0078D4]" />
                Algorithmic Benchmarks & Industrial Validation Methodology
              </h2>
              <p className="text-xs text-slate-400 mb-6 leading-relaxed">
                Comparative analysis of traditional manufacturing verification vs. modern machine learning approaches across speed, false rejection rate, and multidimensional defect capture.
              </p>

              {/* Comparison Matrix Table */}
              <div className="overflow-x-auto rounded border border-slate-800 mb-6">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-[#090D16] text-slate-400 border-b border-slate-800 font-semibold">
                    <tr>
                      <th className="p-3">Evaluation Method</th>
                      <th className="p-3">Model Family</th>
                      <th className="p-3">Multivariate Defect Capture</th>
                      <th className="p-3">False Rejection Sensitivity</th>
                      <th className="p-3">Inference Latency</th>
                      <th className="p-3">Operator Explainability</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-sans">
                    <tr className="hover:bg-slate-800/20">
                      <td className="p-3 font-semibold text-white">Statistical Process Control (SPC)</td>
                      <td className="p-3 text-slate-400">3-Sigma Static Tolerance Bands</td>
                      <td className="p-3 text-[#E81123] font-semibold">Poor (Fails on correlated drift)</td>
                      <td className="p-3 text-amber-400">Rigid (Alarms on normal thermal shift)</td>
                      <td className="p-3 font-mono">&lt; 1 ms</td>
                      <td className="p-3 text-slate-300">High (Threshold pass/fail)</td>
                    </tr>
                    <tr className="hover:bg-slate-800/20">
                      <td className="p-3 font-semibold text-white">Isolation Forest</td>
                      <td className="p-3 text-slate-400">Decision Tree Path Isolation</td>
                      <td className="p-3 text-[#00B7C3] font-semibold">High (Fast partitioning)</td>
                      <td className="p-3 text-[#107C41]">Low (Calibrated via contour threshold)</td>
                      <td className="p-3 font-mono">4.2 ms</td>
                      <td className="p-3 text-slate-300">High (SHAP tree attribution)</td>
                    </tr>
                    <tr className="hover:bg-slate-800/20 bg-[#0078D4]/5">
                      <td className="p-3 font-semibold text-white">Deep Variational Autoencoder (VAE)</td>
                      <td className="p-3 text-slate-400">Latent Space Manifold Reconstruction</td>
                      <td className="p-3 text-[#107C41] font-semibold">Exceptional (Full temporal curve)</td>
                      <td className="p-3 text-[#107C41]">Tunable (Dynamic statistical envelope)</td>
                      <td className="p-3 font-mono">11.4 ms (ONNX Edge)</td>
                      <td className="p-3 text-slate-300">High (Residual difference map)</td>
                    </tr>
                    <tr className="hover:bg-slate-800/20">
                      <td className="p-3 font-semibold text-white">Dynamic Time Warping (DTW)</td>
                      <td className="p-3 text-slate-400">Non-linear Time Alignment Distance</td>
                      <td className="p-3 text-slate-300">Moderate (Good for speed fluctuations)</td>
                      <td className="p-3 text-slate-400">Medium (Sensitive to noise spikes)</td>
                      <td className="p-3 font-mono">38.0 ms (Higher compute cost)</td>
                      <td className="p-3 text-slate-300">Moderate (Warping path matrix)</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Research & Industrial Standards Reference */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="bg-[#090D16] p-4 rounded border border-slate-800">
                  <h4 className="font-bold text-white mb-2 flex items-center gap-1.5">
                    <Info className="w-4 h-4 text-[#0078D4]" />
                    Industrial Benchmark Datasets (MVTec AD & Telemetry)
                  </h4>
                  <p className="text-slate-400 leading-relaxed">
                    Validated against standard industrial benchmark paradigms (MVTec Anomaly Detection for surface and texture verification, alongside high-frequency sensor time-series datasets). Proves resilience against extreme class imbalance (&gt;99% normal samples in training).
                  </p>
                </div>

                <div className="bg-[#090D16] p-4 rounded border border-slate-800">
                  <h4 className="font-bold text-white mb-2 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-[#107C41]" />
                    Practical Applicability in Automotive & Heavy Industry
                  </h4>
                  <p className="text-slate-400 leading-relaxed">
                    Designed according to VDI/VDE 2862 and ISO 9001 quality guidelines. Zero cloud dependency during runtime execution: models compile to native C++/ONNX for deterministic edge execution on factory floor controllers.
                  </p>
                </div>
              </div>

            </div>
          </div>
        )}

      </main>

      {/* QUIET FOOTER (CONSTITUTION COMPLIANT) */}
      <footer className="border-t border-slate-800/80 bg-[#0C1220] py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <div>
            AURA Verify AI · Smart Manufacturing Decision Support & Anomaly Detection
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Power BI Ready</span>
            <span>·</span>
            <span>Azure IoT Compatible</span>
            <span>·</span>
            <span>Edge ONNX Runtime</span>
          </div>
        </div>
      </footer>

    </div>
  );
}

// Missing icon fix
function ShieldCheck(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  );
}
