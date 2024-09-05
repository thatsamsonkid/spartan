import { type ModuleWithProviders, NgModule } from '@angular/core';
import {} from './date-ops';
import { DateService } from './date.service';
import { DEFAULT_DATE_OPS_PROVIDER } from './default-provider';

@NgModule({
	providers: [DateService],
})
// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class DateLibraryModule {
	static forRoot(): ModuleWithProviders<DateLibraryModule> {
		return {
			ngModule: DateLibraryModule,
			providers: [DEFAULT_DATE_OPS_PROVIDER],
		};
	}

	//   static forRootWithCustomDateOps(customDateOps: DateOperations): ModuleWithProviders<DateLibraryModule> {
	//     return {
	//       ngModule: DateLibraryModule,
	//       providers: [
	//         {
	//           provide: DATE_OPS,
	//           useValue: customDateOps,
	//         },
	//       ],
	//     };
	//   }
}
