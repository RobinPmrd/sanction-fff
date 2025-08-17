import moment from 'moment/moment';

export function parseDate(value: any): Date | null {
  if (typeof value === 'string') {
    const stringToMoment = moment(value, 'DD/MM/YYYY', true);
    if (stringToMoment.isValid()) {
      return stringToMoment.toDate()
    }
  }
  return value;
}

export function toCamelCase(str: string): string {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[\s_-]+(.)?/g, (_, chr) => chr ? chr.toUpperCase() : "")
    .replace(/[^\w]/g, ""); // remove accents/punctuation if needed
}
