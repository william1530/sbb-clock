let _u = {
  d: document,
  // (s, t) => (parent, element to search)
  findNode: (s, t) => s.querySelector(t),
  findNodes: (s, t) => s.querySelectorAll(t),
  getNode: (s) => _u.d.querySelector(s),
  getNodes: (s) => _u.d.querySelectorAll(s),
  getLast: (s) => [].slice.call(s).pop(),
  addClass: (el, n) => !el.classList.contains(n) && el.classList.add(n),
  removeClass: (el, n) => el.classList.contains(n) && el.classList.remove(n),
  // insert before an element
  insertBefore: (r, n) => r.parentNode.insertBefore(n, r),
  keyframeAnimation: (name, styles) => {
    let ss = _u.d.createElement('style');
    ss.setAttribute('type', 'text/css');
    _u.d.head.appendChild(ss);
  
    ss.sheet.insertRule(`@keyframes ${name} {${styles}}`, ss.length);
  },
  createEl: (t, o) => {
    let node = _u.d.createElement(t);
    o && Object.keys(o).forEach((atr, _) => {
      node.setAttribute(atr, Object.values(o)[_]);
    });
    return node;
  },
};