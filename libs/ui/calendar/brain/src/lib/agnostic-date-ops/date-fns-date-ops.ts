import { DateOperations } from "./date-ops";
import { format,parse } from 'date-fns'

export class DateFnsOperations implements DateOperations {
  format(date: any, formatStr: string): string {
    return format(date, formatStr);
  }
  parse(dateString: string, format: string, referenceDate?:any): any {
    const refDate = referenceDate|| new Date();
    return parse(dateString, format, refDate);
  }
}