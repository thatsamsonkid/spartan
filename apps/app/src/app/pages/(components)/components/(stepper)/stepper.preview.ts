import { Component, signal } from '@angular/core';
import { HlmStepperImports } from '@spartan-ng/helm/stepper';

@Component({
	selector: 'spartan-stepper-preview',
	imports: [HlmStepperImports],
	template: `
		<hlm-stepper [(value)]="value" [min]="0" [max]="99" aria-label="Quantity" />
	`,
})
export class StepperPreview {
	public readonly value = signal<number | null>(5);
}

export const defaultImports = `
import { HlmStepperImports } from '@spartan-ng/helm/stepper';
`;
export const defaultSkeleton = `
<hlm-stepper aria-label="Quantity" />
`;
