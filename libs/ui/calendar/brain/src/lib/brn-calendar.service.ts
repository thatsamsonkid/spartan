import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { DateService } from './agnostic-date-ops/date.service';

@Injectable()
export class BrnCalendarService {
	private _dateService = inject(DateService);
	public readonly state = signal<{
		id: string;
		mode: 'single' | 'multiple' | 'range';
		selectedDate: Date | null;
		selectedYear: Date | null;
		minDate: Date | null;
		maxDate: Date | null;
		startAt: Date | null;
		startView: 'month' | 'months' | 'year';
		dateFilter?: (d: Date) => boolean | null;
		daysOfTheWeek: string[];
		currentMonthYear: Date | null;
		currentMonthYearDays: Array<Array<Date | null>> | null;
		locale: string;
		years: Date[][] | null;
		view: 'month' | 'months' | 'year';
	}>({
		id: '',
		mode: 'single',
		selectedDate: null,
		selectedYear: null,
		minDate: null,
		maxDate: null,
		startAt: null,
		startView: 'month',
		daysOfTheWeek: [],
		currentMonthYear: null,
		currentMonthYearDays: null,
		years: [], // Array for keeping the current years for given year range
		locale: 'en-US', // Only default value
		view: 'month',
	});

	public readonly id = computed(() => this.state().id);
	public readonly mode = computed(() => this.state().mode);
	public readonly selectedDate = computed(() => this.state().selectedDate);
	public readonly selectedYear = computed(() => this.state().selectedYear);
	public readonly minDate = computed(() => this.state().minDate);
	public readonly maxDate = computed(() => this.state().maxDate);
	public readonly startAt = computed(() => this.state().startAt);
	public readonly startView = computed(() => this.state().startView);
	public readonly daysOfTheWeek = computed(() => this.state().daysOfTheWeek);
	public readonly currentMonthYear = computed(() => this.state().currentMonthYear);
	public readonly currentMonthYearDays = computed(() => this.state().currentMonthYearDays);
	public readonly locale = computed(() => this.state().locale);
	public readonly view = computed(() => this.state().view);
	public readonly years = computed(() => this.state().years);

	public readonly currentMonth = computed(() => {
		const currentMonthYear = this.currentMonthYear();
		return currentMonthYear ? this._dateService.getMonth(currentMonthYear) : null;
	});

	public readonly currentMonthName = computed(() => {
		const currentMonthYear = this.currentMonthYear();
		console.log(currentMonthYear);
		return currentMonthYear ? this._dateService.getMonthName(currentMonthYear, this.locale()) : null;
	});

	public readonly currentYear = computed(() => {
		const currentMonthYear = this.currentMonthYear();
		console.log(currentMonthYear);
		return currentMonthYear ? this._dateService.getYear(currentMonthYear) : null;
	});

	private readonly yearsPerPage = 24;
	private readonly yearsPerRow = 4;

	constructor() {
		effect(() => {
			console.log('We updated: ', this.currentMonthYear());
		});
	}

	/**
	 * Getters
	 */

	getLocale(): string {
		return this._dateService.getLocale();
	}

	getToday(): Date {
		return this._dateService.today();
	}

	isToday(date: Date): boolean {
		const today = this._dateService.today();
		if (
			date &&
			today.getFullYear() === date.getFullYear() &&
			today.getMonth() === date.getMonth() &&
			today.getDate() === date.getDate()
		) {
			return true;
		}
		return false;
	}
	/**
	 * Updaters
	 */

	public updateDaysOfTheWeek(daysOfTheWeek: string[]): void {
		this.state.update((state) => ({
			...state,
			daysOfTheWeek,
		}));
	}

	public updateCurrentMonthYear(currentMonthYear: Date | null): void {
		this.state.update((state) => ({
			...state,
			currentMonthYear: currentMonthYear ? new Date(currentMonthYear) : null,
		}));
	}

	public updateCurrentMonthYearDays(currentMonthYearDays: Array<Array<Date | null>> | null): void {
		this.state.update((state) => ({
			...state,
			currentMonthYearDays,
		}));
	}

	public updateView(view: 'month' | 'year'): void {
		this.state.update((state) => ({
			...state,
			view,
		}));
	}

