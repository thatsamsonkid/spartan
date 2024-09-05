import { Component, type OnInit, inject } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { lucideChevronLeft, lucideChevronRight } from '@ng-icons/lucide';
import { HlmIconComponent } from '@spartan-ng/ui-icon-helm';
import {
	BrnCalendarDaysOfTheWeekComponent,
	BrnCalendarDirective,
	BrnCalendarDisplayComponent,
	BrnCalendarHeaderDirective,
	BrnCalendarMonthYearComponent,
	BrnCalendarNextBtnDirective,
	BrnCalendarPreviousBtnDirective,
	BrnCalendarService,
	BrnCalendarTableBodyComponent,
	BrnCalendarViewSwitcherComponent,
	BrnCalendarYearDisplayComponent,
} from '../brain/src';
import { HlmCalendarHeaderComponent } from '../helm/src/lib/hlm-calendar-header.component';
import { HlmCalendarNextButtonDirective } from '../helm/src/lib/hlm-calendar-next-button.directive';
import { HlmCalendarPreviousButtonDirective } from '../helm/src/lib/hlm-calendar-previous-button.directive';

@Component({
	selector: 'hlm-material-calendar',
	standalone: true,
	hostDirectives: [BrnCalendarDirective],
	host: {
		class: 'block p-3 rounded-md border max-w-fit',
	},
	imports: [
		BrnCalendarDirective,
		BrnCalendarHeaderDirective,
		BrnCalendarViewSwitcherComponent,
		BrnCalendarMonthYearComponent,
		BrnCalendarPreviousBtnDirective,
		BrnCalendarNextBtnDirective,
		BrnCalendarYearDisplayComponent,
		BrnCalendarDisplayComponent,
		HlmCalendarHeaderComponent,
		HlmCalendarPreviousButtonDirective,
		HlmCalendarNextButtonDirective,
		BrnCalendarDaysOfTheWeekComponent,
		BrnCalendarTableBodyComponent,
		HlmIconComponent,
	],
	providers: [provideIcons({ lucideChevronLeft, lucideChevronRight })],
	template: `
		<div class="flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0">
			<div class="space-y-4">
				<brn-calendar-header hlm>
					<!-- Probably pick one of these Calendar Header Displays or we canjust have a switch case or something -->
					<!-- 1. Similar to material will be a button to switch between views-->
					<brn-calendar-view-switcher>
						<!-- This will render the actual month year or year range content depending on view-->
						<brn-calendar-month-year/>
					</brn-calendar-view-switcher>
					
					<div class="flex gap-1">
						<brn-calendar-previous-btn hlm>
								<hlm-icon size="sm" name="lucideChevronLeft" />
						</brn-calendar-previous-btn>

						<brn-calendar-next-btn hlm>
								<hlm-icon size="sm" name="lucideChevronRight" />
						</brn-calendar-next-btn> 
					</div>
				</brn-calendar-header>

				<!-- Maybe change this month display  -->
				@if(view() === 'year'){
					<brn-calendar-year-display/>
				} @else {
			<table brnCalendarDisplay class="w-full border-collapse space-y-1 flex flex-col">
				<brn-calendar-days-of-the-week [dayOfWeekCelltemplate]="dayOfWeekTemplate" hlm/>
				<brn-calendar-table-body [dayCellTemplate]="dayOfMonthTemplate" hlm/>
		 	</table>

			<ng-template #dayOfWeekTemplate let-weekday>
                 <th class="text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]">{{weekday}}</th>
			</ng-template>

			<ng-template #dayOfMonthTemplate let-day let-isToday="isToday">
				@if(day){
                 <td class="rounded-md w-9 font-normal text-[0.8rem]" role="presentation">
					<button role="gridcell" type="buttons" class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 w-9 p-0 font-normal aria-selected:opacity-100" 

					[class.bg-accent]="isToday">
						{{day?.getDate()}}
					</button>
				</td>
				} @else {
                <td class="w-9" role="presentation"></td>
				}
 
			</ng-template>
				}
			</div>
			</div>`,
})
export class MaterialStyleCalendarComponent implements OnInit {
	private _brnCalendarService = inject(BrnCalendarService);
	view = this._brnCalendarService.view;

	ngOnInit(): void {}
}
