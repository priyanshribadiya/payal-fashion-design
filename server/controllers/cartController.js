import { Cart } from '../models/Cart.js';
import { Product } from '../models/Product.js';

/**
 * Calculates authoritative cart totals using live database product prices.
 */
async function calculateCartSummary(cartDoc) {
  if (!cartDoc || !cartDoc.items || cartDoc.items.length === 0) {
    return {
      items: [],
      subtotalInPaise: 0,
      subtotalINR: 0,
      shippingInPaise: 0,
      shippingINR: 0,
      totalInPaise: 0,
      totalINR: 0,
      itemCount: 0,
    };
  }

  // Populate product details
  await cartDoc.populate({
    path: 'items.product',
    select: 'name slug priceInPaise discountedPriceInPaise images inventoryQuantity isActive sku',
  });

  const validItems = [];
  let subtotalInPaise = 0;
  let itemCount = 0;

  for (const item of cartDoc.items) {
    if (!item.product || !item.product.isActive) continue;

    const unitPrice = item.product.discountedPriceInPaise || item.product.priceInPaise;
    const itemTotalInPaise = unitPrice * item.quantity;

    subtotalInPaise += itemTotalInPaise;
    itemCount += item.quantity;

    validItems.push({
      _id: item._id,
      product: {
        _id: item.product._id,
        name: item.product.name,
        slug: item.product.slug,
        sku: item.product.sku,
        image: item.product.images[0] || '',
        availableStock: item.product.inventoryQuantity,
      },
      size: item.size,
      color: item.color,
      quantity: item.quantity,
      unitPriceInPaise: unitPrice,
      unitPriceINR: unitPrice / 100,
      itemTotalInPaise,
      itemTotalINR: itemTotalInPaise / 100,
    });
  }

  // Shipping policy: Free delivery over ₹1,999 (199900 paise), else ₹150 (15000 paise)
  const shippingInPaise = subtotalInPaise >= 199900 || subtotalInPaise === 0 ? 0 : 15000;
  const totalInPaise = subtotalInPaise + shippingInPaise;

  return {
    items: validItems,
    subtotalInPaise,
    subtotalINR: subtotalInPaise / 100,
    shippingInPaise,
    shippingINR: shippingInPaise / 100,
    totalInPaise,
    totalINR: totalInPaise / 100,
    itemCount,
  };
}

/**
 * Retrieve active cart for user or guest session
 */
export async function getCart(req, res, next) {
  try {
    const userId = req.user ? req.user._id : null;
    const guestSessionId = req.headers['x-guest-session-id'];

    if (!userId && !guestSessionId) {
      return res.json({
        success: true,
        cart: await calculateCartSummary(null),
      });
    }

    const query = userId ? { user: userId } : { guestSessionId };
    let cart = await Cart.findOne(query);

    if (!cart) {
      cart = await Cart.create(query);
    }

    const summary = await calculateCartSummary(cart);
    return res.json({ success: true, cart: summary });
  } catch (error) {
    next(error);
  }
}

/**
 * Add product to cart
 */
