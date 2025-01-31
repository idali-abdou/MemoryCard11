import { onCLS, onFID, onFCP, onLCP, onTTFB, CLSMetric, FIDMetric, FCPMetric, LCPMetric, TTFBMetric } from 'web-vitals';

type ReportHandler = (metric: CLSMetric | FIDMetric | FCPMetric | LCPMetric | TTFBMetric) => void;

const reportWebVitals = (onPerfEntry?: ReportHandler) => {
  if (onPerfEntry && typeof onPerfEntry === 'function') {
    onCLS(onPerfEntry);
    onFID(onPerfEntry);
    onFCP(onPerfEntry);
    onLCP(onPerfEntry);
    onTTFB(onPerfEntry);
  }
};

export default reportWebVitals;