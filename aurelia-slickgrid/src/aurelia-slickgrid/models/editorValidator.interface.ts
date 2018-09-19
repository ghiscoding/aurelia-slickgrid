import { EditorArgs } from './editorArgs.interface';
import { EditorValidatorOutput } from './editorValidatorOutput.interface';

export type EditorValidator = (value: any, args?: EditorArgs) => EditorValidatorOutput;
