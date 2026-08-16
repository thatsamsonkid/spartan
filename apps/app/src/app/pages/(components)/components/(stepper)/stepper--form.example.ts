import { Component, signal } from '@angular/core';
import { form, FormField, FormRoot, min, required } from '@angular/forms/signals';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmStepperImports } from '@spartan-ng/helm/stepper';

@Component({
	selector: 'spartan-stepper-form',
	imports: [HlmStepperImports, FormRoot, FormField, HlmButtonImports, HlmFieldImports],
	host: { class: 'w-full max-w-xs' },
	template: `
		<form [formRoot]="form">
			<hlm-field-group>
				<hlm-field>
					<label hlmFieldLabel for="quantity">Quantity</label>
					<hlm-stepper id="quantity" [formField]="form.quantity" />
					<p hlmFieldDescription>How many items to order.</p>
				</hlm-field>
				<hlm-field orientation="horizontal">
					<button hlmBtn type="submit">Submit</button>
				</hlm-field>
			</hlm-field-group>
		</form>
	`,
})
export class StepperForm {
	protected readonly _model = signal<{ quantity: number | null }>({ quantity: 1 });

	public readonly form = form(
		this._model,
		(schemaPath) => {
			required(schemaPath.quantity, { message: 'Quantity is required' });
			min(schemaPath.quantity, 1, { message: 'Order at least one item' });
		},
		{
			submission: {
				action: async () => {
					const model = this._model();
					console.log(model);
				},
			},
		},
	);
}
