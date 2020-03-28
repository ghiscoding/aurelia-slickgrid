import { EventAggregator } from 'aurelia-event-aggregator';
import { autoinject } from 'aurelia-framework';
import { I18N } from 'aurelia-i18n';
import { HttpClient, json } from 'aurelia-fetch-client';
import {
  AureliaGridInstance,
  Column,
  Filters,
  Formatters,
  GraphqlResult,
  GraphqlService,
  GraphqlServiceApi,
  GridOption,
  Metrics,
  MultipleSelectOption,
  OperatorType,
} from '../../aurelia-slickgrid';
import './example25.scss'; // provide custom CSS/SASS styling

const COUNTRIES_API = 'https://countries.trevorblades.com/';

@autoinject()
export class Example25 {
  title = 'Example 25: GraphQL Basic API without Pagination';
  subTitle = `
  Use it as a basic GraphQL API with any external public APIs (<a href="https://github.com/ghiscoding/aurelia-slickgrid/wiki/GraphQL" target="_blank">Wiki docs</a>).
  <ul>
    <li>This Examples uses a Public GraphQL API that you can find at this link <a href="https://countries.trevorblades.com/" target="_blank">https://countries.trevorblades.com/</a></li>
    <li>Compare to the regular and default GraphQL implementation, you will find the following differenecs</li>
    <ul>
      <li>There are no Pagination and we only use GraphQL once to load the data</li>
      <li>We enabled the following 2 flags "useLocalFiltering" and "useLocalSorting" to use regular (in memory) DataView filtering/sorting</li>
    </ul>
    <li>NOTE - This Example calls multiple GraphQL queries, this is ONLY for demo purposes, you would typically only call 1 query (which is what GraphQL is good at)</li>
    <li>This demo is mainly to show the use of GraphqlService to build the query and retrieve the data but also to show how to mix that with usage of local Filtering/Sorting strategies</li>
  </ul>
  `;

  aureliaGrid: AureliaGridInstance;
  columnDefinitions: Column[];
  gridOptions: GridOption;
  dataset = [];
  metrics: Metrics;

  isWithCursor = false;
  graphqlQuery = '';
  processing = false;
  selectedLanguage: string;
  status = { text: '', class: '' };

  constructor(private ea: EventAggregator, private http: HttpClient, private i18n: I18N) {
    // define the grid options & columns and then create the grid itself
    this.defineGrid();

    // always start with English for Cypress E2E tests to be consistent
    const defaultLang = 'en';
    this.i18n.setLocale(defaultLang);
    this.selectedLanguage = defaultLang;
  }

  aureliaGridReady(aureliaGrid: AureliaGridInstance) {
    this.aureliaGrid = aureliaGrid;
  }

  defineGrid() {
    this.columnDefinitions = [
      { id: 'countryCode', field: 'code', name: 'Code', maxWidth: 90, sortable: true, filterable: true, columnGroup: 'Country' },
      { id: 'countryName', field: 'name', name: 'Name', width: 60, sortable: true, filterable: true, columnGroup: 'Country' },
      { id: 'countryNative', field: 'native', name: 'Native', width: 60, sortable: true, filterable: true, columnGroup: 'Country' },
      { id: 'countryPhone', field: 'phone', name: 'Phone Area Code', maxWidth: 110, sortable: true, filterable: true, columnGroup: 'Country' },
      { id: 'countryCurrency', field: 'currency', name: 'Currency', maxWidth: 90, sortable: true, filterable: true, columnGroup: 'Country' },
      { id: 'countryEmoji', field: 'emoji', name: 'Emoji', maxWidth: 90, sortable: true, columnGroup: 'Country' },
      {
        id: 'continentCode', field: 'continent.code', name: 'Code', maxWidth: 90,
        sortable: true,
        filterable: true,
        filter: {
          model: Filters.singleSelect,
          collectionAsync: this.getContinents(),
          collectionOptions: {
            // the data is not at the root of the array, so we must tell the Select Filter where to pull the data
            collectionInsideObjectProperty: 'data.continents',
            addBlankEntry: true,
            separatorBetweenTextLabels: ': ',
          },
          customStructure: {
            value: 'code',
            label: 'code',
            labelSuffix: 'name',
          }
        },
        formatter: Formatters.complexObject, columnGroup: 'Continent',
      },
      {
        id: 'continentName', field: 'continent.name', name: 'Name', width: 60, sortable: true,
        filterable: true, formatter: Formatters.complexObject, columnGroup: 'Continent'
      },
      {
        id: 'languageCode', field: 'languages.code', name: 'Codes', maxWidth: 100,
        formatter: Formatters.arrayObjectToCsv, params: { propertyNames: ['code'], useFormatterOuputToFilter: true }, columnGroup: 'Language',
        filterable: true,
      },
      {
        id: 'languageName', field: 'languages.name', name: 'Names', width: 60,
        formatter: Formatters.arrayObjectToCsv, columnGroup: 'Language',
        params: { propertyNames: ['name'], useFormatterOuputToFilter: true },
        filterable: true,
        // this Filter is a bit more tricky than others since the values are an array of objects
        // what we can do is use the Formatter to search from the CSV string coming from the Formatter (with "useFormatterOuputToFilter: true")
        // we also need to use the Operator IN_CONTAINS
        filter: {
          model: Filters.multipleSelect,
          collectionAsync: this.getLanguages(),
          operator: OperatorType.inContains,
          collectionOptions: {
            addBlankEntry: true,
            // the data is not at the root of the array, so we must tell the Select Filter where to pull the data
            collectionInsideObjectProperty: 'data.languages'
          },
          collectionFilterBy: [
            // filter out any empty values
            { property: 'name', value: '', operator: 'NE' },
            { property: 'name', value: null, operator: 'NE' },
          ],
          collectionSortBy: {
            property: 'name'
          },
          customStructure: {
            value: 'name',
            label: 'name',
          },
          filterOptions: {
            filter: true
          } as MultipleSelectOption
        },
      },
      {
        id: 'languageNative', field: 'languages.native', name: 'Native', width: 60,
        formatter: Formatters.arrayObjectToCsv, params: { propertyNames: ['native'] }, columnGroup: 'Language',
      },
    ];

    this.gridOptions = {
      autoResize: {
        containerId: 'demo-container',
        sidePadding: 10
      },
      enableFiltering: true,
      enableCellNavigation: true,
      enablePagination: false,
      enableTranslate: true,
      createPreHeaderPanel: true,
      showPreHeaderPanel: true,
      preHeaderPanelHeight: 28,
      i18n: this.i18n,
      datasetIdPropertyName: 'code',
      showCustomFooter: true, // display some metrics in the bottom custom footer
      backendServiceApi: {
        // use the GraphQL Service to build the query but use local (in memory) Filtering/Sorting strategies
        // the useLocalFiltering/useLocalSorting flags can be enabled independently
        service: new GraphqlService(),
        useLocalFiltering: true,
        useLocalSorting: true,

        options: {
          datasetName: 'countries', // the only REQUIRED property
        },
        // you can define the onInit callback OR enable the "executeProcessCommandOnInit" flag in the service init
        preProcess: () => this.displaySpinner(true),
        process: (query) => this.getCountries(query),
        postProcess: (result: GraphqlResult) => {
          this.metrics = result.metrics;
          this.displaySpinner(false);
        }
      } as GraphqlServiceApi
    };
  }

