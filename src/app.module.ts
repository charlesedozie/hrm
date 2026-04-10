import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { PrismaModule } from './common/prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { BeneficiaryModule } from './modules/beneficiary/module';
import { VacancyModule } from './modules/vacancy/module';
import { CountryModule } from './modules/country/module';
import { NationalityModule } from './modules/nationality/module';
import { NigeriaStateModule } from './modules/states/module';
import { EmployeeModule } from './modules/employees/module';
import { ApplicationformModule } from './modules/applications/module';
import { ScheduleModule } from '@nestjs/schedule';
import { MasterIndicatorModule } from './modules/indicator/module';
import { ProgramModule } from './modules/programs/module';
import { UploadModule } from './modules/upload/module';
import { OrgDocsModule } from './modules/org-docs/module';
import { AssetModule } from './modules/assets/module';
import { AssetCategoryModule } from './modules/asset-category/module';
import { OfficeLocationModule } from './modules/office-location/module'; 
import { ProjectModule } from './modules/projects/module';
import { LeaveModule } from './modules/leave/module';
import { OfficeRoleModule } from './modules/office-roles/module';
import { DepartmentModule } from './modules/departments/module';
import { OfficePositionModule } from './modules/office-positions/module';
import { UnitModule } from './modules/units/module';
import { JobLevelModule } from './modules/joblevel/module';
import { SyncCurrentSupervisorMiddleware } from '@/common/middleware/syncCurrentSupervisor';
import { AttendanceModule } from './modules/attendance/module';
import { ShiftModule } from './modules/shift/module';
import { WorkScheduleModule } from './modules/work-schedule/module';
import { HolidayCalendarModule } from './modules/holiday/module';
import { TimesheetModule } from './modules/timesheet/module';
import { LeaveRequestModule } from './modules/leave-request/module';
import { NgpayeBandModule } from './modules/ngpaye/module';
import { EarningModule } from './modules/earning/module';
import { LoanTypeModule } from './modules/loan-type/module';
import { PayrollPeriodModule } from './modules/payperiod/module';
import { PayrollCalendarModule } from './modules/payroll-calendar/module';
import { CurrencyModule } from './modules/currency/module';
import { LgaModule } from './modules/lga/module';
import { GenderModule } from './modules/gender/module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { UserSettingsModule } from './modules/user-settings/module';
import { PerformanceModule } from './modules/performance/module';
import { InterventionModule } from './modules/intervention/module';
import { InterventionCategoryModule } from './modules/intervention-category/module';
import { InterventionBatchModule } from './modules/intervention-batch/module';
import { APP_GUARD } from '@nestjs/core';
import { PermissionGuard } from '@/common/guards/permission.guard';
import { BeneficiaryFeedbackModule } from './modules/beneficiary-feedback/module';
import { GrievanceModule } from './modules/beneficiary-grievance/module';
import { BeneficiaryRequestModule } from './modules/beneficiary-request/module';

@Module({
  imports: [PrismaModule, AuthModule, UsersModule, BeneficiaryModule, VacancyModule, NationalityModule, CountryModule, NigeriaStateModule, EmployeeModule, ApplicationformModule,  ScheduleModule.forRoot(),  MasterIndicatorModule, ProgramModule, UploadModule, OrgDocsModule, AssetModule, AssetCategoryModule, OfficeLocationModule,  ProjectModule, LeaveModule, OfficeRoleModule, DepartmentModule, UnitModule, OfficePositionModule, JobLevelModule, AttendanceModule, ShiftModule, WorkScheduleModule, HolidayCalendarModule, TimesheetModule, LeaveRequestModule, NgpayeBandModule, EarningModule, LoanTypeModule, PayrollPeriodModule, PayrollCalendarModule, CurrencyModule, LgaModule, GenderModule, UserSettingsModule, PerformanceModule, InterventionModule, InterventionCategoryModule, InterventionBatchModule, BeneficiaryFeedbackModule, GrievanceModule, BeneficiaryRequestModule  //ActivityLogModule

   ],
})
export class AppModule {
  // ← This is the important part
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(SyncCurrentSupervisorMiddleware)
      .forRoutes('*');                 // ← applies globally (recommended for this case)
      // or more selective (safer during development):
     // .forRoutes('employees', 'employment-history'); // adjust paths/controllers as needed
  }
}
