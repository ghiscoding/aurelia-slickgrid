// import 3rd party lib multiple-select for the tests
import '../../../assets/lib/multiple-select/multiple-select';

import { DOM } from 'aurelia-pal';
import { BindingEngine } from 'aurelia-binding';
import { EventAggregator } from 'aurelia-event-aggregator';
import { HttpClient } from 'aurelia-fetch-client';
import { I18N } from 'aurelia-i18n';
import { BindingSignaler } from 'aurelia-templating-resources';
import { Editors } from '../index';
import { SingleSelectEditor } from '../singleselectEditor';
import { CollectionService } from '../../services/collection.service';
import { AutocompleteOption, Column, EditorArgs, EditorArguments, GridOption, KeyCode } from '../../models';

const KEY_CHAR_A = 97;
const containerId = 'demo-container';

// define a <div> container to simulate the grid container
const template = `<div id="${containerId}"></div>`;

const bindingEngineStub = {
  createBindingExpression: jest.fn(),
  collectionObserver: jest.fn(),
  expressionObserver: jest.fn(),
  propertyObserver: jest.fn(),
  parseExpression: jest.fn(),
  registerAdapter: jest.fn(),
} as unknown as BindingEngine;

const dataViewStub = {
  refresh: jest.fn(),
};

const gridOptionMock = {
  autoCommitEdit: false,
  editable: true,
  i18n: null,
} as GridOption;

const getEditorLockMock = {
  commitCurrentEdit: jest.fn(),
};

const gridStub = {
  getOptions: () => gridOptionMock,
  getColumns: jest.fn(),
  getEditorLock: () => getEditorLockMock,
  getHeaderRowColumn: jest.fn(),
  navigateNext: jest.fn(),
  navigatePrev: jest.fn(),
  render: jest.fn(),
};

class HttpStub extends HttpClient {
  status: number;
  statusText: string;
  object: any = {};
  returnKey: string;
  returnValue: any;
  responseHeaders: any;

  fetch(input, init) {
    let request;
    const responseInit: any = {};
    responseInit.headers = new Headers()

    for (const name in this.responseHeaders || {}) {
      if (name) {
        responseInit.headers.set(name, this.responseHeaders[name]);
      }
    }

    responseInit.status = this.status || 200;

    if (Request.prototype.isPrototypeOf(input)) {
      request = input;
    } else {
      request = new Request(input, init || {});
    }
    if (request.body && request.body.type) {
      request.headers.set('Content-Type', request.body.type);
    }

    const promise = Promise.resolve().then(() => {
      if (request.headers.get('Content-Type') === 'application/json' && request.method !== 'GET') {
        return request.json().then((object) => {
          object[this.returnKey] = this.returnValue;
          const data = JSON.stringify(object);
          const response = new Response(data, responseInit);
          return this.status >= 200 && this.status < 300 ? Promise.resolve(response) : Promise.reject(response);
        });
      } else {
        const data = JSON.stringify(this.object);
        const response = new Response(data, responseInit);
        return this.status >= 200 && this.status < 300 ? Promise.resolve(response) : Promise.reject(response);
      }
    });
    return promise;
  }
}

