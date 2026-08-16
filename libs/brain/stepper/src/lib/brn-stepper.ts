import type { BooleanInput, NumberInput } from '@angular/cdk/coercion';
import {
	booleanAttribute,
	computed,
	Directive,
	ElementRef,
	forwardRef,
	inject,
	Injector,
	input,
	linkedSignal,
	numberAttribute,
	type OnInit,
	output,
	signal,
} from '@angular/core';
import { type ControlValueAccessor, NG_VALUE_ACCESSOR, NgControl, NgModel } from '@angular/forms';
import { BrnFieldControl } from '@spartan-ng/brain/field';
import type { ChangeFn, TouchFn } from '@spartan-ng/brain/forms';
import type { BrnStepperInput } from './brn-stepper-input';
import { provideBrnStepper } from './brn-stepper.token';

export const BRN_STEPPER_VALUE_ACCESSOR = {
	provide: NG_VALUE_ACCESSOR,
	useExisting: forwardRef(() => BrnStepper),
	multi: true,
};

export type BrnStepperLabelFn = (value: number) => string;

let nextId = 0;

/** Transforms an input value to a number or null (empty values stay null). */
function nullableNumberAttribute(value: unknown): number | null {
	return value == null || value === '' ? null : numberAttribute(value);
}

@Directive({
	selector: '[brnStepper]',
	exportAs: 'brnStepper',
	providers: [BRN_STEPPER_VALUE_ACCESSOR, provideBrnStepper(BrnStepper)],
	hostDirectives: [BrnFieldControl],
	host: {
		'[attr.id]': 'id()',
		'data-slot': 'stepper',
		'[attr.role]': 'stepperInput() ? "group" : "spinbutton"',
		'[attr.tabindex]': 'stepperInput() || mutableDisabled() ? null : 0',
		'[attr.aria-label]': 'stepperInput() ? null : ariaLabel()',
		'[attr.aria-labelledby]': 'stepperInput() ? null : ariaLabelledby()',
		'[attr.aria-valuemin]': 'stepperInput() ? null : min()',
		'[attr.aria-valuemax]': 'stepperInput() ? null : max()',
		'[attr.aria-valuenow]': 'stepperInput() ? null : value()',
		'[attr.aria-valuetext]': 'stepperInput() ? null : valueLabel()',
		'[attr.aria-disabled]': 'mutableDisabled() ? "true" : null',
		'[attr.data-disabled]': 'mutableDisabled() ? "" : null',
		'[attr.aria-invalid]': '_ariaInvalid() ? "true" : null',
		'[attr.data-invalid]': '_ariaInvalid() ? "true" : null',
		'[attr.data-matches-spartan-invalid]': '_ariaInvalid() ? "true" : null',
		'[attr.data-dirty]': '_dirty() ? "true" : null',
		'[attr.data-touched]': '_touched() ? "true" : null',
		'(keydown)': '_onKeydown($event)',
		'(focusout)': '_onFocusOut($event)',
	},
})
export class BrnStepper implements ControlValueAccessor, OnInit {
	private readonly _injector = inject(Injector);
	private readonly _fieldControl = inject(BrnFieldControl);
	public readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
	public ngControl: NgControl | null = null;

	protected readonly _ariaInvalid = this._fieldControl.invalid;
	protected readonly _dirty = this._fieldControl.dirty;
	protected readonly _touched = this._fieldControl.touched;

	/** Unique identifier for the stepper element. Auto-generated if not provided. */
	public readonly id = input<string>(`brn-stepper-${++nextId}`);

	/** Accessibility label for the stepper. Forwarded to the input when one is present. */
	public readonly ariaLabel = input<string | null>(null, { alias: 'aria-label' });

	/** ID of the element that labels this stepper for accessibility. Forwarded to the input when one is present. */
	public readonly ariaLabelledby = input<string | null>(null, { alias: 'aria-labelledby' });

	/** The current stepper value. `null` represents an empty state. */
	public readonly valueInput = input<number | null, NumberInput>(null, {
		alias: 'value',
		transform: nullableNumberAttribute,
	});
	public readonly value = linkedSignal(this.valueInput);

	/** Minimum allowed value. Unbounded when `null`. */
	public readonly min = input<number | null, NumberInput>(null, { transform: nullableNumberAttribute });

	/** Maximum allowed value. Unbounded when `null`. */
	public readonly max = input<number | null, NumberInput>(null, { transform: nullableNumberAttribute });

	/** Step increment used when changing the value. */
	public readonly step = input<number, NumberInput>(1, { transform: numberAttribute });

	/** Whether the stepper is disabled. */
	public readonly disabled = input<boolean, BooleanInput>(false, { transform: booleanAttribute });

	/** Whether holding down an increment/decrement button repeats the step. */
	public readonly holdRepeat = input<boolean, BooleanInput>(true, { transform: booleanAttribute });

	/** Delay in milliseconds before hold-to-repeat kicks in. */
	public readonly holdRepeatDelay = input<number, NumberInput>(500, { transform: numberAttribute });

	/** Interval in milliseconds between repeated steps while holding. */
	public readonly holdRepeatInterval = input<number, NumberInput>(50, { transform: numberAttribute });

	/** Defines a human readable value for `aria-valuetext`, e.g. `(value) => value + ' items'`. */
	public readonly getValueLabel = input<BrnStepperLabelFn | null>(null);

	/** Emits when the value changes. */
	public readonly valueChange = output<number | null>();

