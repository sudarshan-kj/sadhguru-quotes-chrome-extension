exports.getBiYear = (date) => {
  let dateValue = new Date(date);
  let year = dateValue.getFullYear();
  let month = Math.ceil((dateValue.getMonth() + 1) / 6);
  return Number(`${month}${year}`);
};
