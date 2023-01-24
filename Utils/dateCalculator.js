exports.dateCalculator = (days) => {
  var result = new Date();
  result.setDate(result.getDate() + days);
  return result;
};
