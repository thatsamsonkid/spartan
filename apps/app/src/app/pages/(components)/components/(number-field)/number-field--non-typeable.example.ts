import { Component, signal } from '@angular/core';
import { HlmNumberFieldImports } from '@spartan-ng/helm/number-field';

@Component({
	selector: 'spartan-number-field-non-typeable',
	imports: [HlmNumberFieldImports],
	template: `
		<hlm-number-field [(value)]="value" [min]="0" [max]="10" [typeable]="false" aria-label="Quantity" />
	`,
})
export class NumberFieldNonTypeable {
	public readonly value = signal<number | null>(3);
}
