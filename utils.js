function createEle (eleName, classArr, styleObj) {
  var dom = document.createElement(eleName);

  for(var i = 0; i < classArr.length; i ++) {
    dom.classList.add(classArr[i]);
  }

  for(var key in styleObj) {
    dom.style[key] = styleObj[key];
  }

  return dom;
}