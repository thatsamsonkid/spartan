import { Component, signal } from '@angular/core';
import { HlmNumberFieldImports } from '@spartan-ng/helm/number-field';

@Component({
	selector: 'spartan-number-field-min-max-step',
	imports: [HlmNumberFieldImports],
	template: `
		<hlm-number-field [(value)]="value" [min]="0" [max]="100" [step]="10" aria-label="Percentage" />
	`,
})
export class NumberFieldMinMaxStep {
	public readonly value = signal<number | null>(50);
}
