import { InputFilter } from './inputFilter';
import { FilterArguments } from '../models/filterArguments.interface';

export class InputMaskFilter extends InputFilter {
  /** Initialize the Filter */
  constructor() {
    super();
    this.inputType = 'text';
  }

  /** Getter of the input mask, when provided */
  get inputMask(): string {
    return this.columnDef.params && this.columnDef.params && this.columnDef.params.mask;
  }

  /**
   * Override the Filter init used by SlickGrid
   */
  init(args: FilterArguments) {
    if (!args) {
      throw new Error('[Aurelia-SlickGrid] A filter must always have an "init()" with valid arguments.');
    }
    this.grid = args.grid;
    this.callback = args.callback;
    this.columnDef = args.columnDef;
    this.searchTerms = args.searchTerms || [];

    // filter input can only have 1 search term, so we will use the 1st array index if it exist
    const searchTerm = (Array.isArray(this.searchTerms) && this.searchTerms[0]) || '';

    // step 1, create HTML string template
    const filterTemplate = this.buildTemplateHtmlString();

    // step 2, create the DOM Element of the filter & initialize it if searchTerm is filled
    this.$filterElm = this.createDomElement(filterTemplate, searchTerm);

    // step 3, subscribe to the keyup event and run the callback when that happens
    // also add/remove "filled" class for styling purposes
    this.$filterElm.on('keyup input change', (e: any) => {
      let value = '';
      if (e && e.target && e.target.value) {
        value = e.target.value;

        // if it has a mask, we need to do a bit more work
        // and replace the filter string by the masked output without triggering an event
        const unmaskedValue = this.unmaskValue(value);
        const maskedValue = this.maskValue(unmaskedValue);
        value = unmaskedValue;

        if (e.keyCode >= 48) {
          this.$filterElm.val(maskedValue); // replace filter string with masked string
          e.preventDefault();
        }
      }

      if (this._clearFilterTriggered) {
        this.callback(e, { columnDef: this.columnDef, clearFilterTriggered: this._clearFilterTriggered });
        this._clearFilterTriggered = false; // reset flag for next use
        this.$filterElm.removeClass('filled');
      } else {
        this.$filterElm.addClass('filled');
        this.callback(e, { columnDef: this.columnDef, operator: this.operator, searchTerms: [value] });
      }
    });
  }

  /** From a regular string, we will use the mask to output a new string */
  private maskValue(inputValue: string): string {
    let i = 0;
    let maskedValue = '';

    if (this.inputMask) {
      maskedValue = this.inputMask.replace(/[09A]/gi, (match) => {
        // only replace the char when the mask is a 0 or 9 for a digit OR the mask is "A" and the char is a non-digit meaning a string char
        if (
          ((match === '0' || match === '9') && /\d*/g.test(inputValue[i]))    // mask is 0 or 9 and value is a digit
          || (match.toUpperCase() === 'A' && /[^\d]*/gi.test(inputValue[i]))  // OR mask is an "A" and value is non-digit
        ) {
          return inputValue[i++] || '';
        }
        return '';
      });
    }

    return maskedValue;
  }

  /** From a masked string, we will remove the mask and make a regular string again */
  private unmaskValue(maskedValue: string): string {
    let maskedMatches = [];

    if (/[a-z]/gi.test(this.inputMask) && /[^0-9]/gi.test(this.inputMask)) {
      // chars only without numbers in the string
      maskedMatches = maskedValue.match(/[a-z]*/gi);
    } else if (/[0-9]/gi.test(this.inputMask) && /[^a-z]/gi.test(this.inputMask)) {
      // numbers only without chars in the string
      maskedMatches = maskedValue.match(/[0-9]*/gi);
    } else {
      maskedMatches = maskedValue.match(/[0-9a-z]*/gi);
    }
    if (Array.isArray(maskedMatches)) {
      return maskedMatches.join('');
    }
    return '';
  }
}
