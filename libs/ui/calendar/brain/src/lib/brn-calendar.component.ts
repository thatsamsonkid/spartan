import { ChangeDetectionStrategy, Component, type OnInit, inject, input, output } from '@angular/core';
import { DateService } from './agnostic-date-ops/date.service';
import { BrnCalendarDisplayComponent } from './brn-calendar-display.component';
import { BrnCalendarHeaderDirective } from './brn-calendar-header.directive';
import { BrnCalendarMonthYearComponent } from './brn-calendar-month-year.component';
import { BrnCalendarNextBtnDirective } from './brn-calendar-next.directive';
import { BrnCalendarPreviousBtnDirective } from './brn-calendar-previous.directive';
import { BrnCalendarViewSwitcherComponent } from './brn-calendar-view-switcher.component';
import { BrnCalendarYearDisplayComponent } from './brn-calendar-year-display.component';
import { BrnCalendarService } from './brn-calendar.service';

let uniqueId = 0;

@Component({
	selector: 'brn-calendar',
	template: `<div>
		<brn-calendar-header>

		        <!-- Probably pick one of these Calendar Header Displays or we canjust have a switch case or something -->
        <!-- 1. Similar to material will be a button to switch between views-->
        <brn-calendar-view-switcher>
            <!-- This will render the actual month year or year range content depending on view-->
            <brn-calendar-month-year/>
        </brn-calendar-view-switcher>

        <!-- 2. This will render the actual month year or year range content used standalone-->
        <!-- <brn-calendar-month-year/> -->

        <!-- 3. Will be similar to select dropdowns in react calendar for month and year-->
        <!-- <brn-calendar-month-dropdown/>
        <brn-calendar-year-dropdown>-->

        <brn-calendar-previous-btn>
		Previous
				<!-- <hlm-icon size="sm" name="lucideChevronDown" /> -->
        </brn-calendar-previous-btn>

        <brn-calendar-next-btn>
		Next
				<!-- <hlm-icon size="sm" name="lucideChevronDown" /> -->
        </brn-calendar-next-btn> 
	</brn-calendar-header>

		<!-- Maybe change this month display  -->
		 @if(view() === 'year'){
			<brn-calendar-year-display/>
			
		 } @else {
   <brn-calendar-display/>
		 }

    </div>`,
	standalone: true,
	imports: [
		BrnCalendarDisplayComponent,
		BrnCalendarHeaderDirective,
		BrnCalendarViewSwitcherComponent,
		BrnCalendarMonthYearComponent,
		BrnCalendarNextBtnDirective,
		BrnCalendarPreviousBtnDirective,
		BrnCalendarYearDisplayComponent,
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
	providers: [DateService, BrnCalendarService],
})
export class BrnCalendarComponent implements OnInit {
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

	monthSelected = output();
	selectedChange = output<Date | null>();
	viewChanged = output();
	yearSelected = output();

	//     Outputs:
	// @Output()
	// monthSelected: EventEmitter<D>

	// Emits the month chosen in year view. This doesn't imply a change on the selected date.

	// @Output()
	// selectedChange: EventEmitter<D | null>

	// Emits when the currently selected date changes.

	// @Output()
	// viewChanged: EventEmitter<MatCalendarView>

	// Emits when the current view changes.

	// @Output()
	// yearSelected: EventEmitter<D>

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
