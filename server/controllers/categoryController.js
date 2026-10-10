import { Category } from '../models/Category.js';

export async function getCategories(req, res, next) {
  try {
    const categories = await Category.find({ isActive: true })
      .sort({ displayOrder: 1, name: 1 })
      .lean();

    return res.json({
      success: true,
      categories,
    });
  } catch (error) {
    next(error);
  }
}

export async function createCategory(req, res, next) {
  try {
    const { name, description, image, tag, displayOrder } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: 'Category name is required' });
    }

    const slug = name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');
    const category = await Category.create({
      name: name.trim(),
      slug,
      description: description || '',
      image: image || '',
      tag: tag || '',
      displayOrder: Number(displayOrder) || 0,
      isActive: true,
    });

    return res.status(201).json({
      success: true,
      message: 'Category created successfully.',
      category,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateCategory(req, res, next) {
  try {
    const { id } = req.params;
    const category = await Category.findByIdAndUpdate(id, req.body, { new: true });
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found.' });
    }
    return res.json({
      success: true,
      message: 'Category updated successfully.',
      category,
    });
  } catch (error) {
    next(error);
  }
}
