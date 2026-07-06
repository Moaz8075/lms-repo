import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import {
  appConfig,
  databaseConfig,
  jwtConfig,
  validate,
} from './config';
import { PrismaModule } from './prisma';
import { GlobalExceptionFilter } from './common/filters';
import { ResponseInterceptor, LoggingInterceptor } from './common/interceptors';
import { JwtAuthGuard, PermissionsGuard, RolesGuard } from './common/guards';
import { PermissionsModule } from './common/permissions/permissions.module';
import { AuthModule } from './modules/auth/auth.module';
import { OrganizationsModule } from './modules/organizations/organizations.module';
import { UsersModule } from './modules/users/users.module';
import { ClientsModule } from './modules/clients/clients.module';
import { CasesModule } from './modules/cases/cases.module';
import { HearingsModule } from './modules/hearings/hearings.module';
import { DiaryModule } from './modules/diary/diary.module';
import { TasksModule } from './modules/tasks/tasks.module';
import { DocumentsModule } from './modules/documents/documents.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { ExpensesModule } from './modules/expenses/expenses.module';
import { LegalLibraryModule } from './modules/legal-library/legal-library.module';
import { LegalNotesModule } from './modules/legal-notes/legal-notes.module';
import { ActivityLogsModule } from './modules/activity-logs/activity-logs.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig, jwtConfig],
      validate,
      envFilePath: ['.env'],
    }),
    PrismaModule,
    PermissionsModule,
    AuthModule,
    OrganizationsModule,
    UsersModule,
    ClientsModule,
    CasesModule,
    HearingsModule,
    DiaryModule,
    TasksModule,
    DocumentsModule,
    PaymentsModule,
    ExpensesModule,
    LegalLibraryModule,
    LegalNotesModule,
    ActivityLogsModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionsGuard,
    },
  ],
})
export class AppModule {}
