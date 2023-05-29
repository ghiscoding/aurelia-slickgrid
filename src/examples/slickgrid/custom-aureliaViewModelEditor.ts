import { View, ViewSlot } from 'aurelia-framework';

import {
  AureliaUtilService,
  Column,
  Editor,
  EditorValidator,
  EditorValidationResult,
  GridOption,
  SlickGrid,
} from '../../aurelia-slickgrid';

/*
 * An example of a 'detached' editor.
 * KeyDown events are also handled to provide handling for Tab, Shift-Tab, Esc and Ctrl-Enter.
 */
export class CustomAureliaViewModelEditor implements Editor {
  /** Aurelia ViewModel Reference */
  aureliaViewModel: any;

  aureliaCustomElementInstance: any;

  /** default item Id */
  defaultId?: string;

  /** default item object */
  defaultItem: any;

  selectedItem: any;

  /** SlickGrid grid object */
  grid: SlickGrid;

  constructor(private args: any) {
    this.grid = args && args.grid;
    this.init();
  }

  /** Aurelia Util Service (could be inside the Grid Options Params or the Editor Params ) */
  get aureliaUtilService(): AureliaUtilService {
    let aureliaUtilService = this.gridOptions && this.gridOptions.params && this.gridOptions.params.aureliaUtilService;
    if (!aureliaUtilService || !(aureliaUtilService instanceof AureliaUtilService)) {
      aureliaUtilService = this.columnEditor && this.columnEditor.params && this.columnEditor.params.aureliaUtilService;
    }
    return aureliaUtilService;
  }

  /** Get the Collection */
  get collection(): any[] {
    return this.columnDef?.internalColumnEditor?.collection ?? [];
  }

  /** Get Column Definition object */
  get columnDef(): Column {
    return this.args?.column ?? {};
  }

  /** Get Column Editor object */
  get columnEditor(): any {
    return this.columnDef?.internalColumnEditor ?? {};
  }

  /** Getter for the Grid Options pulled through the Grid Object */
  get gridOptions(): GridOption {
    return this.grid?.getOptions() ?? {} as GridOption;
  }

  get hasAutoCommitEdit() {
    return this.args.grid.getOptions().autoCommitEdit;
  }

  /** Get the Validator function, can be passed in Editor property or Column Definition */
  get validator(): EditorValidator {
    return this.columnEditor.validator || this.columnDef.validator;
  }

  init() {
    if (!this.columnEditor || !this.columnEditor.params || !this.columnEditor.params.templateUrl) {
      throw new Error(`[Aurelia-Slickgrid] For the Editors.aureliaComponent to work properly, you need to fill in the "templateUrl" property of your Custom Element Editor.
      Example: this.columnDefs = [{ id: 'title', field: 'title', editor: { templateUrl: PLATFORM.moduleName('my-viewmodel'), collection: [...] },`);
    }
    if (this.columnEditor && this.columnEditor.params && this.columnEditor.params.templateUrl) {
      this.aureliaViewModel = (this.columnEditor.params.aureliaUtilService as AureliaUtilService).createAureliaViewModelAddToSlot(this.columnEditor.params.templateUrl, { collection: this.collection }, this.args.container, true);
    }
  }

  disposeViewSlot(createdView: { view?: View; viewSlot?: ViewSlot; }) {
    if (createdView && createdView.view && createdView.viewSlot && createdView.view.unbind && createdView.viewSlot.remove) {
      const container = this.args.container;
      if (container && container.length > 0) {
        createdView.viewSlot.remove(createdView.view);
        createdView.view.unbind();
        container[0].innerHTML = '';
        return createdView;
      }
    }
    return null;
  }

  save() {
    const validation = this.validate();
    if (validation && validation.valid) {
      if (this.hasAutoCommitEdit) {
        this.args.grid.getEditorLock().commitCurrentEdit();
      } else {
        this.args.commitChanges();
      }
    }
  }

  cancel() {
    this.aureliaCustomElementInstance.selectedId = this.defaultId;
    this.aureliaCustomElementInstance.selectedItem = this.defaultItem;
    if (this.args && this.args.cancelChanges) {
      this.args.cancelChanges();
    }
  }

  /** destroy the Aurelia ViewModel & Subscription */
  destroy() {
    if (this.aureliaViewModel && this.aureliaViewModel.dispose) {
      this.aureliaViewModel.dispose();
      this.disposeViewSlot(this.aureliaViewModel.viewSlot);
    }
  }

  /** optional, implement a hide method on your Aurelia ViewModel */
  hide() {
    if (this.aureliaViewModel && this.aureliaViewModel.bindings.viewModelRef.currentViewModel && typeof this.aureliaViewModel.bindings.viewModelRef.currentViewModel.hide === 'function') {
      this.aureliaViewModel.bindings.viewModelRef.currentViewModel.hide();
    }
  }

  /** optional, implement a show method on your Aurelia ViewModel */
  show() {
    if (typeof this.aureliaViewModel?.bindings.viewModelRef.currentViewModel?.show === 'function') {
      this.aureliaViewModel.bindings.viewModelRef.currentViewModel.show();
    }
  }

  /** optional, implement a focus method on your Aurelia ViewModel */
  focus() {
    if (typeof this.aureliaViewModel?.bindings.viewModelRef.currentViewModel?.focus === 'function') {
      this.aureliaViewModel.bindings.viewModelRef.currentViewModel.focus();
    }
  }

  applyValue(item: any, state: any) {
    item[this.columnDef.field] = state;
  }

  getValue() {
    return this.aureliaCustomElementInstance.selectedId;
  }

  loadValue(item: any) {
    const itemObject = item && item[this.columnDef.field];
    this.selectedItem = itemObject;
    setTimeout(() => {
      this.aureliaCustomElementInstance = this.aureliaViewModel.bindings.viewModelRef.currentViewModel;
      this.aureliaCustomElementInstance.selectedItem = itemObject;
      this.aureliaCustomElementInstance.selectedItemChanged = ((newItem: any) => {
        this.selectedItem = newItem;
        if (newItem !== itemObject) {
          this.save();
        }
      });
    });
  }

  serializeValue(): any {
    return this.selectedItem;
  }

  isValueChanged() {
    return (!(this.selectedItem.id === '' && (this.defaultId === null || this.defaultId === undefined))) && (this.selectedItem.id !== this.defaultId);
  }

  validate(): EditorValidationResult {
    if (this.validator) {
      const value = this.selectedItem.id;
      return this.validator(value, this.args);
    }

    // by default the editor is always valid
    // if user want it to be required, he would have to provide his own validator
    return {
      valid: true,
      msg: null
    };
  }
}
