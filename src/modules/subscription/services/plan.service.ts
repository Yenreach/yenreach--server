import AppDataSource from '../../../core/database';
import { Plan } from '../../../core/database/postgres/plan.entity';

export class PlanService {
  private planRepo = AppDataSource.getRepository(Plan);

  create(data: Partial<Plan>) {
    const plan = this.planRepo.create(data);
    return this.planRepo.save(plan);
  }

  findAll() {
    return this.planRepo.find({ relations: ['subPlans'] });
  }

  async update(id: string, data: Partial<Plan>) {
    await this.planRepo.update(id, data);
    return this.planRepo.findOne({ where: { id } });
  }

  async delete(id: string) {
    return this.planRepo.delete(id);
  }
}
