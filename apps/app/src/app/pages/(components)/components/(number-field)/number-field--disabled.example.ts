import { Component } from '@angular/core';
import { HlmNumberFieldImports } from '@spartan-ng/helm/number-field';

@Component({
	selector: 'spartan-number-field-disabled',
	imports: [HlmNumberFieldImports],
	template: `
		<hlm-number-field [value]="3" disabled aria-label="Quantity" />
	`,
})
export class NumberFieldDisabled {}
