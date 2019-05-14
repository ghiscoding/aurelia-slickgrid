import { booleanFilterCondition } from './booleanFilterCondition';
import { FieldType, FilterConditionOption } from './../models/index';

/** will return True in all cases with only 1 exception when the only searchTerm is inversed to the cell value */

describe('booleanFilterCondition method', () => {
  it('should return True when no cell value is provided, neither search terms', () => {
    const options = { dataKey: '', operator: 'EQ', cellValue: '', fieldType: FieldType.string } as FilterConditionOption;
    const result = booleanFilterCondition(options);
    expect(result).toBe(true);
  });

  it('should return True when any cell value is provided', () => {
    const options = { dataKey: '', operator: 'EQ', cellValue: 'foo', fieldType: FieldType.string } as FilterConditionOption;
    const result = booleanFilterCondition(options);
    expect(result).toBe(true);
  });

  it('should return True when boolean value True is provided as cell value', () => {
    const options = { dataKey: '', operator: 'EQ', cellValue: 'true', fieldType: FieldType.string, searchTerms: [true] } as FilterConditionOption;
    const result = booleanFilterCondition(options);
    expect(result).toBe(true);
  });

  it('should return True when boolean value provided is equal to the searchTerms', () => {
    const options = { dataKey: '', operator: 'EQ', cellValue: true, fieldType: FieldType.string, searchTerms: [true] } as FilterConditionOption;
    const result = booleanFilterCondition(options);
    expect(result).toBe(true);
  });

  it('should return True when the cell value is equal to at least 1 of the searchTerms', () => {
    const options = { dataKey: '', operator: 'EQ', cellValue: true, fieldType: FieldType.string, searchTerms: ['true', 'false'] } as FilterConditionOption;
    const result = booleanFilterCondition(options);
    expect(result).toBe(true);
  });

  it('should return False when cell value is inversed to the searchTerm', () => {
    const options = { dataKey: '', operator: 'EQ', cellValue: false, fieldType: FieldType.string, searchTerms: [true] } as FilterConditionOption;
    const result = booleanFilterCondition(options);
    expect(result).toBe(false);
  });

  it('should return True even when Operator is Not Equal because condition is always a strict equal check', () => {
    const options = { dataKey: '', operator: 'NE', cellValue: false, fieldType: FieldType.string, searchTerms: [true] } as FilterConditionOption;
    const result = booleanFilterCondition(options);
    expect(result).toBe(false);
  });
});