export async function addToCart(req, res, next) {
  try {
    const { productId, size = 'Standard', color = '', quantity = 1 } = req.body;
    const qty = Math.max(1, parseInt(quantity, 10));

    const product = await Product.findById(productId);
    if (!product || !product.isActive) {
      return res.status(404).json({ success: false, message: 'Product not found or unavailable.' });
    }

    if (product.inventoryQuantity < qty) {
      return res.status(400).json({
        success: false,
        message: `Only ${product.inventoryQuantity} items available in stock.`,
      });
    }

    const userId = req.user ? req.user._id : null;
    const guestSessionId = req.headers['x-guest-session-id'] || `guest_${Date.now()}`;

    const query = userId ? { user: userId } : { guestSessionId };
    let cart = await Cart.findOne(query);

    if (!cart) {
      cart = new Cart(query);
    }

    // Check if variant already exists in cart
    const existingIndex = cart.items.findIndex(
      item =>
        item.product.toString() === productId &&
        item.size === size &&
        item.color === color
    );

    const unitPrice = product.discountedPriceInPaise || product.priceInPaise;

    if (existingIndex > -1) {
      const newQty = cart.items[existingIndex].quantity + qty;
      if (newQty > product.inventoryQuantity) {
        return res.status(400).json({
          success: false,
          message: `Cannot add more. Reached maximum available stock (${product.inventoryQuantity}).`,
        });
      }
      cart.items[existingIndex].quantity = newQty;
    } else {
      cart.items.push({
        product: product._id,
        size,
        color,
        quantity: qty,
        priceInPaiseAtAddition: unitPrice,
      });
    }

    await cart.save();
    const summary = await calculateCartSummary(cart);

    return res.json({
      success: true,
      message: `${product.name} added to your cart!`,
      cart: summary,
      guestSessionId: !userId ? guestSessionId : undefined,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Update quantity of a cart item
 */
export async function updateCartItem(req, res, next) {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;
    const qty = parseInt(quantity, 10);

    const userId = req.user ? req.user._id : null;
    const guestSessionId = req.headers['x-guest-session-id'];
    const query = userId ? { user: userId } : { guestSessionId };

    const cart = await Cart.findOne(query);
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found.' });
    }

    const itemIndex = cart.items.findIndex(item => item._id.toString() === itemId);
    if (itemIndex === -1) {
      return res.status(404).json({ success: false, message: 'Item not found in cart.' });
    }

    if (qty <= 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      const product = await Product.findById(cart.items[itemIndex].product);
      if (product && qty > product.inventoryQuantity) {
        return res.status(400).json({
          success: false,
          message: `Only ${product.inventoryQuantity} items available in stock.`,
        });
      }
      cart.items[itemIndex].quantity = qty;
    }

    await cart.save();
    const summary = await calculateCartSummary(cart);
    return res.json({ success: true, cart: summary });
  } catch (error) {
    next(error);
  }
}

/**
 * Remove an item from cart
 */
export async function removeCartItem(req, res, next) {
  try {
    const { itemId } = req.params;
    const userId = req.user ? req.user._id : null;
    const guestSessionId = req.headers['x-guest-session-id'];
    const query = userId ? { user: userId } : { guestSessionId };

    const cart = await Cart.findOne(query);
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found.' });
    }

    cart.items = cart.items.filter(item => item._id.toString() !== itemId);
    await cart.save();

    const summary = await calculateCartSummary(cart);
    return res.json({ success: true, message: 'Item removed from cart.', cart: summary });
  } catch (error) {
    next(error);
  }
}

/**
 * Merge guest cart items into authenticated user cart
 */
export async function mergeGuestCart(req, res, next) {
  try {
    const { guestSessionId } = req.body;
    if (!guestSessionId || !req.user) {
      return res.json({ success: true });
    }

    const guestCart = await Cart.findOne({ guestSessionId });
    if (!guestCart || guestCart.items.length === 0) {
      return res.json({ success: true });
    }

    let userCart = await Cart.findOne({ user: req.user._id });
    if (!userCart) {
      userCart = new Cart({ user: req.user._id, items: [] });
    }

    for (const gItem of guestCart.items) {
      const matchIndex = userCart.items.findIndex(
        uItem =>
          uItem.product.toString() === gItem.product.toString() &&
          uItem.size === gItem.size &&
          uItem.color === gItem.color
      );

      if (matchIndex > -1) {
        userCart.items[matchIndex].quantity += gItem.quantity;
      } else {
        userCart.items.push(gItem);
      }
    }

    await userCart.save();
    await Cart.deleteOne({ _id: guestCart._id });

    const summary = await calculateCartSummary(userCart);
    return res.json({ success: true, cart: summary });
  } catch (error) {
    next(error);
  }
}
