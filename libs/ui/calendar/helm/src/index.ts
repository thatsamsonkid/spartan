import { NgModule } from '@angular/core';
import { HlmCalendarComponent } from './lib/hlm-calendar.component';

export * from './lib/hlm-calendar.component';
export * from './lib/hlm-calendar-day-cell.directive';
export * from './lib/hlm-calendar-header.component';
export * from './lib/hlm-calendar-month-year.component';
export * from './lib/hlm-calendar-next-button.directive';
export * from './lib/hlm-calendar-previous-button.directive';

export const HlmCalendarImports = [HlmCalendarComponent] as const;

@NgModule({
	imports: [...HlmCalendarImports],
	exports: [...HlmCalendarImports],
})
export class HlmCalendarModule {}
