import type { Meta, StoryObj } from '@storybook/angular';
import { argsToTemplate, moduleMetadata } from '@storybook/angular';
import { BrnCalendarImports } from './brain/src';
import { provideSpartanDateLibrary } from './brain/src/lib/agnostic-date-ops/default-provider';
import { type HlmCalendarComponent, HlmCalendarImports } from './helm/src';
import { MaterialStyleCalendarComponent } from './mocks/material-style.calendar';
import { ReactDayCalendarComponent } from './mocks/react-daypicker-style.calendar';

const meta: Meta<HlmCalendarComponent> = {
	title: 'Calendar',
	args: {},
	argTypes: {},
	decorators: [
		moduleMetadata({
			imports: [HlmCalendarImports, BrnCalendarImports, MaterialStyleCalendarComponent, ReactDayCalendarComponent],
			providers: [provideSpartanDateLibrary()],
		}),
	],
};

export default meta;
type Story = StoryObj<HlmCalendarComponent>;

export const Default: Story = {
	render: (args) => ({
		props: { ...args },
		template: /* HTML */ `
			<hlm-calendar ${argsToTemplate(args)}/>
		`,
	}),
};

export const MaterialNavigation: Story = {
	render: (args) => ({
		props: { ...args },
		template: /* HTML */ `
			<hlm-material-calendar ${argsToTemplate(args)}/>
		`,
	}),
};

export const SelectDropdownNavigation: Story = {
	render: (args) => ({
		props: { ...args },
		template: /* HTML */ `
			<hlm-react-daypicker-calendar ${argsToTemplate(args)}/>
		`,
	}),
};
