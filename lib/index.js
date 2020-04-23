"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Gesture = void 0;

var _utils = require("./utils");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var GestureFactory = /*#__PURE__*/function () {
  function GestureFactory() {
    _classCallCheck(this, GestureFactory);

    _defineProperty(this, "gestureList", {});

    _defineProperty(this, "isPause", false);

    _defineProperty(this, "MIN_DETECT_DISTANCE", 100);

    this.initListener();
  }

  _createClass(GestureFactory, [{
    key: "registry",
    value: function registry(keyType, gestureAction, callback) {
      var identifier = this.getIdentifier(keyType);
      this.saveGestureHandler(identifier, gestureAction, callback);
    }
  }, {
    key: "remove",
    value: function remove(keyType, callback) {
      var identifier = this.getIdentifier(keyType);
      var targetStore = this.gestureList[identifier];

      if ((0, _utils.isArray)(targetStore)) {
        var targetIndex = targetStore.findIndex(function (handlerStore) {
          return handlerStore.gestureHandler === callback;
        });
        if (targetIndex !== -1) targetStore.splice(targetIndex, 1);
      }
    }
  }, {
    key: "pause",
    value: function pause() {
      this.isPause = true;
    }
  }, {
    key: "resume",
    value: function resume() {
      this.isPause = false;
    }
  }, {
    key: "initListener",
    value: function initListener() {
      var _this = this;

      window.addEventListener('mousedown', function (downEvent) {
        if (_this.isPause) return;

        var mouseType = _this.getMouseTypeFromButtons(downEvent.buttons);

        if (!mouseType) return;
        var keyType = {
          mouseType: mouseType,
          ctrlKey: downEvent.ctrlKey,
          shiftKey: downEvent.shiftKey
        };
        var moveStep = [];
        var moveSlice = {
          x: 0,
          y: 0
        };
        var timer = 0;

        var onMove = function onMove(moveEvent) {
          moveSlice.x += moveEvent.movementX;
          moveSlice.y += moveEvent.movementY;

          if (moveSlice.x > _this.MIN_DETECT_DISTANCE || moveSlice.y > _this.MIN_DETECT_DISTANCE) {
            var direction = _this.getDirection(moveSlice.x, moveSlice.y);

            var latestMoveStep = moveStep[moveStep.length - 1];

            if (moveStep.length > 0 && latestMoveStep.direction === direction) {
              latestMoveStep.deltaX += moveSlice.x;
              latestMoveStep.deltaY += moveSlice.y;
              latestMoveStep.spendTime = Number(Date.now()) - timer;
            } else {
              timer = Number(Date.now());
              moveStep.push({
                deltaX: moveSlice.x,
                deltaY: moveSlice.y,
                direction: direction,
                spendTime: 0
              });
            }

            moveSlice.x = 0;
            moveSlice.y = 0;
          }
        };

        window.addEventListener('mousemove', onMove);
        window.addEventListener('mouseup', function (upEvent) {
          window.removeEventListener('mousemove', onMove);

          _this.checkHandlerList(moveStep, keyType);
        }, {
          once: true
        });
      });
    }
  }, {
    key: "checkHandlerList",
    value: function checkHandlerList(moveStep, keyType) {
      var _this2 = this;

      var identifier = this.getIdentifier(keyType);
      var handlerStore = this.gestureList[identifier];
      if (!(0, _utils.isArray)(handlerStore)) return;
      handlerStore.forEach(function (handler) {
        _this2.checkShouldInvokeHandler(handler, moveStep);
      });
    }
  }, {
    key: "checkShouldInvokeHandler",
    value: function checkShouldInvokeHandler(handler, realMoveStep) {
      var gestureAction = handler.gestureAction,
          gestureHandler = handler.gestureHandler;
      if (gestureAction.length > realMoveStep.length) return;

      for (var i = 0; i < gestureAction.length; i++) {
        var expectedAction = gestureAction[i];
        var realAction = realMoveStep[i];
        var direction = expectedAction.direction,
            maxDistance = expectedAction.maxDistance,
            maxSpendTime = expectedAction.maxSpendTime;
        if (direction !== realAction.direction) return;
        if (maxSpendTime && maxSpendTime < realAction.spendTime) return;
        var realDistance = realAction.direction.length === 1 ? Math.max(realAction.deltaX, realAction.deltaY) : Math.sqrt(Math.pow(realAction.deltaX, 2) + Math.pow(realAction.deltaY, 2));
        if (maxDistance && maxDistance < realDistance) return;
        var minDistance = expectedAction.minDistance ? Math.max(expectedAction.minDistance, this.MIN_DETECT_DISTANCE) : this.MIN_DETECT_DISTANCE;
        if (minDistance > realDistance) return;
        gestureHandler();
      }
    }
  }, {
    key: "getDirection",
    value: function getDirection(x, y) {
      var direction = 'T';
      var tanh225 = Math.tanh(22.5);
      var tanh675 = Math.tanh(67.5);
      if (x === 0) return y > 0 ? 'T' : 'B';
      if (y === 0) return x > 0 ? 'R' : 'L';
      var res = y / x;

      if (y > 0) {
        if (res > tanh675) direction = 'T';else if (tanh675 > res && res > tanh225) direction = 'TR';else if (tanh225 > res && res > -tanh225) direction = 'R';else if (-tanh225 > res && res > -tanh675) direction = 'RB';else direction = 'B';
      } else {
        if (res > tanh675) direction = 'B';else if (tanh675 > res && res > tanh225) direction = 'BL';else if (tanh225 > res && res > -tanh225) direction = 'L';else if (-tanh225 > res && res > -tanh675) direction = 'LT';else direction = 'T';
      }

      return direction;
    }
  }, {
    key: "saveGestureHandler",
    value: function saveGestureHandler(identifier, gestureAction, gestureHandler) {
      if (!(0, _utils.isArray)(this.gestureList[identifier])) {
        this.gestureList[identifier] = [{
          gestureAction: gestureAction,
          gestureHandler: gestureHandler
        }];
      } else if (!this.gestureList[identifier].some(function (handlerStore) {
        return handlerStore.gestureHandler === gestureHandler;
      })) {
        this.gestureList[identifier].push({
          gestureHandler: gestureHandler,
          gestureAction: gestureAction
        });
      }
    }
  }, {
    key: "getMouseTypeFromButtons",
    value: function getMouseTypeFromButtons(buttons) {
      if (buttons === 1) return 'L';else if (buttons === 2) return 'R';else if (buttons === 3) return 'LR';else if (buttons === 4) return 'M';else return null;
    }
  }, {
    key: "getIdentifier",
    value: function getIdentifier(keyType) {
      var mouseType = keyType.mouseType,
          ctrlKey = keyType.ctrlKey,
          shiftKey = keyType.shiftKey;
      return "".concat(ctrlKey ? 'c' : '').concat(shiftKey ? 's' : '').concat(mouseType);
    }
  }]);

  return GestureFactory;
}();

var Gesture = new GestureFactory();
exports.Gesture = Gesture;