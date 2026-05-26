import { Request, Response, NextFunction } from 'express';
import prisma from '../prisma';
import { NotFoundError } from '../utils/errors';

export const addTree = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { species, latitude, longitude, plantingDate, health } = req.body;

    const tree = await prisma.tree.create({
      data: {
        species,
        latitude,
        longitude,
        plantingDate: new Date(plantingDate),
        health,
      },
    });

    return res.status(201).json({
      status: 'success',
      data: {
        tree,
      },
    });
  } catch (error) {
    return next(error);
  }
};

export const getTrees = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { species, health } = req.query;

    const whereClause: any = {};
    
    if (species && typeof species === 'string') {
      whereClause.species = {
        equals: species,
      };
    }
    
    if (health && typeof health === 'string') {
      whereClause.health = {
        equals: health,
      };
    }

    const trees = await prisma.tree.findMany({
      where: whereClause,
      orderBy: {
        plantingDate: 'desc',
      },
    });

    return res.status(200).json({
      status: 'success',
      results: trees.length,
      data: {
        trees,
      },
    });
  } catch (error) {
    return next(error);
  }
};

export const updateTreeHealth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { health } = req.body;

    // Check if tree exists
    const treeExists = await prisma.tree.findUnique({
      where: { id },
    });

    if (!treeExists) {
      throw new NotFoundError(`Tree with ID ${id} not found.`);
    }

    const updatedTree = await prisma.tree.update({
      where: { id },
      data: { health },
    });

    return res.status(200).json({
      status: 'success',
      data: {
        tree: updatedTree,
      },
    });
  } catch (error) {
    return next(error);
  }
};

export const getStats = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    // 1. Get total tree count
    const totalTrees = await prisma.tree.count();

    if (totalTrees === 0) {
      return res.status(200).json({
        status: 'success',
        data: {
          totalTrees: 0,
          speciesBreakdown: {},
          healthBreakdown: {
            Good: 0,
            Fair: 0,
            Poor: 0,
          },
          percentageGoodHealth: 0,
        },
      });
    }

    // 2. Species Breakdown count
    const speciesCounts = await prisma.tree.groupBy({
      by: ['species'],
      _count: {
        id: true,
      },
    });

    const speciesBreakdown: Record<string, number> = {};
    speciesCounts.forEach((item) => {
      speciesBreakdown[item.species] = item._count.id;
    });

    // 3. Health Breakdown count
    const healthCounts = await prisma.tree.groupBy({
      by: ['health'],
      _count: {
        id: true,
      },
    });

    const healthBreakdown: Record<string, number> = {
      Good: 0,
      Fair: 0,
      Poor: 0,
    };
    healthCounts.forEach((item) => {
      healthBreakdown[item.health] = item._count.id;
    });

    // 4. Percentage of trees in Good health
    const goodTreesCount = healthBreakdown['Good'] || 0;
    const percentageGoodHealth = parseFloat(((goodTreesCount / totalTrees) * 100).toFixed(2));

    return res.status(200).json({
      status: 'success',
      data: {
        totalTrees,
        speciesBreakdown,
        healthBreakdown,
        percentageGoodHealth,
      },
    });
  } catch (error) {
    return next(error);
  }
};
