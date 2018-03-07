interface StringConstructor {
    allTitleCase(inputStr: string): string;
    format(inputStr: string, ...args: any[]): string;
    trim(inputStr: string): string;
    titleCase(inputStr: string): string;
}
interface Array<T> {
    findOrDefault(logic: (item: any) => boolean): {};
}
