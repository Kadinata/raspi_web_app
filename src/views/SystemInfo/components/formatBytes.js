const BYTES_PER_KB = 1000;
const BYTES_PER_MB = 1000 * BYTES_PER_KB;
const BYTES_PER_GB = 1000 * BYTES_PER_MB;
const BYTES_PER_TB = 1000 * BYTES_PER_GB;

export const formatBytes = (value) => {

  let unit = 'Bytes';

  if (value >= BYTES_PER_TB) {
    unit = 'TB';
    value = value / BYTES_PER_TB;
  } else if (value >= BYTES_PER_GB) {
    unit = 'GB';
    value = value / BYTES_PER_GB;
  } else if (value >= BYTES_PER_MB) {
    unit = 'MB';
    value = value / BYTES_PER_MB;
  } else if (value >= BYTES_PER_KB) {
    unit = 'kb';
    value = value / BYTES_PER_KB;
  }

  return { value, unit };
};