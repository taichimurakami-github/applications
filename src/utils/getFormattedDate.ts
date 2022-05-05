export const getFormattedDate = () => {
  const now = new Date();
  const nowYearMonthAndDate = `${now.getFullYear()}/${
    now.getMonth() + 1
  }/${now.getDate()}`;
  const nowHoursMinutesAndSeconds = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;

  return {
    YMD: nowYearMonthAndDate,
    HMS: nowHoursMinutesAndSeconds,
  };
};
