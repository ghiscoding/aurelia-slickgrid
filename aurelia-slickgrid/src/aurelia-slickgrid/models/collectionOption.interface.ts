export interface CollectionOption {
  /**
   * Optionally add a blank entry to the beginning of the collection.
   * Useful when we want to return all data by setting an empty filter that might not exist in the original collection
   */
  addBlankEntry?: boolean;

  /**
   * When the collection is inside an object descendant property
   * we can optionally pass a dot (.) notation string to pull the collection from an object property.
   * For example if our output data is:
   * myData = { someProperty: { myCollection: [] }, otherProperty: 'something' }
   * We can pass the dot notation string
   * collectionInObjectProperty: 'someProperty.myCollection'
   */
  collectionInObjectProperty?: string;

  /** defaults to empty, when using label with prefix/suffix, do we want to add a separator between each text (like a white space) */
  separatorBetweenTextLabels?: string;

  /** defaults to false, should the selected value include the prefix/suffix in the output format */
  includePrefixSuffixToSelectedValues?: boolean;
}
