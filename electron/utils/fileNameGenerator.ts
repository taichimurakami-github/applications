const _getDatetimeFilename = () => {
  const now = new Date();
  return `${now.getFullYear()}${now.getMonth() + 1}${now.getDate()}`;
};

export const getAttendanceStateFilename = () => {
  return _getDatetimeFilename() + ".json";
};

export const getSeatsStateFilename = () => {
  return _getDatetimeFilename() + ".json";
};

export const getAppLocalDataBackupFilename = () => {
  return _getDatetimeFilename() + ".json";
};
