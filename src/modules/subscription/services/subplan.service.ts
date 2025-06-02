import AppDataSource from '../../../core/database';
import { SubPlan } from '../../../core/database/postgres/subplan.entity';
import { CreateSubPlanDto, UpdateSubPlanDto } from '../schemas';

export class SubPlanService {
  private repo = AppDataSource.getRepository(SubPlan);

  create(data: CreateSubPlanDto) {
    const savedSubPlan = this.repo.save(this.repo.create(data));
    return savedSubPlan;
  }

  findAll() {
    const subPlans = this.repo.find({ relations: ['plan'] });
    return subPlans;
  }

  findById(id: string) {
    const subPlan = this.repo.findOne({ where: { id }, relations: ['plan'] });
    return subPlan;
  }

  async update(id: string, data: Partial<UpdateSubPlanDto>) {
    await this.repo.update(id, data);
    const updatedSubPlan = this.findById(id);
    return updatedSubPlan;
  }

  async delete(id: string) {
    const result = this.repo.delete(id);
    return result;
  }
}