describe('SingleSelectEditor', () => {
  let ea: EventAggregator;
  let i18n: I18N;
  let divContainer: HTMLDivElement;
  let editor: SingleSelectEditor;
  let editorArguments: EditorArguments;
  let mockColumn: Column;
  let mockItemData: any;
  let collectionService: CollectionService;
  const http = new HttpStub();

  beforeEach(() => {
    ea = new EventAggregator();
    i18n = new I18N(ea, new BindingSignaler());
    collectionService = new CollectionService(i18n);

    divContainer = document.createElement('div');
    divContainer.innerHTML = template;
    document.body.appendChild(divContainer);

    i18n.setup({
      resources: {
        en: {
          translation: {
            CANCEL: 'Cancel',
            SAVE: 'Save',
          }
        },
        fr: {
          translation:
          {
            CANCEL: 'Annuler',
            SAVE: 'Sauvegarder',
          }
        }
      },
      lng: 'en',
      fallbackLng: 'en',
      debug: false
    });

    mockColumn = { id: 'gender', field: 'gender', editable: true, editor: { model: Editors.multipleSelect }, internalColumnEditor: {} } as Column;

    editorArguments = {
      grid: gridStub,
      column: mockColumn,
      item: mockItemData,
      event: null,
      cancelChanges: jest.fn(),
      commitChanges: jest.fn(),
      container: divContainer,
      columnMetaData: null,
      dataView: dataViewStub,
      gridPosition: { top: 0, left: 0, bottom: 10, right: 10, height: 100, width: 100, visible: true },
      position: { top: 0, left: 0, bottom: 10, right: 10, height: 100, width: 100, visible: true },
    };
  });

  describe('with valid Editor instance', () => {
    beforeEach(() => {
      mockItemData = { id: 1, gender: 'male', isActive: true };
      mockColumn = { id: 'gender', field: 'gender', editable: true, editor: { model: Editors.multipleSelect }, internalColumnEditor: {} } as Column;
      mockColumn.internalColumnEditor.collection = [{ value: '', label: '' }, { value: 'male', label: 'male' }, { value: 'female', label: 'female' }];

      editorArguments.column = mockColumn;
      editorArguments.item = mockItemData;
    });

    afterEach(() => {
      editor.destroy();
    });

    it('should initialize the editor', () => {
      mockColumn.internalColumnEditor.collection = [{ value: 'male', label: 'male' }, { value: 'female', label: 'female' }];
      gridOptionMock.i18n = i18n;
      editor = new SingleSelectEditor(bindingEngineStub, collectionService, i18n, editorArguments);
      const editorCount = document.body.querySelectorAll('select.ms-filter.editor-gender').length;

      expect(editorCount).toBe(1);
    });

    it('should hide the DOM element div wrapper when the "hide" method is called', () => {
      editor = new SingleSelectEditor(bindingEngineStub, collectionService, i18n, editorArguments);
      const editorElm = document.body.querySelector<HTMLDivElement>('[name=editor-gender].ms-drop');

      editor.show();
      expect(editorElm.style.display).toBe('');

      editor.hide();
      expect(editorElm.style.display).toBe('none');
    });

    it('should show the DOM element div wrapper when the "show" method is called', () => {
      editor = new SingleSelectEditor(bindingEngineStub, collectionService, i18n, editorArguments);
      const editorElm = document.body.querySelector<HTMLDivElement>('[name=editor-gender].ms-drop');

      editor.hide();
      expect(editorElm.style.display).toBe('none');

      editor.show();
      expect(editorElm.style.display).toBe('');
    });

    it('should call "setValue" with a single string and expect the string to be returned as an single string when calling "getValue"', () => {
      editor = new SingleSelectEditor(bindingEngineStub, collectionService, i18n, editorArguments);
      editor.setValue('male');

      expect(editor.getValue()).toEqual('male');
    });

    describe('isValueChanged method', () => {
      it('should return True after doing a check of an option', () => {
        editor = new SingleSelectEditor(bindingEngineStub, collectionService, i18n, editorArguments);
        const editorBtnElm = divContainer.querySelector<HTMLButtonElement>('.ms-parent.ms-filter.editor-gender button.ms-choice');
        const editorListElm = divContainer.querySelectorAll<HTMLInputElement>(`[name=editor-gender].ms-drop ul>li input[type=radio]`);
        editorBtnElm.click();

        // we can use property "checked" or dispatch an event
        editorListElm[0].dispatchEvent(DOM.createCustomEvent('click'));

        expect(editorListElm.length).toBe(3);
        expect(editor.isValueChanged()).toBe(true);
      });

      it('should return False after re-selecting the same option as the one loaded', () => {
        mockColumn.internalColumnEditor.collection = ['male', 'female'];
        mockItemData = { id: 1, gender: 'male', isActive: true };

        editor = new SingleSelectEditor(bindingEngineStub, collectionService, i18n, editorArguments);
        editor.loadValue(mockItemData);

        const editorBtnElm = divContainer.querySelector<HTMLButtonElement>('.ms-parent.ms-filter.editor-gender button.ms-choice');
        const editorListElm = divContainer.querySelectorAll<HTMLInputElement>(`[name=editor-gender].ms-drop ul>li input[type=radio]`);
        editorBtnElm.click();

        // we can use property "checked" or dispatch an event
        editorListElm[0].dispatchEvent(DOM.createCustomEvent('click'));

        expect(editorListElm.length).toBe(2);
        expect(editor.isValueChanged()).toBe(false);
      });
    });

    describe('serializeValue method', () => {
      it('should return serialized value as a string', () => {
        mockItemData = { id: 1, gender: 'male', isActive: true };

        editor = new SingleSelectEditor(bindingEngineStub, collectionService, i18n, editorArguments);
        editor.loadValue(mockItemData);
        const output = editor.serializeValue();

        expect(output).toBe('male');
      });
    });

    describe('serializeValue method', () => {
      it('should return serialized value as a string', () => {
        mockItemData = { id: 1, gender: 'male', isActive: true };

        editor = new SingleSelectEditor(bindingEngineStub, collectionService, i18n, editorArguments);
        editor.loadValue(mockItemData);
        const output = editor.serializeValue();

        expect(output).toEqual('male');
      });

      it('should return serialized value as an empty array when item value is also an empty string', () => {
        mockItemData = { id: 1, gender: '', isActive: true };

        editor = new SingleSelectEditor(bindingEngineStub, collectionService, i18n, editorArguments);
        editor.loadValue(mockItemData);
        const output = editor.serializeValue();

        expect(output).toEqual('');
      });

      it('should return serialized value as an empty string when item value is null', () => {
        mockItemData = { id: 1, gender: null, isActive: true };

        editor = new SingleSelectEditor(bindingEngineStub, collectionService, i18n, editorArguments);
        editor.loadValue(mockItemData);
        const output = editor.serializeValue();

        expect(output).toEqual('');
      });

      it('should return value as a string when using a dot (.) notation for complex object', () => {
        mockColumn.field = 'employee.gender';
        mockColumn.internalColumnEditor.collection = ['male', 'female'];
        mockItemData = { id: 1, employee: { gender: 'male' }, isActive: true };

        editor = new SingleSelectEditor(bindingEngineStub, collectionService, i18n, editorArguments);
        editor.loadValue(mockItemData);
        const output = editor.serializeValue();

        expect(output).toEqual('male');
      });
    });
  });
});
