import AppDataSource from '../../../core/database';
import { SubPlan } from '../../../core/database/postgres/subplan.entity';

export class SubPlanService {
  private repo = AppDataSource.getRepository(SubPlan);

  create(data: Partial<SubPlan>) {
    return this.repo.save(this.repo.create(data));
  }

  findAll() {
    return this.repo.find({ relations: ['plan'] });
  }

  findById(id: string) {
    return this.repo.findOne({ where: { id }, relations: ['plan'] });
  }

  async update(id: string, data: Partial<SubPlan>) {
    await this.repo.update(id, data);
    return this.findById(id);
  }

  async delete(id: string) {
    return this.repo.delete(id);
  }
}
