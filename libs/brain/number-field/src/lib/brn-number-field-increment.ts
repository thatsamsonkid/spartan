import { Directive } from '@angular/core';
import { BrnNumberFieldButton } from './brn-number-field-button';

@Directive({
	selector: 'button[brnNumberFieldIncrement]',
	exportAs: 'brnNumberFieldIncrement',
	host: {
		'data-slot': 'number-field-increment',
	},
})
export class BrnNumberFieldIncrement extends BrnNumberFieldButton {
	protected _canStep(): boolean {
		return this._numberField.canIncrement();
	}

	protected _step(): void {
		this._numberField.increment();
	}
}
