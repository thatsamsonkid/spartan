import { NgTemplateOutlet } from '@angular/common';
import { Component, type TemplateRef, computed, effect, inject, input } from '@angular/core';
import { BrnCalendarService } from './brn-calendar.service';

@Component({
	selector: 'brn-calendar-year-display',
	standalone: true,
	imports: [NgTemplateOutlet],
	template: `<tbody role="rowgroup">
            @for(yearRow of years(); track $index){
                <tr class="flex w-full mt-2">
                    @for(year of yearRow; let idx = $index; track $index + idx){
                        @if(yearTemplate()){
                            <ng-container *ngTemplateOutlet="yearTemplate(); context: { $implicit: year }"/>
                        } @else {
                            <td><button>{{year?.getFullYear()}} </button></td>
                        }
                    }
                </tr>
            }
        </tbody>
    `,
})
export class BrnCalendarYearDisplayComponent {
	private brnCalendarService = inject(BrnCalendarService);

	protected years = computed(() => this.brnCalendarService.years());

	yearTemplate = input<TemplateRef<HTMLElement>>();

	constructor() {
		this.brnCalendarService.generateYears();

		effect(() => {
			console.log(this.yearTemplate());
		});
	}
}
