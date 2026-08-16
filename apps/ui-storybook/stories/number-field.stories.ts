import { BrnNumberField } from '@spartan-ng/brain/number-field';
import { HlmLabel } from '@spartan-ng/helm/label';
import { HlmNumberFieldImports } from '@spartan-ng/helm/number-field';
import { type Meta, type StoryObj, argsToTemplate, moduleMetadata } from '@storybook/angular';

const meta: Meta<BrnNumberField> = {
	title: 'Number Field',
	component: BrnNumberField,
	tags: ['autodocs'],
	args: {
		value: 5,
		min: 0,
		max: 99,
		step: 1,
	},
	decorators: [
		moduleMetadata({
			imports: [HlmNumberFieldImports, HlmLabel],
		}),
	],
};

export default meta;
type Story = StoryObj<BrnNumberField>;

export const Default: Story = {
	render: ({ ...args }) => ({
		props: { ...args },
		template: `
    <label hlmLabel id='quantity'>Quantity</label>
    <hlm-number-field class='mt-2' aria-labelledby='quantity' ${argsToTemplate(args)} />
    `,
	}),
};

export const NonTypeable: Story = {
	render: ({ ...args }) => ({
		props: { ...args },
		template: `
    <label hlmLabel id='non-typeable'>Non-typeable</label>
    <hlm-number-field class='mt-2' [typeable]='false' aria-labelledby='non-typeable' ${argsToTemplate(args)} />
    `,
	}),
};

export const LargeStep: Story = {
	args: {
		value: 50,
		min: 0,
		max: 100,
		step: 10,
	},
	render: ({ ...args }) => ({
		props: { ...args },
		template: `
    <label hlmLabel id='large-step'>Step of 10</label>
    <hlm-number-field class='mt-2' aria-labelledby='large-step' ${argsToTemplate(args)} />
    `,
	}),
};

export const Disabled: Story = {
	args: {
		disabled: true,
	},
	render: ({ ...args }) => ({
		props: { ...args },
		template: `
    <label hlmLabel id='disabled'>Disabled</label>
    <hlm-number-field class='mt-2' aria-labelledby='disabled' ${argsToTemplate(args)} />
    `,
	}),
};

export const Empty: Story = {
	args: {
		value: null,
	},
	render: ({ ...args }) => ({
		props: { ...args },
		template: `
    <label hlmLabel id='empty'>Empty (type a value)</label>
    <hlm-number-field class='mt-2' placeholder='—' aria-labelledby='empty' ${argsToTemplate(args)} />
    `,
	}),
};
