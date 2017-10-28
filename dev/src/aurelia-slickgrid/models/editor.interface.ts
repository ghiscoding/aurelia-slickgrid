export interface Editor {
  init: () => void;
  applyValue: (item: any, state: any) => void;
  handleKeyDown?: (e: JQueryEventConstructor) => void;
  save?: () => void;
  cancel?: () => void;
  hide?: () => void;
  show?: () => void;
  position?: (position: any) => void;
  destroy: () => void;
  focus: () => void;
  loadValue: (item: any) => void;
  serializeValue: () => any;
  isValueChanged: () => boolean;
  validate: () => { valid: boolean, msg: string | null };
}
