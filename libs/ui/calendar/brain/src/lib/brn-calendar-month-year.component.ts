import { Component, computed, inject } from '@angular/core';
import { BrnCalendarService } from './brn-calendar.service';

@Component({
	selector: 'brn-calendar-month-year',
	standalone: true,
	template: `
    @if(view() === 'month'){
    {{month()}} {{year()}}
    } @else {
         {{startingYear()}} - {{endingYear()}}
    }

    `,
})
export class BrnCalendarMonthYearComponent {
	private _brnCalendarService = inject(BrnCalendarService);
	protected view = this._brnCalendarService.view;

	protected monthYear = this._brnCalendarService.currentMonthYear();
	protected month = computed(() => this._brnCalendarService.currentMonthName());
	protected year = computed(() => this._brnCalendarService.currentYear());
	protected startingYear = computed(() => {
		const years = this._brnCalendarService.years();
		// First row and first index
		return years?.[0]?.[0]?.getFullYear();
	});
	protected endingYear = computed(() => {
		const years = this._brnCalendarService.years();
		// Last row and last index
		const lastRow = (years?.length ?? 1) - 1;
		return years?.[lastRow]?.[years[lastRow].length - 1]?.getFullYear();
	});
}
