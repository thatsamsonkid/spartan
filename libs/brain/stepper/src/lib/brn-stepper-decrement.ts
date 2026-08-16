import { Directive } from '@angular/core';
import { BrnStepperButton } from './brn-stepper-button';

@Directive({
	selector: 'button[brnStepperDecrement]',
	exportAs: 'brnStepperDecrement',
	host: {
		'data-slot': 'stepper-decrement',
	},
})
export class BrnStepperDecrement extends BrnStepperButton {
	protected _canStep(): boolean {
		return this._stepper.canDecrement();
	}

	protected _step(): void {
		this._stepper.decrement();
	}
}