	public updateYears(years: Date[][]): void {
		this.state.update((state) => ({
			...state,
			years,
		}));
	}

	public updateSelectedDate(selectedDate: Date): void {
		this.state.update((state) => ({
			...state,
			selectedDate,
		}));
	}

	public updateSelectedYear(selectedYear: number): void {
		// Mat lib defaults to emitting month and year selections with
		// the current selected date. if null assumes first day of year
		this.state.update((state) => {
			// if selected date null assume new brand new date with selected year
			if (!state.selectedDate) {
				return {
					...state,
					selectedYear: new Date(selectedYear, 0, 1),
					view: 'months',
				};
			}
			// use selectedDate as base date to emit newly selected year
			const newlySelectedDateYear = new Date(state.selectedDate.getTime());
			newlySelectedDateYear.setFullYear(selectedYear);
			return {
				...state,
				selectedYear: newlySelectedDateYear,
				view: 'months',
			};
		});
	}

	/**
	 * Methods
	 */

	public generateDaysOfWeek() {
		const formatter = new Intl.DateTimeFormat(this.locale() ?? undefined, { weekday: 'short' });
		const baseDate = new Date(Date.UTC(2021, 5, 7)); // A Sunday
		const daysOfTheWeek = [];
		for (let i = 0; i < 7; i++) {
			const date = new Date(baseDate);
			date.setDate(baseDate.getDate() + i);
			daysOfTheWeek.push(formatter.format(date));
		}
		this.updateDaysOfTheWeek(daysOfTheWeek);
	}

	public generateCalendar(): Array<Array<Date | null>> {
		this.generateDaysOfWeek();
		const currentMonthYearDate =
			(this.currentMonthYear() || this.selectedDate()) ?? this._dateService.firstOfCurrentMonthYear();

		console.log(currentMonthYearDate);

		//This ensures this is in sync especially on initialization
		// Break reference with new date
		this.updateCurrentMonthYear(new Date(currentMonthYearDate));
		const daysInMonth = this._dateService.getDaysInMonth(currentMonthYearDate);

		const calendar: Array<Array<Date | null>> = [];
		let week: Array<Date | null> = [];

		// Fill the first week with empty days if the month doesn't start on Sunday
		const firstDay = daysInMonth[0].getDay();
		for (let i = 0; i < firstDay; i++) {
			week.push(null);
		}

		for (const day of daysInMonth) {
			if (week.length === 7) {
				calendar.push(week);
				week = [];
			}
			week.push(day);
		}

		// Fill the last week with empty days if needed
		while (week.length < 7) {
			week.push(null);
		}
		calendar.push(week);

		this.updateCurrentMonthYearDays(calendar);
		return calendar;
	}

	generateMonthsArray() {
		// Try to get year from 1 of 2 locations otherwise any year is fine
		const year = this.selectedDate()?.getFullYear() || this.selectedYear()?.getFullYear() || 2024;
		const monthsArray = [];
		let monthIndex = 0; // Months are zero-indexed in JavaScript Date objects

		for (let row = 0; row < 3; row++) {
			const rowArray = [];
			for (let col = 0; col < 4; col++) {
				// Create a Date object for the first day of the current month
				const date = new Date(year, monthIndex, 1);
				rowArray.push(date);
				monthIndex++;
			}
			monthsArray.push(rowArray);
		}

		return monthsArray;
	}

	public updateCalendar(newMonthDate: Date): void {
		const daysInMonth = this._dateService.getDaysInMonth(newMonthDate);

		const calendar: Array<Array<Date | null>> = [];
		let week: Array<Date | null> = [];

		// Fill the first week with empty days if the month doesn't start on Sunday
		const firstDay = daysInMonth[0].getDay();
		for (let i = 0; i < firstDay; i++) {
			week.push(null);
		}

		for (const day of daysInMonth) {
			if (week.length === 7) {
				calendar.push(week);
				week = [];
			}
			week.push(day);
		}

		// Fill the last week with empty days if needed
		while (week.length < 7) {
			week.push(null);
		}
		calendar.push(week);

		this.updateCurrentMonthYearDays(calendar);
	}

