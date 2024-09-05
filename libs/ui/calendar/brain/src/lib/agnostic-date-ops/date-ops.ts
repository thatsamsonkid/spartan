import { InjectionToken} from "@angular/core";

export interface DateOperations {
  format(date: any, format: string): string;
  parse(dateString: string, format: string): any;
  parse(dateString: string, format: string, referenceDate?:any): any;
}

export const DATE_OPS = new InjectionToken<DateOperations>('DATE_OPS');