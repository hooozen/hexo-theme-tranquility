const getObjValues = obj => {
  if (typeof obj === null) return;
  if (typeof obj !== 'object') return [obj];
  const res = [];
  for (let k in obj) {
    res.push(...getObjValues(obj[k]));
  };
  return res;
};
module.exports.getObjValues = getObjValues;