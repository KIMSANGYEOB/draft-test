"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.pastedTextHandlers = exports.copyHandlers = exports.pastedFilesHandlers = exports.droppedFilesHandlers = exports.handleFiles = exports.dropHandlers = exports.compositionStartHandler = exports.beforeInputHandlers = exports.returnHandlers = exports.keyCommandHandlers = void 0;

var _draftJs = require("draft-js");

var _getFragmentFromSelection = _interopRequireDefault(require("draft-js/lib/getFragmentFromSelection"));

var _draftjsUtils = require("draftjs-utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var keyCommandHandlers = function keyCommandHandlers(command, editorState, editor) {
  if (editor.editorProps.handleKeyCommand && editor.editorProps.handleKeyCommand(command, editorState, editor) === 'handled') {
    return 'handled';
  }

  if (command === 'braft-save') {
    editor.editorProps.onSave && editor.editorProps.onSave(editorState);
    return 'handled';
  }

  var _editor$editorProps = editor.editorProps,
      controls = _editor$editorProps.controls,
      excludeControls = _editor$editorProps.excludeControls;
  var allowIndent = (controls.indexOf('text-indent') !== 0 || controls.find(function (item) {
    return item.key === 'text-indent';
  })) && excludeControls.indexOf('text-indent') === -1;
  var cursorStart = editorState.getSelection().getStartOffset();
  var cursorEnd = editorState.getSelection().getEndOffset();
  var cursorIsAtFirst = cursorStart === 0 && cursorEnd === 0;

  if (command === 'backspace') {
    if (editor.editorProps.onDelete && editor.editorProps.onDelete(editorState) === false) {
      return 'handled';
    }

    var blockType = _draftJs.ContentUtils.getSelectionBlockType(editorState);

    if (allowIndent && cursorIsAtFirst && blockType !== 'code-block') {
      editor.setValue(_draftJs.ContentUtils.decreaseSelectionIndent(editorState));
    }
  }

  if (command === 'tab') {
    var _blockType = _draftJs.ContentUtils.getSelectionBlockType(editorState);

    if (_blockType === 'code-block') {
      editor.setValue(_draftJs.ContentUtils.insertText(editorState, ' '.repeat(editor.editorProps.codeTabIndents)));
      return 'handled';
    } else if (_blockType === 'ordered-list-item' || _blockType === 'unordered-list-item') {
      var newEditorState = _draftJs.RichUtils.onTab(event, editorState, 4);

      if (newEditorState !== editorState) {
        editor.setValue(newEditorState);
      }

      return 'handled';
    } else if (_blockType !== 'atomic' && allowIndent && cursorIsAtFirst) {
      editor.setValue(_draftJs.ContentUtils.increaseSelectionIndent(editorState));
      return 'handled';
    }
  }

  var nextEditorState = _draftJs.ContentUtils.handleKeyCommand(editorState, command);

  if (nextEditorState) {
    editor.setValue(nextEditorState);
    return 'handled';
  }

  return 'not-handled';
};

exports.keyCommandHandlers = keyCommandHandlers;

var returnHandlers = function returnHandlers(event, editorState, editor) {
  if (editor.editorProps.handleReturn && editor.editorProps.handleReturn(event, editorState, editor) === 'handled') {
    return 'handled';
  }

  var currentBlock = _draftJs.ContentUtils.getSelectionBlock(editorState);

  var currentBlockType = currentBlock.getType();

  if (currentBlockType === 'unordered-list-item' || currentBlockType === 'ordered-list-item') {
    if (currentBlock.getLength() === 0) {
      editor.setValue(_draftJs.ContentUtils.toggleSelectionBlockType(editorState, 'unstyled'));
      return 'handled';
    }

    return 'not-handled';
  } else if (currentBlockType === 'code-block') {
    if (event.which === 13 && (event.getModifierState('Shift') || event.getModifierState('Alt') || event.getModifierState('Control'))) {
      editor.setValue(_draftJs.ContentUtils.toggleSelectionBlockType(editorState, 'unstyled'));
      return 'handled';
    }

    return 'not-handled';
  } else if (currentBlockType === 'blockquote') {
    if (event.which === 13) {
      if (event.getModifierState('Shift') || event.getModifierState('Alt') || event.getModifierState('Control')) {
        event.which = 0;
      } else {
        editor.setValue(_draftJs.RichUtils.insertSoftNewline(editorState));
        return 'handled';
      }
    }
  }

  var nextEditorState = (0, _draftjsUtils.handleNewLine)(editorState, event);

  if (nextEditorState) {
    editor.setValue(nextEditorState);
    return 'handled';
  }

  return 'not-handled';
};

exports.returnHandlers = returnHandlers;

