import type { BooleanInput } from '@angular/cdk/coercion';
import { booleanAttribute, ChangeDetectionStrategy, Component, input } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideMinus, lucidePlus } from '@ng-icons/lucide';
import { BrnNumberField, BrnNumberFieldImports, injectBrnNumberField } from '@spartan-ng/brain/number-field';
import { HlmButton } from '@spartan-ng/helm/button';
import { classes } from '@spartan-ng/helm/utils';

@Component({
	selector: 'hlm-number-field',
	imports: [BrnNumberFieldImports, HlmButton, NgIcon],
	providers: [provideIcons({ lucideMinus, lucidePlus })],
	changeDetection: ChangeDetectionStrategy.OnPush,
	hostDirectives: [
		{
			directive: BrnNumberField,
			inputs: [
				'id',
				'value',
				'min',
				'max',
				'step',
				'disabled',
				'holdRepeat',
				'holdRepeatDelay',
				'holdRepeatInterval',
				'getValueLabel',
				'aria-label',
				'aria-labelledby',
			],
			outputs: ['valueChange'],
		},
	],
	template: `
		<button
			hlmBtn
			brnNumberFieldDecrement
			variant="ghost"
			size="icon-sm"
			class="spartan-number-field-decrement h-full rounded-none"
			[disabled]="!_numberField.canDecrement()"
			[attr.aria-label]="decrementAriaLabel()"
		>
			<ng-icon name="lucideMinus" />
		</button>

		@if (typeable()) {
			<input
				brnNumberFieldInput
				class="spartan-number-field-input w-12 min-w-0 border-0 bg-transparent text-center text-sm tabular-nums outline-none focus-visible:ring-0 disabled:pointer-events-none"
				[attr.placeholder]="placeholder()"
			/>
		} @else {
			<span
				data-slot="number-field-value"
				class="spartan-number-field-value flex w-12 items-center justify-center text-center text-sm tabular-nums select-none"
			>
				{{ _numberField.value() }}
			</span>
		}

		<button
			hlmBtn
			brnNumberFieldIncrement
			variant="ghost"
			size="icon-sm"
			class="spartan-number-field-increment h-full rounded-none"
			[disabled]="!_numberField.canIncrement()"
			[attr.aria-label]="incrementAriaLabel()"
		>
			<ng-icon name="lucidePlus" />
		</button>
	`,
})
export class HlmNumberField {
	protected readonly _numberField = injectBrnNumberField();

	/** Whether the value can be edited by typing. When false, the value is rendered as plain text. */
	public readonly typeable = input<boolean, BooleanInput>(true, { transform: booleanAttribute });

	/** Placeholder shown by the input when the value is empty. */
	public readonly placeholder = input<string>('');

	/** Accessibility label of the decrement button. */
	public readonly decrementAriaLabel = input<string>('Decrement');

	/** Accessibility label of the increment button. */
	public readonly incrementAriaLabel = input<string>('Increment');

	constructor() {
		classes(() => 'spartan-number-field inline-flex w-fit items-stretch overflow-hidden outline-none');
	}
}
