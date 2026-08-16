import { type ExistingProvider, inject, InjectionToken, type Type } from '@angular/core';
import type { BrnNumberField } from './brn-number-field';

const BrnNumberFieldToken = new InjectionToken<BrnNumberField>('BrnNumberFieldToken');

export function provideBrnNumberField(numberField: Type<BrnNumberField>): ExistingProvider {
	return { provide: BrnNumberFieldToken, useExisting: numberField };
}

export function injectBrnNumberField(): BrnNumberField {
	return inject(BrnNumberFieldToken);
}
