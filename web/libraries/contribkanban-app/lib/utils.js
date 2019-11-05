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

export const categoryOptions = [
  {value: '_any', item: 'Any category'},
  {value: 1, item: 'Bug report'},
  {value: 2, item: 'Task'},
  {value: 3, item: 'Feature request'},
  {value: 4, item: 'Support request'},
  {value: 5, item: 'Plan'},
];
export const priorityOptions = [
  {value: '_any', item: 'Any priority'},
  {value: 400, item: 'Critical'},
  {value: 300, item: 'Major'},
  {value: 200, item: 'Normal'},
  {value: 100, item: 'Minor'},
];
export const versionOptions = [
  {value: '_any', item: 'Any version'},
  {value: '8.x', item: 'Drupal 8'},
  {value: '7.x', item: 'Drupal 7'},
];
