import { DestroyRef, Directive, inject } from '@angular/core';
import { injectBrnStepper } from './brn-stepper.token';

/**
 * Shared behavior for the increment and decrement buttons:
 * steps once on pointer down and optionally repeats while held.
 */
@Directive({
	host: {
		type: 'button',
		tabindex: '-1',
		'[disabled]': '!_canStep()',
		'[attr.data-disabled]': '!_canStep() ? "" : null',
		'(pointerdown)': '_onPointerDown($event)',
		'(pointerup)': '_stopRepeat()',
		'(pointerleave)': '_stopRepeat()',
		'(pointercancel)': '_stopRepeat()',
	},
})
export abstract class BrnStepperButton {
	protected readonly _stepper = injectBrnStepper();
	private readonly _destroyRef = inject(DestroyRef);

	private _delayTimeout: ReturnType<typeof setTimeout> | null = null;
	private _repeatInterval: ReturnType<typeof setInterval> | null = null;

	protected abstract _canStep(): boolean;
	protected abstract _step(): void;

	constructor() {
		this._destroyRef.onDestroy(() => this._stopRepeat());
	}

	protected _onPointerDown(event: PointerEvent): void {
		if (event.button !== 0 || !this._canStep()) return;

		// Keep focus on the spinbutton element instead of the button.
		event.preventDefault();
		this._stepper.focus();

		this._step();

		if (!this._stepper.holdRepeat()) return;

		this._delayTimeout = setTimeout(() => {
			this._repeatInterval = setInterval(() => {
				if (!this._canStep()) {
					this._stopRepeat();
					return;
				}
				this._step();
			}, this._stepper.holdRepeatInterval());
		}, this._stepper.holdRepeatDelay());
	}

	protected _stopRepeat(): void {
		if (this._delayTimeout !== null) {
			clearTimeout(this._delayTimeout);
			this._delayTimeout = null;
		}
		if (this._repeatInterval !== null) {
			clearInterval(this._repeatInterval);
			this._repeatInterval = null;
		}
	}
}
