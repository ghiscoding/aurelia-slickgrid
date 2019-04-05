import { Column, Formatter } from './../models/index';

export const progressBarFormatter: Formatter = (row: number, cell: number, value: any, columnDef: Column, dataContext: any): string => {
  if (value === null || value === undefined || value === '') {
    return '';
  }

  let color;

  if (value < 30) {
    color = 'danger';
  } else if (value < 70) {
    color = 'warning';
  } else {
    color = 'success';
  }

  return `<div class="progress">
    <div class="progress-bar progress-bar-${color} bg-${color}" role="progressbar" aria-valuenow="${value}" aria-valuemin="0" aria-valuemax="100" style="min-width: 2em; width: ${value}%;">
    ${value}%
    </div>
  </div>`;
};
