import { JsonPipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { BrnCalendarService } from './brn-calendar.service';

@Component({
	selector: 'brn-calendar-year-display',
	standalone: true,
	imports: [JsonPipe],
	template: `<table>
                <tbody>
    @for (yearRow of years(); track $index) {
        <tr>

        @for(year of yearRow; let idx = $index; track $index + idx){
            <td><button>
        {{year.getFullYear()}}
        </button></td>
        }

        </tr>
    }
            </tbody>
    </table>`,
})
export class BrnCalendarYearDisplayComponent {
	private brnCalendarService = inject(BrnCalendarService);

	protected years = computed(() => this.brnCalendarService.years());

	constructor() {
		this.brnCalendarService.generateYears();
	}
}
