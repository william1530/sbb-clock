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
(function() {
  'use strict';

  let minuteWrap,
      second,
      minute,
      hour,
      time,
      now,
      lag,
      cnt,
      ss;
  
  let _a = {
    init: () => {
      _a.initEls();
      _a.initVars();
      _a.setTime();
      _a.initMinuteHand();
      _a.setAnimation();
      _a.attachEvents();
    },
    initEls: () => {
      minuteWrap = _u.getNodes('.minute--wrap');
      second = _u.getNode('#second.hand');
      minute = _u.getNode('#minute.hand');
      hour = _u.getNode('#hour.hand');
    },
    initVars: () => {
      now = new Date();

      time = {
        'seconds': now.getSeconds(),
        'minutes': now.getMinutes(),
        'hours': now.getHours(),
      };

      lag = 1;
      cnt = 0;

      time.minutesSolo = (time.minutes * 60);
      time.minutes = (time.minutes * 60) + time.seconds;
      time.hours = (((time.hours > 12) ? time.hours - 12 : time.hours) * 3600) + time.minutes;

      ss = document.createElement('style');
      ss.setAttribute('type', 'text/css');
      document.head.appendChild(ss);
    },
    setTime: () => {
      _u.findNode(second, '.shape').setAttribute('transform', `rotate(${360 * (time.seconds/(60 - lag))}, 500, 500)`);
      _u.findNode(minute, 'path').setAttribute('transform', `rotate(${360 * ((time.minutesSolo)/3600)}, 500, 500)`);
      _u.findNode(hour, 'path').setAttribute('transform', `rotate(${360 * (time.hours/43200)}, 500, 500)`);
    },
    initMinuteHand: () => {
      
      let content = minute.cloneNode(true);
      minute.parentNode.removeChild(minute);

      Array(60).fill(0).map((_, i) => {
        let containers = _u.getNodes('.minute--wrap'),
            minuteTicks = _u.getNodes('.minutes div'),
            hourTicks = _u.getNodes('.hours div'),
            lastContainer = (i > 0) ? _u.getLast([...containers]) : containers[0],
            lastMinTick = (i > 0) ? _u.getLast([...minuteTicks]) : _u.getNode('.minutes'),
            lastHourTick = (i > 0) ? _u.getLast([...hourTicks]) : _u.getNode('.hours'),
            container = _u.createEl('div', {
              'class': 'minute--wrap'
            }),
            minTick = _u.createEl('div', {
              'class': 'tick'
            }),
            hourTick = _u.createEl('div', {
              'class': 'tick'
            });
        i === 0 ? (
          (_u.insertBefore(second, container)),
          (_u.getNode('.minutes').appendChild(minTick)),
          (_u.getNode('.hours').appendChild(hourTick))
        ) : (i < 12) ? (
          (lastContainer.appendChild(container)),
          (lastMinTick.appendChild(minTick)),
          (lastHourTick.appendChild(hourTick))
        ) : (i < 59) ? (
          (lastContainer.appendChild(container)),
          (lastMinTick.appendChild(minTick))
        ) : lastContainer.appendChild(container);

        let last;
        (i === 59) && (
          (last = _u.getLast([..._u.getNodes('.minute--wrap')])),
          (last.appendChild(content)),
          (last.setAttribute('data-last', 'true')),
          (last.addEventListener('animationend', _a.restartAnimation, false))
        );
      });

      _a.initEls();
      _a.adjustHeights();
    },
    adjustHeights: () => {
      minuteWrap[0].style.height = `${hour.getBoundingClientRect().height}px`;
      _u.getNode('.animation_container').style.height = `${_u.getNode('.minutes').getBoundingClientRect().height}px`;
    },
    restartAnimation: () => {
      minuteWrap.forEach(el => _u.removeClass(el, 'animate'));
    },
    setAnimation: () => {
      let firstBP = ((60 - time.seconds - 2) * 100) / 60,
          secondBP = ((60 - time.seconds) * 100) / 60,
          bpAngle = 360 * (((60 - lag) - time.seconds) / (60 - lag)),
          timeAcc;

      _u.keyframeAnimation('secondAnim', `0% {transform: rotate(0deg)} ${firstBP}%, ${secondBP}% { transform: rotate(${bpAngle}deg)} 100% {transform: rotate(360deg)}`);

      minuteWrap.forEach((el, _) => {
        timeAcc = secondBP * 60 / 100;
        el.style.animationDelay = `${timeAcc}s`;
      });
    },
    attachEvents: () => {
      second.addEventListener('animationstart', _a.minuteHandBegin, false);
      window.addEventListener('resize', _a.handleResize, false);
    },
    minuteHandBegin: () => {
      _a.advanceMinuteHand();
      second.addEventListener('animationiteration', _a.advanceMinuteHand, false);
    },
    advanceMinuteHand: () => {
      //console.log(cnt);
      minuteWrap[cnt].classList.add('animate');
      cnt++;
      cnt = cnt >= 60 ? 0 : cnt;
    },
    handleResize: () => _a.adjustHeights()
  };
  _a.init();
})();