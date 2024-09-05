import { Directive, type TemplateRef, computed, inject, input } from '@angular/core';
import { BrnCalendarService } from './brn-calendar.service';

// @Component({
// 	selector: 'brn-calendar-display',
// 	standalone: true,
// 	changeDetection: ChangeDetectionStrategy.OnPush,
// 	imports: [JsonPipe, NgTemplateOutlet],
// 	template: `
//     @if(this.currentMonthYearDays()){
//         <table class="w-full border-collapse space-y-1" role="grid">
//             <ng-content select="brn-calendar-days-of-the-week"/>
//             <ng-content select="brn-calendar-table-body"/>
//             <!-- <thead>
//                 <tr class="flex">
//                 @for(weekday of daysOfTheWeek(); track $index){
//                     @if(dayOfWeekCelltemplate()){
//                      <ng-container *ngTemplateOutlet="dayOfWeekCelltemplate(); context: { $implicit: weekday }"></ng-container>
//                     } @else {
//                          <th>{{weekday}}</th>
//                     }
//                 }
//                 </tr>
//             </thead>
//             <tbody role="rowgroup">
//             @for(week of this.currentMonthYearDays();  track $index){
//                 <tr class="flex w-full mt-2">
//                     @for(day of week;  let idx = $index; track $index + idx ){
//                         @if(dayCellTemplate()){
//                             <ng-container *ngTemplateOutlet="dayCellTemplate(); context: { $implicit: day,isToday: _brnCalendarService.isToday(day) }"></ng-container>
//                         } @else {
//                             <td><button>{{day?.getDate()}} </button></td>
//                         }
//                     }
//                 </tr>
//             }
//         </tbody> -->
//         </table>
//     }

//     			<!-- <ng-template #dayOfWeekTemplate let-item>
//                  <th>{{weekday}}</th>
// 			</ng-template> -->

//     <!-- brn-calendar-month-display - table wrapper
//      -  brn-calendar-days-of-the-week - pass as content to parent
//      -  brn-calendar-days-of-the-month - pass as content to parent -->
//     `,
// })
@Directive({
	selector: 'table[brnCalendarDisplay]',
	standalone: true,
})
export class BrnCalendarDisplayComponent {
	private _brnCalendarService = inject(BrnCalendarService);

	protected currentMonthYearDays = computed(() => this._brnCalendarService.currentMonthYearDays());
	protected daysOfTheWeek = computed(() => this._brnCalendarService.daysOfTheWeek());
	// protected today = computed(() => this._brnCalendarService.getToday());

	dayOfWeekCelltemplate = input<TemplateRef<HTMLElement>>();

	dayCellTemplate = input<TemplateRef<HTMLElement>>();
}
