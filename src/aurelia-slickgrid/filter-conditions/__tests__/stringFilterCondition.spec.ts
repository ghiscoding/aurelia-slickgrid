import { FieldType, FilterConditionOption } from '../../models/index';
import { stringFilterCondition } from '../stringFilterCondition';

describe('stringFilterCondition method', () => {
  it('should return True when no cell input value is provided which is equal to the default search term, neither search terms', () => {
    const options = { dataKey: '', operator: 'EQ', cellValue: '', fieldType: FieldType.string } as FilterConditionOption;
    const result = stringFilterCondition(options);
    expect(result).toBe(true);
  });

  it('should return False when any cell input value is provided without any search terms', () => {
    const options = { dataKey: '', operator: 'EQ', cellValue: 'foo', fieldType: FieldType.string } as FilterConditionOption;
    const result = stringFilterCondition(options);
    expect(result).toBe(false);
  });

  it('should return True when input value True is provided as cell value', () => {
    const options = { dataKey: '', operator: 'EQ', cellValue: 3, fieldType: FieldType.string, searchTerms: ['3'] } as FilterConditionOption;
    const result = stringFilterCondition(options);
    expect(result).toBe(true);
  });

  it('should return True when input value provided is equal to the searchTerms', () => {
    const options = { dataKey: '', operator: 'EQ', cellValue: 'foo', fieldType: FieldType.string, searchTerms: ['foo'] } as FilterConditionOption;
    const result = stringFilterCondition(options);
    expect(result).toBe(true);
  });

  it('should return False when the cell value is equal to at least 1 of the searchTerms', () => {
    const options = { dataKey: '', operator: 'EQ', cellValue: 'foo', fieldType: FieldType.string, searchTerms: ['bar', 'foo', 'John'] } as FilterConditionOption;
    const result = stringFilterCondition(options);
    expect(result).toBe(false);
  });

  it('should return False when cell value is inversed to the searchTerm', () => {
    const options = { dataKey: '', operator: 'EQ', cellValue: 'foo', fieldType: FieldType.string, searchTerms: ['bar'] } as FilterConditionOption;
    const result = stringFilterCondition(options);
    expect(result).toBe(false);
  });

  it('should return False even when Operator is Not Equal because condition is always a strict equal check', () => {
    const options = { dataKey: '', operator: 'NE', cellValue: 'foo', fieldType: FieldType.string, searchTerms: ['foo'] } as FilterConditionOption;
    const result = stringFilterCondition(options);
    expect(result).toBe(false);
  });
});
