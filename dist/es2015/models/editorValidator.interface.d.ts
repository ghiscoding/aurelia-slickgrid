import { EditorArgs } from './editorArgs.interface';
import { EditorValidatorOutput } from './editorValidatorOutput.interface';
export declare type EditorValidator = (value: any, args?: EditorArgs) => EditorValidatorOutput;
