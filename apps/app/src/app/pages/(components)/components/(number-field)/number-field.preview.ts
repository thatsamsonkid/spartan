import { Component, signal } from '@angular/core';
import { HlmNumberFieldImports } from '@spartan-ng/helm/number-field';

@Component({
	selector: 'spartan-number-field-preview',
	imports: [HlmNumberFieldImports],
	template: `
		<hlm-number-field [(value)]="value" [min]="0" [max]="99" aria-label="Quantity" />
	`,
})
export class NumberFieldPreview {
	public readonly value = signal<number | null>(5);
}

export const defaultImports = `
import { HlmNumberFieldImports } from '@spartan-ng/helm/number-field';
`;
export const defaultSkeleton = `
<hlm-number-field aria-label="Quantity" />
`;
