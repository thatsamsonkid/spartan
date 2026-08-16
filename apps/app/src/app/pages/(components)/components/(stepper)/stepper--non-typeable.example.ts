import { Component, signal } from '@angular/core';
import { HlmStepperImports } from '@spartan-ng/helm/stepper';

@Component({
	selector: 'spartan-stepper-non-typeable',
	imports: [HlmStepperImports],
	template: `
		<hlm-stepper [(value)]="value" [min]="0" [max]="10" [typeable]="false" aria-label="Quantity" />
	`,
})
export class StepperNonTypeable {
	public readonly value = signal<number | null>(3);
}
