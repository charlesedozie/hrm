import { Controller, Get, Query, Post, Body, Param, Put, UseGuards, Req, Delete, NotFoundException, UnauthorizedException, Patch } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PerformanceService } from '../services/service';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { JwtPayload } from '@/modules/auth/types/jwt-payload.interface';
import {CreatePerformanceDevelopmentPlanDto, CreatePerformanceRatingScaleDto, CreatePerformanceFeedbackDto, CreatePerformanceAppraisalRatingDto, CreatePerformanceGoalDto, CreatePerformanceCycleDto, CreatePerformanceAppraisalDto, UpdatePerformanceDevelopmentPlanDto, UpdatePerformanceRatingScaleDto, UpdatePerformanceFeedbackDto, UpdatePerformanceAppraisalRatingDto, UpdatePerformanceGoalDto, UpdatePerformanceCycleDto, UpdatePerformanceAppraisalDto 
} from '../dto/dto';

@ApiTags('Performance')
@ApiBearerAuth()
@Controller('performance')
@UseGuards(JwtAuthGuard)

export class PerformanceController {
constructor(private readonly service: PerformanceService) {}

// Cycles
@Get('cycles')
findAllCycles() {
return this.service.findAllCycles();
}


/*
@Post('cycles')
createCycle(@Body() dto: CreatePerformanceCycleDto) {
return this.service.createCycle(dto);
}
*/

// Goals
@Post('goals')
createGoal(@Body() dto: CreatePerformanceGoalDto) {
return this.service.createGoal(dto);
}

@Get('cycles/:cycleId/goals')
findGoalsByCycle(@Param('cycleId') cycleId: string) {
return this.service.findGoalsByCycle(cycleId);
}

/*
// Appraisals
@Post('appraisals')
startAppraisal(@Body() dto: CreatePerformanceAppraisalDto) {
return this.service.startAppraisal(dto);
}
*/
@Get('appraisals')
findMyAppraisals(@Req() req: any) {
return this.service.findMyAppraisals(req.user.id); // assuming JWT guard
}

@Get('appraisals/:id')
findOne(@Param('id') id: string) {
return this.service.findAppraisalById(id);
}


@Post('feedback')
createFeedback(@Body() dto: CreatePerformanceFeedbackDto) {
return this.service.createFeedback(dto);
}

// performance.controller.ts
@Get('dashboard-stats')
async getDashboardStats() {
const appraisals = await this.service.getAllAppraisals(); // add method
// compute stats...
const byStatus = 8;/* group by status */
const averageScores = 39;/* aggregate ratings */
const completionRate = 34; /* (completed / total) * 100 */

return { byStatus, averageScores, completionRate };
}

/*
@Post()
create(
@Body() dto: CreateMasterIndicatorDto,
//@Body() body: any,
@CurrentUser() user: JwtPayload,
) {

if (!user?.id) {
throw new UnauthorizedException('User ID not found in token');
}

try {
const dto = new CreateMasterIndicatorDto();
} catch (e) {
console.error('DTO instantiation failed:', e);
}
return this.service.create(dto, user.id);
}


@Put(':id')
update(@Param('id') id: string, @Body() data: UpdateMasterIndicatorDto): Promise<MasterIndicator> {
return this.service.update(id, data);
}

@Delete(':id')
remove(@Param('id') id: string): Promise<MasterIndicator> {
return this.service.delete(id);
}


@Get()
findAll(@Query() query: QueryMasterIndicatorDto) {
return this.service.getAll(query);
}


@Get(':id')
async findOne(@Param('id') id: string) {
const result = await this.service.getAll({ id });
// pick the first item or throw if not found
if (!result.items || result.items.length === 0) {
throw new NotFoundException('Item not found');
}
return result.items[0]; // <-- return the object directly
}

*/




}
