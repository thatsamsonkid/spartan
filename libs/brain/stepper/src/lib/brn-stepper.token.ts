import { type ExistingProvider, inject, InjectionToken, type Type } from '@angular/core';
import type { BrnStepper } from './brn-stepper';

const BrnStepperToken = new InjectionToken<BrnStepper>('BrnStepperToken');

export function provideBrnStepper(stepper: Type<BrnStepper>): ExistingProvider {
	return { provide: BrnStepperToken, useExisting: stepper };
}

export function injectBrnStepper(): BrnStepper {
	return inject(BrnStepperToken);
}
