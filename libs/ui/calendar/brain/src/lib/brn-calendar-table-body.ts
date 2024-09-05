import { NgComponentOutlet, NgTemplateOutlet } from '@angular/common';
import { Component, type TemplateRef, computed, inject, input } from '@angular/core';
import { BrnCalendarService } from './brn-calendar.service';

@Component({
	selector: 'brn-calendar-table-body',
	standalone: true,
	imports: [NgComponentOutlet, NgTemplateOutlet],
	styles: [
		`:host: {
        display: contents;
        }`,
	],
	template: `<tbody role="rowgroup">
            @for(week of this.currentMonthYearDays();  track $index){
                <tr class="flex w-full mt-2">
                    @for(day of week;  let idx = $index; track $index + idx ){
                        @if(dayCellTemplate()){
                            <ng-container *ngTemplateOutlet="dayCellTemplate(); context: { $implicit: day,isToday: _brnCalendarService.isToday(day) }"></ng-container>
                        } @else {
                            <td><button>{{day?.getDate()}} </button></td>
                        }
                    }
                </tr>
            }
        </tbody>`,
})
export class BrnCalendarTableBodyComponent {
	private _brnCalendarService = inject(BrnCalendarService);

	protected currentMonthYearDays = computed(() => this._brnCalendarService.currentMonthYearDays());
	protected daysOfTheWeek = computed(() => this._brnCalendarService.daysOfTheWeek());

	dayCellTemplate = input<TemplateRef<HTMLElement>>();
}
