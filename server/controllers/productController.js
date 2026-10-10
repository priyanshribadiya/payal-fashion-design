import { Product } from '../models/Product.js';
import { Category } from '../models/Category.js';

/**
 * List products with search, category filtering, price sorting, and pagination
 */
export async function getProducts(req, res, next) {
  try {
    const {
      search,
      category,
      minPrice,
      maxPrice,
      sort = 'featured',
      page = 1,
      limit = 12,
      inStockOnly,
    } = req.query;

    const query = { isActive: true };

    // Search by name or description
    if (search && search.trim()) {
      query.$or = [
        { name: { $regex: search.trim(), $options: 'i' } },
        { description: { $regex: search.trim(), $options: 'i' } },
        { categoryName: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    // Category filter by category slug or name
    if (category && category !== 'all') {
      const categoryDoc = await Category.findOne({
        $or: [
          { slug: category.toLowerCase() },
          { name: { $regex: new RegExp(`^${category}$`, 'i') } },
        ],
      });
      if (categoryDoc) {
        query.category = categoryDoc._id;
      } else {
        query.categoryName = { $regex: new RegExp(`^${category}$`, 'i') };
      }
    }

    // Price range filters in Paise
    if (minPrice || maxPrice) {
      query.priceInPaise = {};
      if (minPrice) query.priceInPaise.$gte = Math.round(Number(minPrice) * 100);
      if (maxPrice) query.priceInPaise.$lte = Math.round(Number(maxPrice) * 100);
    }

    // In-stock filter
    if (inStockOnly === 'true') {
      query.inventoryQuantity = { $gt: 0 };
    }

    // Sorting
    let sortObj = { createdAt: -1 };
    if (sort === 'price-low') {
      sortObj = { priceInPaise: 1 };
    } else if (sort === 'price-high') {
      sortObj = { priceInPaise: -1 };
    } else if (sort === 'name-asc') {
      sortObj = { name: 1 };
    } else if (sort === 'featured') {
      sortObj = { isDemonstrationData: 1, createdAt: -1 };
    }

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    const [products, total] = await Promise.all([
      Product.find(query).sort(sortObj).skip(skip).limit(limitNum).lean(),
      Product.countDocuments(query),
    ]);

    // Format INR display for frontend
    const formattedProducts = products.map(p => ({
      ...p,
      priceINR: p.priceInPaise / 100,
      discountedPriceINR: p.discountedPriceInPaise ? p.discountedPriceInPaise / 100 : null,
      formattedPrice: `₹${(p.priceInPaise / 100).toLocaleString('en-IN')}`,
      formattedDiscountedPrice: p.discountedPriceInPaise
        ? `₹${(p.discountedPriceInPaise / 100).toLocaleString('en-IN')}`
        : null,
    }));

    return res.json({
      success: true,
      products: formattedProducts,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get single product by slug
 */
export async function getProductBySlug(req, res, next) {
  try {
    const { slug } = req.params;
    const product = await Product.findOne({ slug: slug.toLowerCase(), isActive: true })
      .populate('category', 'name slug')
      .lean();

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.',
      });
    }

    return res.json({
      success: true,
      product: {
        ...product,
        priceINR: product.priceInPaise / 100,
        discountedPriceINR: product.discountedPriceInPaise ? product.discountedPriceInPaise / 100 : null,
        formattedPrice: `₹${(product.priceInPaise / 100).toLocaleString('en-IN')}`,
        formattedDiscountedPrice: product.discountedPriceInPaise
          ? `₹${(product.discountedPriceInPaise / 100).toLocaleString('en-IN')}`
          : null,
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Admin: Create a new product
 */
export async function createProduct(req, res, next) {
  try {
    const {
      name,
      slug,
      description,
      categoryId,
      images,
      priceINR,
      discountedPriceINR,
      sizes,
      colors,
      sku,
      inventoryQuantity,
      availabilityStatus,
      isDemonstrationData = false,
    } = req.body;

    if (!name || !priceINR || !sku || !categoryId) {
      return res.status(400).json({
        success: false,
        message: 'Product name, price in INR, SKU, and category are required.',
      });
    }

    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(400).json({ success: false, message: 'Invalid category.' });
    }

    const productSlug = (slug || name)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const product = await Product.create({
      name: name.trim(),
      slug: productSlug,
      description: description || '',
      category: category._id,
      categoryName: category.name,
      images: Array.isArray(images) && images.length ? images : ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=700&q=80'],
      priceInPaise: Math.round(Number(priceINR) * 100),
      discountedPriceInPaise: discountedPriceINR ? Math.round(Number(discountedPriceINR) * 100) : null,
      sizes: sizes || ['S', 'M', 'L', 'XL'],
      colors: colors || [],
      sku: sku.trim().toUpperCase(),
      inventoryQuantity: parseInt(inventoryQuantity, 10) || 0,
      availabilityStatus: availabilityStatus || 'in_stock',
      isDemonstrationData,
      isActive: true,
    });

    return res.status(201).json({
      success: true,
      message: 'Product created successfully.',
      product,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Admin: Update existing product
 */
export async function updateProduct(req, res, next) {
  try {
    const { id } = req.params;
    const updates = { ...req.body };

    if (updates.priceINR !== undefined) {
      updates.priceInPaise = Math.round(Number(updates.priceINR) * 100);
      delete updates.priceINR;
    }
    if (updates.discountedPriceINR !== undefined) {
      updates.discountedPriceInPaise = updates.discountedPriceINR
        ? Math.round(Number(updates.discountedPriceINR) * 100)
        : null;
      delete updates.discountedPriceINR;
    }

    if (updates.categoryId) {
      const cat = await Category.findById(updates.categoryId);
      if (cat) {
        updates.category = cat._id;
        updates.categoryName = cat.name;
      }
      delete updates.categoryId;
    }

    const product = await Product.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    return res.json({
      success: true,
      message: 'Product updated successfully.',
      product,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Admin: Delete / Deactivate product
 */
export async function deleteProduct(req, res, next) {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    return res.json({
      success: true,
      message: 'Product archived successfully.',
    });
  } catch (error) {
    next(error);
  }
}
