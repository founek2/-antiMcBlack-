import { keys } from 'ramda';


/**
 * Return better object with filled empty object based on lenght param
 * @param {Object} obj 
 * @param {Number} length 
 */
var valuesFromAbsenceItems = (obj, length) => {
  var props = keys(obj);
  var vals = [];
  var idx = 0;
  var id = 0;

  while (idx < length) {
    if(props[id] == idx){
      vals[idx] = obj[props[id]];
      id++;
    }else {
      vals[idx] = {value: '', comment: []}
    }
    idx += 1;
  }
  return vals;
};

export default valuesFromAbsenceItems;