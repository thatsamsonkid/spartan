import { computed, DestroyRef, Directive, ElementRef, inject, signal } from '@angular/core';
import { injectBrnStepper } from './brn-stepper.token';

@Directive({
	selector: 'input[brnStepperInput]',
	exportAs: 'brnStepperInput',
	host: {
		role: 'spinbutton',
		type: 'text',
		inputmode: 'numeric',
		autocomplete: 'off',
		autocorrect: 'off',
		spellcheck: 'false',
		'data-slot': 'stepper-input',
		'[attr.aria-label]': '_stepper.ariaLabel()',
		'[attr.aria-labelledby]': '_stepper.ariaLabelledby()',
		'[attr.aria-valuemin]': '_stepper.min()',
		'[attr.aria-valuemax]': '_stepper.max()',
		'[attr.aria-valuenow]': '_stepper.value()',
		'[attr.aria-valuetext]': '_stepper.valueLabel()',
		'[disabled]': '_stepper.mutableDisabled()',
		'[attr.data-disabled]': '_stepper.mutableDisabled() ? "" : null',
		'[value]': '_displayValue()',
		'(input)': '_onInput($event)',
		'(blur)': '_onBlur()',
		'(keydown)': '_onKeydown($event)',
	},
})
export class BrnStepperInput {
	protected readonly _stepper = injectBrnStepper();
	private readonly _destroyRef = inject(DestroyRef);
	public readonly elementRef = inject<ElementRef<HTMLInputElement>>(ElementRef);

	/** Raw text while the user is editing; `null` when displaying the committed value. */
	private readonly _editingValue = signal<string | null>(null);

	protected readonly _displayValue = computed(() => {
		const editingValue = this._editingValue();
		if (editingValue !== null) return editingValue;

		const value = this._stepper.value();
		return value === null ? '' : String(value);
	});

	constructor() {
		this._stepper.registerInput(this);

		this._destroyRef.onDestroy(() => {
			this._stepper.unregisterInput(this);
		});
	}

	protected _onInput(event: Event): void {
		this._editingValue.set((event.target as HTMLInputElement).value);
	}

	protected _onBlur(): void {
		this._commitEditingValue();
	}

	protected _onKeydown(event: KeyboardEvent): void {
		if (event.key === 'Enter') {
			this._commitEditingValue();
			return;
		}

		this._stepper.handleKeydown(event);
	}

	/** Parses the typed text and commits it, reverting to the previous value when it is not a number. */
	private _commitEditingValue(): void {
		const editingValue = this._editingValue();
		if (editingValue === null) return;

		const trimmed = editingValue.trim();

		if (trimmed === '') {
			this._stepper.setValue(null);
		} else {
			const parsed = Number(trimmed);
			if (Number.isFinite(parsed)) {
				this._stepper.setValue(parsed);
			}
		}

		// Clear the editing state so the display reflects the committed (normalized) value.
		this._editingValue.set(null);

		// The display computed may not change when the commit was rejected or normalized back
		// to the previous value, so sync the native input explicitly.
		this.elementRef.nativeElement.value = this._displayValue();
	}
}
