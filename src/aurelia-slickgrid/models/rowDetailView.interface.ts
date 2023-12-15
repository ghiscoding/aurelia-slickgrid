import { RowDetailView as UniversalRowDetailView } from '@slickgrid-universal/common';
import { Constructable } from 'aurelia';

export interface RowDetailView extends UniversalRowDetailView {
  /**
   * Optionally pass your Parent Component reference to your Child Component (row detail component).
   * note:: If anyone finds a better way of passing the parent to the row detail extension, please reach out and/or create a PR
   */
  parent?: any;

  /** View Model of the preload template which shows after opening row detail & before row detail data shows up */
  preloadViewModel?: Constructable;

  /** View Model template that will be loaded once the async function finishes */
  viewModel?: Constructable;

  // --
  // Callback Methods

  /**
   * HTML Preload Template that will be used before the async process (typically used to show a spinner/loading)
   * It's preferable to use the "preloadView" property to use an Aurelia View instead of plain HTML.
   * If you still wish to use these methods, we strongly suggest you to sanitize your HTML, e.g. "DOMPurify.sanitize()"
   */
  preTemplate?: () => string;

  /**
   * HTML Post Template (when Row Detail data is available) that will be loaded once the async function finishes
   * It's preferable to use the "preloadView" property to use an Aurelia View instead of plain HTML
   * If you still wish to use these methods, we strongly suggest you to sanitize your HTML, e.g. "DOMPurify.sanitize()"
   */
  postTemplate?: (item: any) => string;
}
