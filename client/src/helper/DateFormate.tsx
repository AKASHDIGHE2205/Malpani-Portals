/* eslint-disable @typescript-eslint/no-explicit-any */
export const formatDate = (dateString: Date | string) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  let month: any = date.getMonth() + 1;
  let day: any = date.getDate();
  if (month < 10) {
    month = '0' + month;
  }
  if (day < 10) {
    day = '0' + day;
  }
  // return `${day}-${month}-${year}`;
  return `${year}-${month}-${day}`;
};