	public updateSelection(value: any) {
		console.log(value);
		//1. Depending on current view emit correct event
		//2. if month-day-view emit date selections
		// const currentMonthYear = this.currentMonthYear();
		if (this.view() === 'months') {
			// const newMonthDate = this._dateService.adjustMonth(currentMonthYear, 1);
			// this.updateCurrentMonthYear(newMonthDate);
			// this.updateCalendar(newMonthDate);
		} else if (this.view() === 'year') {
			this.updateSelectedYear(value);
			// const newYearDate = this._dateService.addCalendarYears(currentMonthYear, this.yearsPerPage);
			// this.updateCurrentMonthYear(newYearDate);
			// this.generateYears();
			// console.log(this.years());
		} else {
			// Assume day view
			this.updateSelectedDate(value);
		}
	}

	public onNext(): void {
		const currentMonthYear = this.currentMonthYear();
		if (this.view() === 'month' && currentMonthYear) {
			const newMonthDate = this._dateService.adjustMonth(currentMonthYear, 1);
			this.updateCurrentMonthYear(newMonthDate);
			this.updateCalendar(newMonthDate);
		} else if (this.view() === 'year' && currentMonthYear) {
			const newYearDate = this._dateService.addCalendarYears(currentMonthYear, this.yearsPerPage);
			this.updateCurrentMonthYear(newYearDate);
			this.generateYears();
		}
	}

	public onPrevious(): void {
		const currentMonthYear = this.currentMonthYear();
		if (this.view() === 'month' && currentMonthYear) {
			const newMonthDate = this._dateService.adjustMonth(currentMonthYear, -1);
			this.updateCurrentMonthYear(newMonthDate);
			this.updateCalendar(newMonthDate);
		} else if (this.view() === 'year' && currentMonthYear) {
			const newYearDate = this._dateService.addCalendarYears(currentMonthYear, -this.yearsPerPage);
			this.updateCurrentMonthYear(newYearDate);
			this.generateYears();
		}
	}

	public generateYears(): void {
		const monthYear = this.currentMonthYear();
		if (monthYear && this._dateService.isDate(monthYear)) {
			// // We want a range years such that we maximize the number of
			// // enabled dates visible at once. This prevents issues where the minimum year
			// // is the last item of a page OR the maximum year is the first item of a page.
			// // The offset from the active year to the "slot" for the starting year is the
			// // *actual* first rendered year in the multi-year view.
			const years = [];
			const activeYear = this._dateService.getYear(monthYear);
			const minYearOfPage = activeYear - this.getActiveOffset(monthYear, this.minDate(), this.maxDate());
			for (let i = 0, row: number[] = []; i < this.yearsPerPage; i++) {
				row.push(minYearOfPage + i);
				if (row.length === this.yearsPerRow) {
					years.push(row.map((year) => new Date(year, 0)));
					row = [];
				}
			}
			this.updateYears(years);
		}
	}

	public switchView(): void {
		this.updateView(this.view() === 'year' ? 'month' : 'year');
	}

	/**
	 * When the multi-year view is first opened, the active year will be in view.
	 * So we compute how many years are between the active year and the *slot* where our
	 * "startingYear" will render when paged into view.
	 */
	private getActiveOffset<Date>(activeDate: Date, minDate: Date | null, maxDate: Date | null): number {
		if (activeDate && this._dateService.isDate(activeDate)) {
			// FIXME: Some odd type mismatching
			// @ts-ignore
			const activeYear = this._dateService.getYear(activeDate as Date);
			return this.euclideanModulo(activeYear - this.getStartingYear(minDate, maxDate), this.yearsPerPage);
		}

		return 0;
	}

	/**
	 * We pick a "starting" year such that either the maximum year would be at the end
	 * or the minimum year would be at the beginning of a page.
	 */
	private getStartingYear<Date>(minDate: Date | null, maxDate: Date | null): number {
		let startingYear = 0;
		if (maxDate) {
			// @ts-ignore
			const maxYear = this._dateService.getYear(maxDate);
			startingYear = maxYear - this.yearsPerPage + 1;
		} else if (minDate) {
			// @ts-ignore
			startingYear = this._dateService.getYear(minDate);
		}
		return startingYear;
	}

	/** Gets remainder that is non-negative, even if first number is negative */
	private euclideanModulo(a: number, b: number): number {
		return ((a % b) + b) % b;
	}
}
