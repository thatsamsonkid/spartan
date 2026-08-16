import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { fireEvent, render } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { BrnStepperImports } from '../index';

@Component({
	imports: [BrnStepperImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div brnStepper [value]="value" [min]="min" [max]="max" [step]="step" [disabled]="disabled" aria-label="Quantity">
			<button brnStepperDecrement>-</button>
			<button brnStepperIncrement>+</button>
		</div>
	`,
})
class SpinbuttonStepper {
	public value: number | null = 5;
	public min: number | null = 0;
	public max: number | null = 10;
	public step = 1;
	public disabled = false;
}

@Component({
	imports: [BrnStepperImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div brnStepper [value]="value" [min]="min" [max]="max" aria-label="Quantity">
			<button brnStepperDecrement>-</button>
			<input brnStepperInput />
			<button brnStepperIncrement>+</button>
		</div>
	`,
})
class InputStepper {
	public value: number | null = 5;
	public min: number | null = 0;
	public max: number | null = 10;
}

@Component({
	imports: [BrnStepperImports, ReactiveFormsModule],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div brnStepper [min]="0" [max]="10" [formControl]="control" aria-label="Quantity">
			<button brnStepperDecrement>-</button>
			<input brnStepperInput />
			<button brnStepperIncrement>+</button>
		</div>
	`,
})
class ReactiveFormStepper {
	public readonly control = new FormControl<number | null>(5);
}

describe('BrnStepper', () => {
	describe('spinbutton mode (no input)', () => {
		it('should place the spinbutton role and value aria attributes on the root', async () => {
			const { container } = await render(SpinbuttonStepper);
			const root = container.querySelector('[brnStepper]') as HTMLElement;

			expect(root.getAttribute('role')).toBe('spinbutton');
			expect(root.getAttribute('tabindex')).toBe('0');
			expect(root.getAttribute('aria-valuemin')).toBe('0');
			expect(root.getAttribute('aria-valuemax')).toBe('10');
			expect(root.getAttribute('aria-valuenow')).toBe('5');
			expect(root.getAttribute('aria-label')).toBe('Quantity');
		});

		it('should increment and decrement with arrow keys', async () => {
			const { container } = await render(SpinbuttonStepper);
			const root = container.querySelector('[brnStepper]') as HTMLElement;

			fireEvent.keyDown(root, { key: 'ArrowUp' });
			expect(root.getAttribute('aria-valuenow')).toBe('6');

			fireEvent.keyDown(root, { key: 'ArrowDown' });
			fireEvent.keyDown(root, { key: 'ArrowDown' });
			expect(root.getAttribute('aria-valuenow')).toBe('4');
		});

		it('should apply a 10x multiplier with shift and page keys', async () => {
			const { container } = await render(SpinbuttonStepper, { componentProperties: { max: 100 } });
			const root = container.querySelector('[brnStepper]') as HTMLElement;

			fireEvent.keyDown(root, { key: 'ArrowUp', shiftKey: true });
			expect(root.getAttribute('aria-valuenow')).toBe('15');

			fireEvent.keyDown(root, { key: 'PageUp' });
			expect(root.getAttribute('aria-valuenow')).toBe('25');

			fireEvent.keyDown(root, { key: 'PageDown' });
			expect(root.getAttribute('aria-valuenow')).toBe('15');
		});

		it('should jump to min and max with home and end keys', async () => {
			const { container } = await render(SpinbuttonStepper);
			const root = container.querySelector('[brnStepper]') as HTMLElement;

			fireEvent.keyDown(root, { key: 'End' });
			expect(root.getAttribute('aria-valuenow')).toBe('10');

			fireEvent.keyDown(root, { key: 'Home' });
			expect(root.getAttribute('aria-valuenow')).toBe('0');
		});

		it('should clamp keyboard changes to the bounds', async () => {
			const { container } = await render(SpinbuttonStepper, { componentProperties: { value: 10 } });
			const root = container.querySelector('[brnStepper]') as HTMLElement;

			fireEvent.keyDown(root, { key: 'ArrowUp' });
			expect(root.getAttribute('aria-valuenow')).toBe('10');
		});

		it('should not react to keyboard when disabled', async () => {
			const { container } = await render(SpinbuttonStepper, { componentProperties: { disabled: true } });
			const root = container.querySelector('[brnStepper]') as HTMLElement;

			expect(root.getAttribute('tabindex')).toBeNull();
			expect(root.getAttribute('aria-disabled')).toBe('true');

			fireEvent.keyDown(root, { key: 'ArrowUp' });
			expect(root.getAttribute('aria-valuenow')).toBe('5');
		});

		it('should normalize an out of bounds initial value', async () => {
			const { container } = await render(SpinbuttonStepper, { componentProperties: { value: 50 } });
			const root = container.querySelector('[brnStepper]') as HTMLElement;

			expect(root.getAttribute('aria-valuenow')).toBe('10');
		});
	});

	describe('increment and decrement buttons', () => {
		it('should step the value on pointer down', async () => {
			const { container } = await render(SpinbuttonStepper);
			const root = container.querySelector('[brnStepper]') as HTMLElement;
			const increment = container.querySelector('[brnStepperIncrement]') as HTMLButtonElement;
			const decrement = container.querySelector('[brnStepperDecrement]') as HTMLButtonElement;

			fireEvent.pointerDown(increment, { button: 0 });
			fireEvent.pointerUp(increment);
			expect(root.getAttribute('aria-valuenow')).toBe('6');

			fireEvent.pointerDown(decrement, { button: 0 });
			fireEvent.pointerUp(decrement);
			expect(root.getAttribute('aria-valuenow')).toBe('5');
		});

		it('should disable the buttons at the bounds', async () => {
			const { container } = await render(SpinbuttonStepper, { componentProperties: { value: 10 } });
			const increment = container.querySelector('[brnStepperIncrement]') as HTMLButtonElement;
			const decrement = container.querySelector('[brnStepperDecrement]') as HTMLButtonElement;

			expect(increment.disabled).toBe(true);
			expect(decrement.disabled).toBe(false);
		});

		it('should disable both buttons when the stepper is disabled', async () => {
			const { container } = await render(SpinbuttonStepper, { componentProperties: { disabled: true } });
			const increment = container.querySelector('[brnStepperIncrement]') as HTMLButtonElement;
			const decrement = container.querySelector('[brnStepperDecrement]') as HTMLButtonElement;

			expect(increment.disabled).toBe(true);
			expect(decrement.disabled).toBe(true);
		});

		it('should repeat the step while holding the button', async () => {
			vi.useFakeTimers();

			try {
				const { fixture, container } = await render(SpinbuttonStepper, { componentProperties: { max: 100 } });
				const root = container.querySelector('[brnStepper]') as HTMLElement;
				const increment = container.querySelector('[brnStepperIncrement]') as HTMLButtonElement;

				fireEvent.pointerDown(increment, { button: 0 });
				expect(root.getAttribute('aria-valuenow')).toBe('6');

				// default delay is 500ms, then a step every 50ms
				vi.advanceTimersByTime(500 + 3 * 50);
				fixture.detectChanges();
				expect(root.getAttribute('aria-valuenow')).toBe('9');

				fireEvent.pointerUp(increment);
				vi.advanceTimersByTime(1000);
				fixture.detectChanges();
				expect(root.getAttribute('aria-valuenow')).toBe('9');
			} finally {
				vi.useRealTimers();
			}
		});

		it('should stop repeating at the bound', async () => {
			vi.useFakeTimers();

			try {
				const { fixture, container } = await render(SpinbuttonStepper, { componentProperties: { value: 8 } });
				const root = container.querySelector('[brnStepper]') as HTMLElement;
				const increment = container.querySelector('[brnStepperIncrement]') as HTMLButtonElement;

				fireEvent.pointerDown(increment, { button: 0 });
				vi.advanceTimersByTime(5000);
				fixture.detectChanges();
				expect(root.getAttribute('aria-valuenow')).toBe('10');
			} finally {
				vi.useRealTimers();
			}
		});
	});

	describe('input mode', () => {
		it('should move the spinbutton role onto the input and make the root a group', async () => {
			const { container } = await render(InputStepper);
			const root = container.querySelector('[brnStepper]') as HTMLElement;
			const input = container.querySelector('input') as HTMLInputElement;

			expect(root.getAttribute('role')).toBe('group');
			expect(root.getAttribute('tabindex')).toBeNull();
			expect(root.getAttribute('aria-valuenow')).toBeNull();

			expect(input.getAttribute('role')).toBe('spinbutton');
			expect(input.getAttribute('inputmode')).toBe('numeric');
			expect(input.getAttribute('aria-valuemin')).toBe('0');
			expect(input.getAttribute('aria-valuemax')).toBe('10');
			expect(input.getAttribute('aria-valuenow')).toBe('5');
			expect(input.getAttribute('aria-label')).toBe('Quantity');
			expect(input.value).toBe('5');
		});

		it('should commit a typed value on blur', async () => {
			const { container } = await render(InputStepper);
			const input = container.querySelector('input') as HTMLInputElement;

			await userEvent.clear(input);
			await userEvent.type(input, '7');
			await userEvent.tab();

			expect(input.value).toBe('7');
			expect(input.getAttribute('aria-valuenow')).toBe('7');
		});

		it('should commit a typed value on enter', async () => {
			const { container } = await render(InputStepper);
			const input = container.querySelector('input') as HTMLInputElement;

			await userEvent.clear(input);
			await userEvent.type(input, '3{Enter}');

			expect(input.value).toBe('3');
			expect(input.getAttribute('aria-valuenow')).toBe('3');
		});

		it('should clamp and round a typed value', async () => {
			const { container } = await render(InputStepper);
			const input = container.querySelector('input') as HTMLInputElement;

			await userEvent.clear(input);
			await userEvent.type(input, '250{Enter}');
			expect(input.value).toBe('10');

			await userEvent.clear(input);
			await userEvent.type(input, '3.7{Enter}');
			expect(input.value).toBe('4');
		});

		it('should revert invalid text to the previous value', async () => {
			const { container } = await render(InputStepper);
			const input = container.querySelector('input') as HTMLInputElement;

			await userEvent.clear(input);
			await userEvent.type(input, 'abc{Enter}');

			expect(input.value).toBe('5');
			expect(input.getAttribute('aria-valuenow')).toBe('5');
		});

		it('should treat cleared text as an empty value', async () => {
			const { container } = await render(InputStepper);
			const input = container.querySelector('input') as HTMLInputElement;

			await userEvent.clear(input);
			await userEvent.tab();

			expect(input.value).toBe('');
			expect(input.getAttribute('aria-valuenow')).toBeNull();
		});

		it('should support arrow keys on the input', async () => {
			const { container } = await render(InputStepper);
			const input = container.querySelector('input') as HTMLInputElement;

			fireEvent.keyDown(input, { key: 'ArrowUp' });
			expect(input.getAttribute('aria-valuenow')).toBe('6');
			expect(input.value).toBe('6');
		});
	});

	describe('reactive forms', () => {
		it('should reflect the control value', async () => {
			const { container } = await render(ReactiveFormStepper);
			const input = container.querySelector('input') as HTMLInputElement;

			expect(input.value).toBe('5');
		});

		it('should update the control when stepping', async () => {
			const { fixture, container } = await render(ReactiveFormStepper);
			const increment = container.querySelector('[brnStepperIncrement]') as HTMLButtonElement;

			fireEvent.pointerDown(increment, { button: 0 });
			fireEvent.pointerUp(increment);

			expect(fixture.componentInstance.control.value).toBe(6);
		});

		it('should update the view when the control changes', async () => {
			const { fixture, container } = await render(ReactiveFormStepper);
			const input = container.querySelector('input') as HTMLInputElement;

			fixture.componentInstance.control.setValue(9);
			fixture.detectChanges();
			await fixture.whenStable();

			expect(input.value).toBe('9');
		});

		it('should disable the stepper when the control is disabled', async () => {
			const { fixture, container } = await render(ReactiveFormStepper);
			const input = container.querySelector('input') as HTMLInputElement;
			const increment = container.querySelector('[brnStepperIncrement]') as HTMLButtonElement;

			fixture.componentInstance.control.disable();
			fixture.detectChanges();
			await fixture.whenStable();

			expect(input.disabled).toBe(true);
			expect(increment.disabled).toBe(true);
		});

		it('should mark the control as touched on focus out', async () => {
			const { fixture, container } = await render(ReactiveFormStepper);
			const input = container.querySelector('input') as HTMLInputElement;

			expect(fixture.componentInstance.control.touched).toBe(false);

			await userEvent.click(input);
			await userEvent.tab();

			expect(fixture.componentInstance.control.touched).toBe(true);
		});
	});
});
