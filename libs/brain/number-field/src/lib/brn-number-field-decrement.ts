import { Directive } from '@angular/core';
import { BrnNumberFieldButton } from './brn-number-field-button';

@Directive({
	selector: 'button[brnNumberFieldDecrement]',
	exportAs: 'brnNumberFieldDecrement',
	host: {
		'data-slot': 'number-field-decrement',
	},
})
export class BrnNumberFieldDecrement extends BrnNumberFieldButton {
	protected _canStep(): boolean {
		return this._numberField.canDecrement();
	}

	protected _step(): void {
		this._numberField.decrement();
	}
}
