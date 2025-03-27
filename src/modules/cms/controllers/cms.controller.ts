import { NextFunction, Request, Response } from "express";
import { CmsService } from "../services";

export class CmsController {
  public cmsService = new CmsService();

  // Get all CMS records
  public getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const cms = await this.cmsService.getAllCms();
      res.json(cms);
    } catch (error) {
      next(error);
    }
  }

  // Get a single CMS by ID
  public getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const cms = await this.cmsService.getCms(req.params.id);
      if (!cms) return res.status(404).json({ message: "CMS not found" });
      res.json(cms);
    } catch (error) {
      next(error);
    }
  }

  // Create a new CMS
  public create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const cms = await this.cmsService.createOrUpdateCms(req.body);
      res.status(201).json(cms);
    } catch (error) {
      next(error);
    }
  }

  // Remove Hero Image
  public removeHeroImage = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { imageId } = req.params;
      await this.cmsService.removeHeroImage(imageId);
      return res.status(200).json({ message: "Hero image removed successfully" });
    } catch (error) {
      next(error);
    }
  }
}
