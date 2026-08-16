import { Component } from '@angular/core';
import { HlmStepperImports } from '@spartan-ng/helm/stepper';

@Component({
	selector: 'spartan-stepper-disabled',
	imports: [HlmStepperImports],
	template: `
		<hlm-stepper [value]="3" disabled aria-label="Quantity" />
	`,
})
export class StepperDisabled {}