var beforeInputHandlers = function beforeInputHandlers(chars, editorState, editor) {
  if (editor.editorProps.handleBeforeInput && editor.editorProps.handleBeforeInput(chars, editorState, editor) === 'handled') {
    return 'handled';
  }

  return 'not-handled';
};

exports.beforeInputHandlers = beforeInputHandlers;

var compositionStartHandler = function compositionStartHandler(_, editor) {
  var editorState = editor.state.editorState;

  var selectedBlocks = _draftJs.ContentUtils.getSelectedBlocks(editorState);

  if (selectedBlocks && selectedBlocks.length > 1) {
    var nextEditorState = _draftJs.EditorState.push(editorState, _draftJs.Modifier.removeRange(editorState.getCurrentContent(), editorState.getSelection(), 'backward'), 'remove-range');

    editor.setValue(nextEditorState);
  }
};

exports.compositionStartHandler = compositionStartHandler;

var dropHandlers = function dropHandlers(selectionState, dataTransfer, editor) {
  if (editor.editorProps.readOnly || editor.editorProps.disabled) {
    return 'handled';
  }

  if (window && window.__BRAFT_DRAGING__IMAGE__) {
    var nextEditorState = _draftJs.EditorState.forceSelection(editor.state.editorState, selectionState);

    nextEditorState = _draftJs.ContentUtils.insertMedias(nextEditorState, [window.__BRAFT_DRAGING__IMAGE__.mediaData]);
    nextEditorState = _draftJs.ContentUtils.removeBlock(nextEditorState, window.__BRAFT_DRAGING__IMAGE__.block, nextEditorState.getSelection());
    window.__BRAFT_DRAGING__IMAGE__ = null;
    editor.lockOrUnlockEditor(true);
    editor.setValue(nextEditorState);
    return 'handled';
  } else if (!dataTransfer || !dataTransfer.getText()) {
    return 'handled';
  }

  return 'not-handled';
};

exports.dropHandlers = dropHandlers;

var handleFiles = function handleFiles(files, editor) {
  var _editor$constructor$d = _objectSpread({}, editor.constructor.defaultProps.media, {}, editor.editorProps.media),
      pasteImage = _editor$constructor$d.pasteImage,
      validateFn = _editor$constructor$d.validateFn,
      imagePasteLimit = _editor$constructor$d.imagePasteLimit;

  pasteImage && files.slice(0, imagePasteLimit).forEach(function (file) {
    if (file && file.type.indexOf('image') > -1 && editor.braftFinder) {
      var validateResult = validateFn ? validateFn(file) : true;

      if (validateResult instanceof Promise) {
        validateResult.then(function () {
          editor.braftFinder.uploadImage(file, function (image) {
            editor.isLiving && editor.setValue(_draftJs.ContentUtils.insertMedias(editor.state.editorState, [image]));
          });
        });
      } else if (validateResult) {
        editor.braftFinder.uploadImage(file, function (image) {
          editor.isLiving && editor.setValue(_draftJs.ContentUtils.insertMedias(editor.state.editorState, [image]));
        });
      }
    }
  });

  if (files[0] && files[0].type.indexOf('image') > -1 && pasteImage) {
    return 'handled';
  }

  return 'not-handled';
};

exports.handleFiles = handleFiles;

var droppedFilesHandlers = function droppedFilesHandlers(selectionState, files, editor) {
  if (editor.editorProps.handleDroppedFiles && editor.editorProps.handleDroppedFiles(selectionState, files, editor) === 'handled') {
    return 'handled';
  }

  return handleFiles(files, editor);
};

exports.droppedFilesHandlers = droppedFilesHandlers;

var pastedFilesHandlers = function pastedFilesHandlers(files, editor) {
  if (editor.editorProps.handlePastedFiles && editor.editorProps.handlePastedFiles(files, editor) === 'handled') {
    return 'handled';
  }

  return handleFiles(files, editor);
};

exports.pastedFilesHandlers = pastedFilesHandlers;

var copyHandlers = function copyHandlers(event, editor) {
  var blockMap = (0, _getFragmentFromSelection["default"])(editor.state.editorState);

  if (blockMap && blockMap.toArray) {
    try {
      var tempContentState = _draftJs.ContentState.createFromBlockArray(blockMap.toArray());

      var tempEditorState = _draftJs.EditorState.createWithContent(tempContentState);

      var clipboardData = event.clipboardData || window.clipboardData || event.originalEvent.clipboardData;
      tempEditorState.setConvertOptions(editor.state.editorState.convertOptions);
      clipboardData.setData('text/html', tempEditorState.toHTML());
      clipboardData.setData('text/plain', tempEditorState.toText());
      event.preventDefault();
    } catch (error) {
      console.warn(error);
    }
  }
};

exports.copyHandlers = copyHandlers;

