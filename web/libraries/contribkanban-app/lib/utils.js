export function objectForeach(obj, callback) {
  for (let i in obj) {
    if (!obj.hasOwnProperty(i)) continue;
    callback(i, obj[i]);
  }
}
export function datasetToJson(map) {
  let dataset = {};
  objectForeach(map, function (i, v) {
    try {
      dataset[i] = JSON.parse(v);
    } catch (e) {
      dataset[i] = v;
    }
  });
  return dataset;
}

export const baseUrl = `${window.location.origin}${drupalSettings.path.baseUrl}`;
