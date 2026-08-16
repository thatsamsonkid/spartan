import { Directive } from '@angular/core';
import { BrnStepperButton } from './brn-stepper-button';

@Directive({
	selector: 'button[brnStepperIncrement]',
	exportAs: 'brnStepperIncrement',
	host: {
		'data-slot': 'stepper-increment',
	},
})
export class BrnStepperIncrement extends BrnStepperButton {
	protected _canStep(): boolean {
		return this._stepper.canIncrement();
	}

	protected _step(): void {
		this._stepper.increment();
	}
}
