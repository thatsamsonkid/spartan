import { Directive, type OnInit, inject, input } from '@angular/core';
import { DateService } from './agnostic-date-ops/date.service';
import { BrnCalendarService } from './brn-calendar.service';

let uniqueId = 0;

@Directive({
	selector: 'brn-calendar, [brnCalendar]',
	standalone: true,
	providers: [DateService, BrnCalendarService],
})
export class BrnCalendarDirective implements OnInit {
	private _brnCalendarService = inject(BrnCalendarService);

	mode = input<'single' | 'multiple' | 'range'>('single');
	selectedDate = input<Date | null>(null);
	minDate = input<Date | null>(null);
	maxDate = input<Date | null>(null);
	startAt = input<Date | null>(null);
	startView = input<'month' | 'year'>('month');
	dateFilter = input<(d: Date) => boolean>();
	locale = input<string>(this._brnCalendarService.getLocale());
	weekStartsOn = input<1 | 2 | 3 | 4 | 5 | 6 | 7>();
	dir = input<'ltr' | 'rtl'>();

	view = this._brnCalendarService.view;

	ngOnInit(): void {
		this._brnCalendarService.state.update((state) => ({
			...state,
			id: `brn-calendar-${uniqueId++}`,
			mode: this.mode(),
			selectedDate: this.selectedDate(),
			minDate: this.minDate(),
			maxDate: this.maxDate(),
			startAt: this.startAt(),
			startView: this.startView(),
			dateFilter: this.dateFilter(),
			locale: this.locale(),
		}));

		this._brnCalendarService.generateCalendar();
	}
}
