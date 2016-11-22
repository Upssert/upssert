'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _events = require('events');

var _tv = require('tv4');

var _tv2 = _interopRequireDefault(_tv);

var _formdata = require('../../data/schema/formdata.json');

var _formdata2 = _interopRequireDefault(_formdata);

var _request = require('../../data/schema/request.json');

var _request2 = _interopRequireDefault(_request);

var _test = require('../../data/schema/test.json');

var _test2 = _interopRequireDefault(_test);

var _suite = require('../../data/schema/suite.json');

var _suite2 = _interopRequireDefault(_suite);

var _test3 = require('./test');

var _test4 = _interopRequireDefault(_test3);

var _events2 = require('../../data/events.json');

var _events3 = _interopRequireDefault(_events2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Suite = function (_EventEmitter) {
  _inherits(Suite, _EventEmitter);

  function Suite(testCase) {
    _classCallCheck(this, Suite);

    var _this = _possibleConstructorReturn(this, (Suite.__proto__ || Object.getPrototypeOf(Suite)).call(this));

    _this.bindEmitters();
    _this.testCase = testCase;
    _this.testExecutors = [];
    return _this;
  }

  _createClass(Suite, [{
    key: 'bindEmitters',
    value: function bindEmitters() {
      this.testStart = this.testStart.bind(this);
      this.testEnd = this.testEnd.bind(this);
      this.testPass = this.testPass.bind(this);
      this.testFail = this.testFail.bind(this);
      this.assertionCount = this.assertionCount.bind(this);
    }
  }, {
    key: 'execute',
    value: function () {
      var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                this.emit(_events3.default.SUITE_START, this.testCase);
                _context.next = 3;
                return this.executeTestsInOrder();

              case 3:
                this.emit(_events3.default.SUITE_END, this.testCase);

              case 4:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function execute() {
        return _ref.apply(this, arguments);
      }

      return execute;
    }()
  }, {
    key: 'initialize',
    value: function initialize() {
      _tv2.default.addSchema('formdata-schema', _formdata2.default);
      _tv2.default.addSchema('request-schema', _request2.default);
      _tv2.default.addSchema('test-schema', _test2.default);
      var testValid = _tv2.default.validate(this.testCase, _suite2.default);
      if (testValid) {
        this.emit(_events3.default.SUITE_COUNT, 1);
        this.initializeTests();
      } else {
        this.emit(_events3.default.SUITE_FAIL, this.testCase, _tv2.default.error);
      }
    }
  }, {
    key: 'initializeTests',
    value: function initializeTests() {
      var i = 1;
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.testCase.tests[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var test = _step.value;

          if (!test.id) {
            test.id = 'test' + i;
            i += 1;
          }
          var executor = new _test4.default(test);
          executor.on(_events3.default.SUITE_TEST_START, this.testStart);
          executor.on(_events3.default.SUITE_TEST_END, this.testEnd);
          executor.on(_events3.default.SUITE_TEST_PASS, this.testPass);
          executor.on(_events3.default.SUITE_TEST_FAIL, this.testFail);
          executor.on(_events3.default.SUITE_ASSERTION_COUNT, this.assertionCount);
          executor.initialize();
          this.testExecutors.push(executor);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      this.emit(_events3.default.SUITE_TEST_COUNT, this.testCase.tests.length);
    }
  }, {
    key: 'executeTestsInOrder',
    value: function () {
      var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2() {
        var results, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, executor, result;

        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                results = {};
                _iteratorNormalCompletion2 = true;
                _didIteratorError2 = false;
                _iteratorError2 = undefined;
                _context2.prev = 4;
                _iterator2 = this.testExecutors[Symbol.iterator]();

              case 6:
                if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
                  _context2.next = 15;
                  break;
                }

                executor = _step2.value;
                _context2.next = 10;
                return executor.execute(results);

              case 10:
                result = _context2.sent;

                results[result.test.id] = result;

              case 12:
                _iteratorNormalCompletion2 = true;
                _context2.next = 6;
                break;

              case 15:
                _context2.next = 21;
                break;

              case 17:
                _context2.prev = 17;
                _context2.t0 = _context2['catch'](4);
                _didIteratorError2 = true;
                _iteratorError2 = _context2.t0;

              case 21:
                _context2.prev = 21;
                _context2.prev = 22;

                if (!_iteratorNormalCompletion2 && _iterator2.return) {
                  _iterator2.return();
                }

              case 24:
                _context2.prev = 24;

                if (!_didIteratorError2) {
                  _context2.next = 27;
                  break;
                }

                throw _iteratorError2;

              case 27:
                return _context2.finish(24);

              case 28:
                return _context2.finish(21);

              case 29:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this, [[4, 17, 21, 29], [22,, 24, 28]]);
      }));

      function executeTestsInOrder() {
        return _ref2.apply(this, arguments);
      }

      return executeTestsInOrder;
    }()
  }, {
    key: 'testStart',
    value: function testStart(test) {
      this.emit(_events3.default.SUITE_TEST_START, test);
    }
  }, {
    key: 'testEnd',
    value: function testEnd(test) {
      this.emit(_events3.default.SUITE_TEST_END, test);
    }
  }, {
    key: 'testPass',
    value: function testPass(test) {
      this.emit(_events3.default.SUITE_TEST_PASS, test);
    }
  }, {
    key: 'testFail',
    value: function testFail(test, err) {
      this.emit(_events3.default.SUITE_TEST_FAIL, test, err);
    }
  }, {
    key: 'assertionCount',
    value: function assertionCount(count) {
      this.emit(_events3.default.SUITE_ASSERTION_COUNT, count);
    }
  }]);

  return Suite;
}(_events.EventEmitter);

exports.default = Suite;