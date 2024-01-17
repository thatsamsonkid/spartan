import { Component } from '@angular/core';
import { BrnAccordionContentComponent } from '@spartan-ng/ui-accordion-brain';
import {
	HlmAccordionContentDirective,
	HlmAccordionDirective,
	HlmAccordionIconDirective,
	HlmAccordionItemDirective,
	HlmAccordionTriggerComponent,
} from '@spartan-ng/ui-accordion-helm';
import { HlmIconComponent } from '@spartan-ng/ui-icon-helm';

@Component({
	selector: 'spartan-accordion-preview',
	standalone: true,
	imports: [
		BrnAccordionContentComponent,
		HlmAccordionDirective,
		HlmAccordionItemDirective,
		HlmAccordionTriggerComponent,
		HlmAccordionContentDirective,
		HlmAccordionIconDirective,
		HlmIconComponent,
	],
	template: `
		<div hlmAccordion>
			<div hlmAccordionItem>
				<hlm-accordion-trigger>
					Is it accessible?
					<hlm-icon hlmAccIcon />
				</hlm-accordion-trigger>
				<brn-accordion-content hlm>Yes. It adheres to the WAI-ARIA design pattern.</brn-accordion-content>
			</div>

			<div hlmAccordionItem>
				<hlm-accordion-trigger>
					Is it styled?
					<hlm-icon hlmAccIcon />
				</hlm-accordion-trigger>
				<brn-accordion-content hlm>
					Yes. It comes with default styles that match the other components' aesthetics.
				</brn-accordion-content>
			</div>

			<div hlmAccordionItem>
				<hlm-accordion-trigger>
					Is it animated?
					<hlm-icon hlmAccIcon />
				</hlm-accordion-trigger>
				<brn-accordion-content hlm>
					Yes. It's animated by default, but you can disable it if you prefer.
				</brn-accordion-content>
			</div>
		</div>
	`,
})
export class AccordionPreviewComponent {}

export const codeImports = `
import { BrnAccordionContentComponent } from '@spartan-ng/ui-accordion-brain';
import {
  HlmAccordionContentDirective,
  HlmAccordionDirective,
  HlmAccordionIconDirective,
  HlmAccordionItemDirective,
  HlmAccordionTriggerComponent,
} from '@spartan-ng/ui-accordion-helm';
import { HlmIconComponent } from '@spartan-ng/ui-icon-helm';
`;

export const codeString =
	"import { Component } from '@angular/core';" +
	codeImports +
	`
	@Component({
	selector: 'spartan-accordion-preview',
	standalone: true,
	imports: [
		BrnAccordionContentComponent,
		HlmAccordionDirective,
		HlmAccordionItemDirective,
		HlmAccordionTriggerComponent,
		HlmAccordionContentDirective,
		HlmAccordionIconDirective,
		HlmIconComponent,
	],
	template: \`
		<div hlmAccordion>
			<div hlmAccordionItem>
				<hlm-accordion-trigger>
					Is it accessible?
					<hlm-icon hlmAccIcon />
				</hlm-accordion-trigger>
				<brn-accordion-content hlm>Yes. It adheres to the WAI-ARIA design pattern.</brn-accordion-content>
			</div>

			<div hlmAccordionItem>
				<hlm-accordion-trigger>
					Is it styled?
					<hlm-icon hlmAccIcon />
				</hlm-accordion-trigger>
				<brn-accordion-content hlm>
					Yes. It comes with default styles that match the other components' aesthetics.
				</brn-accordion-content>
			</div>

			<div hlmAccordionItem>
				<hlm-accordion-trigger>
					Is it animated?
					<hlm-icon hlmAccIcon />
				</hlm-accordion-trigger>
				<brn-accordion-content hlm>
					Yes. It's animated by default, but you can disable it if you prefer.
				</brn-accordion-content>
			</div>
		</div>
	\`,
})
export class AccordionPreviewComponent {}`;

export const codeSkeleton = `
<div hlmAccordion>
	<div hlmAccordionItem>
		<hlm-accordion-trigger>
			Is it accessible?
			<hlm-icon hlmAccIcon />
		</hlm-accordion-trigger>
		<brn-accordion-content hlm>Yes. It adheres to the WAI-ARIA design pattern.</brn-accordion-content>
	</div>
</div>
`;
