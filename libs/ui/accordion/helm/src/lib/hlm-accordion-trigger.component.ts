import { FocusableOption } from '@angular/cdk/a11y';
import { ChangeDetectionStrategy, Component, ElementRef, Input, ViewChild, computed, signal } from '@angular/core';
import { BrnAccordionTriggerDirective } from '@spartan-ng/ui-accordion-brain';
import { hlm } from '@spartan-ng/ui-core';
import { ClassValue } from 'clsx';

@Component({
	selector: 'hlm-accordion-trigger:not(notHlm)',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		// setting the host class to empty as we don't want our class
		// input to affect the host element, but instead apply to
		// the button in the template
		'[attr.class]': "''",
		'[style]': '"display:contents"',
		role: 'heading',
		'aria-level': '3',
	},
	hostDirectives: [BrnAccordionTriggerDirective],
	imports: [BrnAccordionTriggerDirective],
	template: `
		<button [class]="_computedClass()">
			<ng-content />
		</button>
	`,
})
export class HlmAccordionTriggerComponent implements FocusableOption {
	@ViewChild('btn', { static: true }) button!: ElementRef<HTMLButtonElement>;
	private readonly _userCls = signal<ClassValue>('');
	protected _computedClass = computed(() =>
		hlm(
			'w-full focus-visible:outline-none text-sm focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-2 flex flex-1 items-center justify-between py-4 px-0.5 font-medium underline-offset-4 hover:underline [&[data-state=open]>[hlmAccordionIcon]]:rotate-180 [&[data-state=open]>[hlmAccIcon]]:rotate-180',
			this._userCls(),
		),
	);

	@Input()
	set class(inputs: ClassValue) {
		this._userCls.set(inputs);
	}

	public focus(): void {
		console.log('Focusing HLM');
		this.button.nativeElement.focus();
	}
}