  displaySpinner(isProcessing) {
    this.processing = isProcessing;
    this.status = (isProcessing)
      ? { text: 'processing...', class: 'alert alert-danger' }
      : { text: 'done', class: 'alert alert-success' };
  }

  // --
  // NOTE - Demo Code ONLY
  // This Example calls multiple GraphQL queries, this is ONLY for demo purposes, you would typically only call 1 query (which is what GraphQL is good at)
  // This demo is mainly to show the use of GraphqlService to build the query and retrieve the data but also to show how to mix that with usage of local Filtering/Sorting strategies
  // --

  /** Calling the GraphQL backend API to get the Countries with the Query created by the "process" method of GraphqlService  */
  getCountries(query: string): Promise<GraphqlResult> {
    return new Promise(async resolve => {
      const response = await this.http.fetch(COUNTRIES_API, {
        method: 'post',
        body: json({ query })
      });
      resolve(response.json());
    });
  }

  /**
   * Calling again the GraphQL backend API, however in this case we cannot use the GraphQL Service to build the query
   * So we will have to write, by hand, the query to get the continents code & name
   * We also need to resolve the data in a flat array (singleSelect/multipleSelect Filters only accept data at the root of the array)
   */
  getContinents() {
    const continentQuery = `query { continents { code, name  }}`;
    return new Promise(async resolve => {
      const response = await this.http.fetch(COUNTRIES_API, {
        method: 'post',
        body: json({ query: continentQuery })
      });
      resolve(response.json());
    });
  }

  /**
   * Calling again the GraphQL backend API, however in this case we cannot use the GraphQL Service to build the query
   * So we will have to write, by hand, the query to get the languages code & name
   * We also need to resolve the data in a flat array (singleSelect/multipleSelect Filters only accept data at the root of the array)
   */
  getLanguages() {
    const continentQuery = `query { languages { code, name  }}`;
    return new Promise(async resolve => {
      const response = await this.http.fetch(COUNTRIES_API, {
        method: 'post',
        body: json({ query: continentQuery })
      });
      resolve(response.json());
    });
  }

  setFiltersDynamically() {
    // we can Set Filters Dynamically (or different filters) afterward through the FilterService
    this.aureliaGrid.filterService.updateFilters([
      { columnId: 'countryName', searchTerms: ['G'], operator: OperatorType.startsWith },
    ]);
  }

  setSortingDynamically() {
    this.aureliaGrid.sortService.updateSorting([
      // orders matter, whichever is first in array will be the first sorted column
      { columnId: 'billingAddressZip', direction: 'DESC' },
      { columnId: 'company', direction: 'ASC' },
    ]);
  }

  async switchLanguage() {
    const nextLanguage = (this.selectedLanguage === 'en') ? 'fr' : 'en';
    await this.i18n.setLocale(nextLanguage);
    this.selectedLanguage = nextLanguage;
  }
}
