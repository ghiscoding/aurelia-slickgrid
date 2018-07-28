export function configure(config) {
  config.globalResources([
    './value-converters/date-format',
    './value-converters/stringify'
  ]);
}
