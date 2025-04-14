import crypto from 'crypto';
import { Repository } from 'typeorm';
// import { nanoid } from "nanoid";
import AppDataSource from '../../../core/database';
import { Cms } from '../entities/cms.entity';
import { Image } from '../../images/entities/image.entity';

export class CmsService {
  private cmsRepository: Repository<Cms>;
  private imageRepository: Repository<Image>;

  constructor() {
    this.cmsRepository = AppDataSource.getRepository(Cms);
    this.imageRepository = AppDataSource.getRepository(Image);
  }

  // Fetch all CMS entries
  async getAllCms(): Promise<Cms[]> {
    return await this.cmsRepository.find({ relations: ['hero_images'] });
  }

  // Fetch a single CMS by ID
  async getCms(id: string): Promise<Cms | null> {
    return await this.cmsRepository.findOne({ where: { id }, relations: ['hero_images'] });
  }

  // Create or update CMS entry
  async createOrUpdateCms(data: Partial<Cms>): Promise<Cms> {
    const { hero_images, ...cmsData } = data;

    let cms = await this.cmsRepository.findOne({
      where: {},
      relations: ['hero_images'],
      order: { id: 'ASC' },
    });

    if (!cms) {
      cms = this.cmsRepository.create({ id: crypto.randomBytes(16).toString('hex'), ...cmsData });
    } else {
      this.cmsRepository.merge(cms, cmsData);

      // Remove existing hero images
      await this.imageRepository.delete({ cms: { id: cms.id } });
    }

    // Save CMS first
    await this.cmsRepository.save(cms);

    // Handle hero images
    if (hero_images && hero_images.length > 0) {
      //delete hero images
      await this.imageRepository.delete({ cms });
      const images = hero_images.map(img => {
        const image = new Image();
        image.id = crypto.randomBytes(16).toString('hex');
        image.url = img.url;
        image.cms = cms;
        return image;
      });

      await this.imageRepository.save(images);
    }

    return await this.cmsRepository.findOne({ where: { id: cms.id }, relations: ['hero_images'] });
  }

  async removeHeroImage(imageId: string): Promise<void> {
    const image = await this.imageRepository.findOne({ where: { id: imageId } });
    if (!image) throw new Error('Hero image not found');

    await this.imageRepository.delete(imageId);
  }
}
