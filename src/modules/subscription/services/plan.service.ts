import AppDataSource from '../../../database';
import { Plan } from '../../../database/entities/plan.entity';
import { CreatePlanDto, UpdatePlanDto } from '../schemas';

export class PlanService {
  private planRepo = AppDataSource.getRepository(Plan);

  create(data: CreatePlanDto) {
    const plan = this.planRepo.create(data);
    const savedPlan = this.planRepo.save(plan);
    return savedPlan;
  }

  findAll() {
    const plans = this.planRepo.find({ relations: ['subPlans'] });
    return plans;
  }

  async update(id: string, data: Partial<UpdatePlanDto>) {
    await this.planRepo.update(id, data);
    const updatedPlan = this.planRepo.findOne({ where: { id } });
    return updatedPlan;
  }

  async delete(id: string) {
    const result = this.planRepo.delete(id);
    return result;
  }
}
