import { Column, Formatter } from './../models/index';

export const hyperlinkFormatter: Formatter = (row: number, cell: number, value: any, columnDef: Column, dataContext: any) => {
  const matchUrl = value.match(/^(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:\/~\+#]*[\w\-\@?^=%&amp;\/~\+#])?/, 'i');
  if (matchUrl && Array.isArray(matchUrl)) {
    return `<a href="${matchUrl[0]}">' + value + '</a>`;
  }
  return '';
};
