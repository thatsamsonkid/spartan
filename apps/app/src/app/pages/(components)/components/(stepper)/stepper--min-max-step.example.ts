import { Component, signal } from '@angular/core';
import { HlmStepperImports } from '@spartan-ng/helm/stepper';

@Component({
	selector: 'spartan-stepper-min-max-step',
	imports: [HlmStepperImports],
	template: `
		<hlm-stepper [(value)]="value" [min]="0" [max]="100" [step]="10" aria-label="Percentage" />
	`,
})
export class StepperMinMaxStep {
	public readonly value = signal<number | null>(50);
}
