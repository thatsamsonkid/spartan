import type { RouteMeta } from '@analogjs/router';
import { Component, computed, inject } from '@angular/core';
import { injectComponentDocs } from '@spartan-ng/app/app/core/services/component-docs';
import { PrimitiveSnippetsService } from '@spartan-ng/app/app/core/services/primitive-snippets.service';
import { InstallTabs } from '@spartan-ng/app/app/shared/layout/install-tabs';
import { UIApiDocs } from '@spartan-ng/app/app/shared/layout/ui-docs-section/ui-docs-section';
import { hlmCode } from '@spartan-ng/helm/typography';
import { Code } from '../../../../shared/code/code';
import { CodePreview } from '../../../../shared/code/code-preview';
import { MainSection } from '../../../../shared/layout/main-section';
import { PageBottomNav } from '../../../../shared/layout/page-bottom-nav/page-bottom-nav';
import { PageBottomNavLink } from '../../../../shared/layout/page-bottom-nav/page-bottom-nav-link';
import { PageNav } from '../../../../shared/layout/page-nav/page-nav';
import { SectionIntro } from '../../../../shared/layout/section-intro';
import { SectionSubHeading } from '../../../../shared/layout/section-sub-heading';
import { SectionSubSubHeading } from '../../../../shared/layout/section-sub-sub-heading';
import { Tabs } from '../../../../shared/layout/tabs';
import { metaWith } from '../../../../shared/meta/meta.util';
import { NumberFieldDisabled } from './number-field--disabled.example';
import { NumberFieldForm } from './number-field--form.example';
import { NumberFieldMinMaxStep } from './number-field--min-max-step.example';
import { NumberFieldNonTypeable } from './number-field--non-typeable.example';
import { NumberFieldPreview, defaultImports, defaultSkeleton } from './number-field.preview';

export const routeMeta: RouteMeta = {
	data: { breadcrumb: 'Number Field', api: 'number-field' },
	meta: metaWith('spartan/ui - Number Field', 'A number input with increment and decrement buttons.'),
	title: 'spartan/ui - Number Field',
};

@Component({
	selector: 'spartan-number-field',
	imports: [
		MainSection,
		InstallTabs,
		Code,
		SectionIntro,
		SectionSubHeading,
		SectionSubSubHeading,
		Tabs,
		CodePreview,
		PageNav,
		PageBottomNav,
		PageBottomNavLink,
		NumberFieldPreview,
		NumberFieldMinMaxStep,
		NumberFieldNonTypeable,
		NumberFieldDisabled,
		NumberFieldForm,
		UIApiDocs,
	],
	template: `
		<section spartanMainSection>
			<spartan-section-intro
				name="Number Field"
				lead="A number input with increment and decrement buttons."
				showThemeToggle
			/>

			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-number-field-preview />
				</div>
				<spartan-code secondTab [code]="_defaultCode()" />
			</spartan-tabs>

			<spartan-install-tabs primitive="number-field" />

			<spartan-section-sub-heading id="usage">Usage</spartan-section-sub-heading>
			<div class="mt-6 space-y-4">
				<spartan-code [code]="_defaultImports" />
				<spartan-code [code]="_defaultNumberField" />
			</div>

			<spartan-section-sub-heading id="examples">Examples</spartan-section-sub-heading>

			<h3 id="examples__min-max-step" spartanH4>Min, Max and Step</h3>
			<p class="py-2">
				Use
				<code class="${hlmCode}">min</code>
				,
				<code class="${hlmCode}">max</code>
				and
				<code class="${hlmCode}">step</code>
				to constrain the value. Values are clamped to the bounds and the increment and decrement buttons disable
				automatically when a bound is reached. Holding a button repeats the step (configurable via
				<code class="${hlmCode}">holdRepeat</code>
				).
			</p>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-number-field-min-max-step />
				</div>
				<spartan-code secondTab [code]="_minMaxStepCode()" />
			</spartan-tabs>

			<h3 id="examples__non-typeable" spartanH4>Non-typeable</h3>
			<p class="py-2">
				Set
				<code class="${hlmCode}">typeable</code>
				to
				<code class="${hlmCode}">false</code>
				to only allow changing the value with the buttons or the keyboard.
			</p>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-number-field-non-typeable />
				</div>
				<spartan-code secondTab [code]="_nonTypeableCode()" />
			</spartan-tabs>

			<h3 id="examples__disabled" spartanH4>Disabled</h3>
			<p class="py-2">
				Use the
				<code class="${hlmCode}">disabled</code>
				input to disable the number-field.
			</p>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-number-field-disabled />
				</div>
				<spartan-code secondTab [code]="_disabledCode()" />
			</spartan-tabs>

			<h3 id="examples__form" spartanH4>Form</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-number-field-form />
				</div>
				<spartan-code secondTab [code]="_formCode()" />
			</spartan-tabs>

			<spartan-section-sub-heading id="brn-api">Brain API</spartan-section-sub-heading>
			<spartan-ui-api-docs docType="brain" />

			<spartan-section-sub-heading id="hlm-api">Helm API</spartan-section-sub-heading>
			<spartan-ui-api-docs docType="helm" />

			<spartan-page-bottom-nav>
				<spartan-page-bottom-nav-link href="pagination" label="Pagination" />
				<spartan-page-bottom-nav-link direction="previous" href="navigation-menu" label="Navigation Menu" />
			</spartan-page-bottom-nav>
		</section>
		<spartan-page-nav />
	`,
})
export default class NumberFieldPage {
	constructor() {
		injectComponentDocs();
	}

	private readonly _snippets = inject(PrimitiveSnippetsService).getSnippets('number-field');
	protected readonly _defaultCode = computed(() => this._snippets()['default']);
	protected readonly _minMaxStepCode = computed(() => this._snippets()['minMaxStep']);
	protected readonly _nonTypeableCode = computed(() => this._snippets()['nonTypeable']);
	protected readonly _disabledCode = computed(() => this._snippets()['disabled']);
	protected readonly _formCode = computed(() => this._snippets()['form']);

	protected readonly _defaultNumberField = defaultSkeleton;
	protected readonly _defaultImports = defaultImports;
}
