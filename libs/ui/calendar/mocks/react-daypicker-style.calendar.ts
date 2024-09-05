import { Component, type OnInit, inject } from '@angular/core';
import {
	BrnCalendarDirective,
	BrnCalendarDisplayComponent,
	BrnCalendarHeaderDirective,
	BrnCalendarMonthYearComponent,
	BrnCalendarNextBtnDirective,
	BrnCalendarPreviousBtnDirective,
	BrnCalendarService,
	BrnCalendarViewSwitcherComponent,
	BrnCalendarYearDisplayComponent,
} from '../brain/src';

@Component({
	selector: 'hlm-react-daypicker-calendar',
	standalone: true,
	hostDirectives: [BrnCalendarDirective],
	imports: [
		BrnCalendarDirective,
		BrnCalendarHeaderDirective,
		BrnCalendarViewSwitcherComponent,
		BrnCalendarMonthYearComponent,
		BrnCalendarPreviousBtnDirective,
		BrnCalendarNextBtnDirective,
		BrnCalendarYearDisplayComponent,
		BrnCalendarDisplayComponent,
	],
	template: `<brn-calendar>
		<brn-calendar-header>
        <!-- 3. Will be similar to select dropdowns in react calendar for month and year-->
        <!-- <brn-calendar-month-dropdown/>
        <brn-calendar-year-dropdown>-->
	</brn-calendar-header>

		<!-- Maybe change this month display  -->
		 @if(view() === 'year'){
			<brn-calendar-year-display/>
			
		 } @else {
   <brn-calendar-display/>
		 }

		</brn-calendar>`,
})
export class ReactDayCalendarComponent implements OnInit {
	private _brnCalendarService = inject(BrnCalendarService);
	view = this._brnCalendarService.view;

	ngOnInit(): void {}
}
