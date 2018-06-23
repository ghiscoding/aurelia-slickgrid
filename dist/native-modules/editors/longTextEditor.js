var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { inject } from 'aurelia-framework';
import { I18N } from 'aurelia-i18n';
import { Constants } from './../constants';
import { KeyCode } from './../models/index';
import * as $ from 'jquery';
/*
 * An example of a 'detached' editor.
 * The UI is added onto document BODY and .position(), .show() and .hide() are implemented.
 * KeyDown events are also handled to provide handling for Tab, Shift-Tab, Esc and Ctrl-Enter.
 */
var LongTextEditor = /** @class */ (function () {
    function LongTextEditor(i18n, args) {
        this.i18n = i18n;
        this.args = args;
        this.init();
    }
    Object.defineProperty(LongTextEditor.prototype, "columnDef", {
        /** Get Column Definition object */
        get: function () {
            return this.args && this.args.column || {};
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LongTextEditor.prototype, "columnEditor", {
        /** Get Column Editor object */
        get: function () {
            return this.columnDef && this.columnDef.internalColumnEditor || {};
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LongTextEditor.prototype, "validator", {
        /** Get the Validator function, can be passed in Editor property or Column Definition */
        get: function () {
            return this.columnEditor.validator || this.columnDef.validator;
        },
        enumerable: true,
        configurable: true
    });
    LongTextEditor.prototype.init = function () {
        var _this = this;
        var cancelText = this.i18n.tr('CANCEL') || Constants.TEXT_CANCEL;
        var saveText = this.i18n.tr('SAVE') || Constants.TEXT_SAVE;
        var $container = $('body');
        this.$wrapper = $("<div class=\"slick-large-editor-text\" />").appendTo($container);
        this.$input = $("<textarea hidefocus rows=\"5\">").appendTo(this.$wrapper);
        $("<div class=\"editor-footer\">\n        <button class=\"btn btn-primary btn-xs\">" + saveText + "</button>\n        <button class=\"btn btn-default btn-xs\">" + cancelText + "</button>\n      </div>").appendTo(this.$wrapper);
        this.$wrapper.find('button:first').on('click', function (event) { return _this.save(); });
        this.$wrapper.find('button:last').on('click', function (event) { return _this.cancel(); });
        this.$input.on('keydown', this.handleKeyDown);
        this.position(this.args.position);
        this.$input.focus().select();
    };
    LongTextEditor.prototype.handleKeyDown = function (e) {
        if (e.which === KeyCode.ENTER && e.ctrlKey) {
            this.save();
        }
        else if (e.which === KeyCode.ESCAPE) {
            e.preventDefault();
            this.cancel();
        }
        else if (e.which === KeyCode.TAB && e.shiftKey) {
            e.preventDefault();
            this.args.grid.navigatePrev();
        }
        else if (e.which === KeyCode.TAB) {
            e.preventDefault();
            this.args.grid.navigateNext();
        }
    };
    LongTextEditor.prototype.save = function () {
        this.args.commitChanges();
    };
    LongTextEditor.prototype.cancel = function () {
        this.$input.val(this.defaultValue);
        this.args.cancelChanges();
    };
    LongTextEditor.prototype.hide = function () {
        this.$wrapper.hide();
    };
    LongTextEditor.prototype.show = function () {
        this.$wrapper.show();
    };
    LongTextEditor.prototype.position = function (position) {
        this.$wrapper
            .css('top', (position.top || 0) - 5)
            .css('left', (position.left || 0) - 5);
    };
    LongTextEditor.prototype.destroy = function () {
        this.$wrapper.remove();
    };
    LongTextEditor.prototype.focus = function () {
        this.$input.focus();
    };
    LongTextEditor.prototype.loadValue = function (item) {
        this.$input.val(this.defaultValue = item[this.columnDef.field]);
        this.$input.select();
    };
    LongTextEditor.prototype.serializeValue = function () {
        return this.$input.val();
    };
    LongTextEditor.prototype.applyValue = function (item, state) {
        item[this.columnDef.field] = state;
    };
    LongTextEditor.prototype.isValueChanged = function () {
        return (!(this.$input.val() === '' && this.defaultValue == null)) && (this.$input.val() !== this.defaultValue);
    };
    LongTextEditor.prototype.validate = function () {
        if (this.validator) {
            var validationResults = this.validator(this.$input.val());
            if (!validationResults.valid) {
                return validationResults;
            }
        }
        // by default the editor is always valid
        // if user want it to be a required checkbox, he would have to provide his own validator
        return {
            valid: true,
            msg: null
        };
    };
    LongTextEditor = __decorate([
        inject(I18N)
    ], LongTextEditor);
    return LongTextEditor;
}());
export { LongTextEditor };
//# sourceMappingURL=longTextEditor.js.map