	/** @internal Human readable label of the current value. */
	public readonly valueLabel = computed(() => {
		const getValueLabel = this.getValueLabel();
		const value = this.value();
		return getValueLabel && value !== null ? getValueLabel(value) : null;
	});

	/** @internal Disabled state that can be controlled internally or externally. */
	public readonly mutableDisabled = linkedSignal(() => this.disabled());

	/** @internal Reference to the registered stepper input, if any. */
	public readonly stepperInput = signal<BrnStepperInput | null>(null);

	/** @internal Whether the value can currently be incremented. */
	public readonly canIncrement = computed(() => {
		if (this.mutableDisabled()) return false;
		const max = this.max();
		const value = this.value();
		return max === null || value === null || value < max;
	});

	/** @internal Whether the value can currently be decremented. */
	public readonly canDecrement = computed(() => {
		if (this.mutableDisabled()) return false;
		const min = this.min();
		const value = this.value();
		return min === null || value === null || value > min;
	});

	/** @internal Store the on change callback */
	private _onChange?: ChangeFn<number | null>;

	/** @internal Store the on touched callback */
	private _onTouched?: TouchFn;

	ngOnInit(): void {
		this.ngControl = this._injector.get(NgControl, null);

		// If bound to an Angular form control, writeValue() will run after ngOnInit,
		// so avoid normalizing here to prevent a transient override.
		if (!this.ngControl) {
			const value = this.value();
			if (value !== null) {
				const normalized = this._normalize(value);
				if (normalized !== value) {
					this.value.set(normalized);
				}
			}
		}
	}

	registerOnChange(fn: ChangeFn<number | null>): void {
		this._onChange = fn;
	}

	registerOnTouched(fn: TouchFn): void {
		this._onTouched = fn;
	}

	setDisabledState(isDisabled: boolean): void {
		this.mutableDisabled.set(isDisabled);
	}

	writeValue(value: number | null): void {
		if (this.ngControl instanceof NgModel && !this._onChange) {
			// Avoid phantom call for ngModel
			// https://github.com/angular/angular/issues/14988#issuecomment-2946355465
			return;
		}

		this.value.set(typeof value === 'number' ? this._normalize(value) : null);
	}

	/** Sets a new value, rounding to the nearest integer and clamping to `[min, max]`. */
	setValue(value: number | null): void {
		this._commit(value === null ? null : this._normalize(value));
	}

	/** Increments the value by the given multiple of `step`. */
	increment(multiplier = 1): void {
		this._stepBy(this.step() * multiplier);
	}

	/** Decrements the value by the given multiple of `step`. */
	decrement(multiplier = 1): void {
		this._stepBy(-this.step() * multiplier);
	}

	/** Sets the value to the minimum, when one is defined. */
	goToMin(): void {
		const min = this.min();
		if (min !== null) this._commit(this._normalize(min));
	}

	/** Sets the value to the maximum, when one is defined. */
	goToMax(): void {
		const max = this.max();
		if (max !== null) this._commit(this._normalize(max));
	}

	/** @internal Marks the stepper as touched. */
	markAsTouched(): void {
		this._onTouched?.();
	}

	/** @internal Shared keyboard handling for the spinbutton element (root or input). */
	handleKeydown(event: KeyboardEvent): void {
		if (this.mutableDisabled()) return;

		switch (event.key) {
			case 'ArrowUp':
				this.increment(event.shiftKey ? 10 : 1);
				break;
			case 'ArrowDown':
				this.decrement(event.shiftKey ? 10 : 1);
				break;
			case 'PageUp':
				this.increment(10);
				break;
			case 'PageDown':
				this.decrement(10);
				break;
			case 'Home':
				if (this.min() === null) return;
				this.goToMin();
				break;
			case 'End':
				if (this.max() === null) return;
				this.goToMax();
				break;
			default:
				return;
		}

		event.preventDefault();
	}

	/** @internal */
	registerInput(input: BrnStepperInput): void {
		this.stepperInput.set(input);
	}

	/** @internal */
	unregisterInput(input: BrnStepperInput): void {
		if (this.stepperInput() === input) {
			this.stepperInput.set(null);
		}
	}

	/** @internal Focuses the spinbutton element (the input when present, otherwise the root). */
	focus(): void {
		const target = this.stepperInput()?.elementRef.nativeElement ?? this.elementRef.nativeElement;
		target.focus();
	}

	private _stepBy(delta: number): void {
		if (this.mutableDisabled()) return;

		// From an empty state, start stepping from 0 clamped into bounds.
		const base = this.value() ?? 0;
		this._commit(this._normalize(base + delta));
	}

	private _commit(value: number | null): void {
		if (value === this.value()) return;

		this.value.set(value);
		this._onChange?.(value);
		this.valueChange.emit(value);
	}

	private _normalize(value: number): number {
		let normalized = Math.round(value);

		const min = this.min();
		const max = this.max();

		if (min !== null) normalized = Math.max(min, normalized);
		if (max !== null) normalized = Math.min(max, normalized);

		return normalized;
	}

	protected _onKeydown(event: KeyboardEvent): void {
		// When an input is registered it handles its own keyboard interaction.
		if (this.stepperInput()) return;
		this.handleKeydown(event);
	}

	protected _onFocusOut(event: FocusEvent): void {
		const currentTarget = event.currentTarget as HTMLElement;
		const focusedEl = event.relatedTarget as HTMLElement | null;

		if (!currentTarget.contains(focusedEl)) {
			this._onTouched?.();
		}
	}
}