var pastedTextHandlers = function pastedTextHandlers(text, html, editorState, editor) {
  if (editor.editorProps.handlePastedText && editor.editorProps.handlePastedText(text, html, editorState, editor) === 'handled') {
    return 'handled';
  }

  if (!html || editor.editorProps.stripPastedStyles) {
    return false;
  }

  var tempColors = _draftJs.ColorUtils.detectColorsFromHTMLString(html);

  editor.setState({
    tempColors: [].concat(_toConsumableArray(editor.state.tempColors), _toConsumableArray(tempColors)).filter(function (item) {
      return editor.editorProps.colors.indexOf(item) === -1;
    }).filter(function (item, index, array) {
      return array.indexOf(item) === index;
    })
  }, function () {
    editor.setValue(_draftJs.ContentUtils.insertHTML(editorState, html, 'paste'));
  });
  return 'handled';
};

exports.pastedTextHandlers = pastedTextHandlers;
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireWildcard(require("react"));

var _draftJs = require("draft-js");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var TestDraftJsPlus =
/*#__PURE__*/
function (_Component) {
  _inherits(TestDraftJsPlus, _Component);

  function TestDraftJsPlus() {
    var _this;

    _classCallCheck(this, TestDraftJsPlus);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(TestDraftJsPlus).call(this));

    _defineProperty(_assertThisInitialized(_this), "onChange", function (editorState) {
      _this.setState({
        editorState: editorState
      });
    });

    _defineProperty(_assertThisInitialized(_this), "handleKeyCommand", function (command) {
      var newState = _draftJs.RichUtils.handleKeyCommand(_this.state.editorState, command);

      if (newState) {
        _this.onChange(newState);

        return 'handled';
      }

      return 'not-handled';
    });

    _defineProperty(_assertThisInitialized(_this), "onHeaderOne", function () {
      _this.onChange(_draftJs.RichUtils.toggleBlockType(_this.state.editorState, 'header-one'));
    });

    _defineProperty(_assertThisInitialized(_this), "onHeaderTwo", function () {
      _this.onChange(_draftJs.RichUtils.toggleBlockType(_this.state.editorState, 'header-two'));
    });

    _defineProperty(_assertThisInitialized(_this), "onHeaderThree", function () {
      _this.onChange(_draftJs.RichUtils.toggleBlockType(_this.state.editorState, 'header-three'));
    });

    _defineProperty(_assertThisInitialized(_this), "onHeaderFour", function () {
      _this.onChange(_draftJs.RichUtils.toggleBlockType(_this.state.editorState, 'header-four'));
    });

    _defineProperty(_assertThisInitialized(_this), "onHeaderFive", function () {
      _this.onChange(_draftJs.RichUtils.toggleBlockType(_this.state.editorState, 'header-five'));
    });

    _defineProperty(_assertThisInitialized(_this), "onBold", function () {
      _this.onChange(_draftJs.RichUtils.toggleInlineStyle(_this.state.editorState, 'BOLD'));
    });

    _defineProperty(_assertThisInitialized(_this), "onUnderlineClick", function () {
      _this.onChange(_draftJs.RichUtils.toggleInlineStyle(_this.state.editorState, 'UNDERLINE'));
    });

    _defineProperty(_assertThisInitialized(_this), "onToggleCode", function () {
      _this.onChange(_draftJs.RichUtils.toggleCode(_this.state.editorState));
    });

    _defineProperty(_assertThisInitialized(_this), "onResetStyle", function () {
      _this.onChange(_draftJs.RichUtils.tryToRemoveBlockStyle(_this.state.editorState));
    });

    _this.state = {
      editorState: _draftJs.EditorState.createEmpty()
    };
    return _this;
  }

  _createClass(TestDraftJsPlus, [{
    key: "render",
    value: function render() {
      return _react["default"].createElement(_react["default"].Fragment, null, _react["default"].createElement("button", {
        onClick: this.onHeaderOne
      }, "h1"), _react["default"].createElement("button", {
        onClick: this.onHeaderTwo
      }, "h2"), _react["default"].createElement("button", {
        onClick: this.onHeaderThree
      }, "h3"), _react["default"].createElement("button", {
        onClick: this.onHeaderFour
      }, "h4"), _react["default"].createElement("button", {
        onClick: this.onHeaderFive
      }, "h5"), _react["default"].createElement("button", {
        onClick: this.onBold
      }, "B"), _react["default"].createElement("button", {
        onClick: this.onUnderlineClick
      }, "Underline"), _react["default"].createElement("button", {
        onClick: this.onToggleCode
      }, "<>"), _react["default"].createElement("button", {
        onClick: this.onResetStyle
      }, "reset"), _react["default"].createElement(_draftJs.Editor, {
        editorState: this.state.editorState,
        onChange: this.onChange,
        handleKeyCommand: this.handleKeyCommand
      }));
    }
  }]);

  return TestDraftJsPlus;
}(_react.Component);

exports["default"] = TestDraftJsPlus;
