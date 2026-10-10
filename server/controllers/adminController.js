import { Order } from '../models/Order.js';
import { Product } from '../models/Product.js';
import { User } from '../models/User.js';
import { AuditLog } from '../models/AuditLog.js';

/**
 * Admin Dashboard Overview Metrics
 */
export async function getDashboardStats(req, res, next) {
  try {
    const [
      totalOrders,
      paidOrders,
      pendingFulfillments,
      totalCustomers,
      lowStockProducts,
    ] = await Promise.all([
      Order.countDocuments(),
      Order.find({ status: { $in: ['paid', 'processing', 'shipped', 'delivered'] } }),
      Order.countDocuments({ status: { $in: ['paid', 'processing'] } }),
      User.countDocuments({ role: 'customer' }),
      Product.countDocuments({ inventoryQuantity: { $lte: 5 }, isActive: true }),
    ]);

    const totalRevenueInPaise = paidOrders.reduce((sum, o) => sum + o.totalAmountInPaise, 0);

    return res.json({
      success: true,
      stats: {
        totalRevenueINR: totalRevenueInPaise / 100,
        totalOrders,
        paidOrdersCount: paidOrders.length,
        pendingFulfillments,
        totalCustomers,
        lowStockCount: lowStockProducts,
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * List all customer orders with filtering, sorting, and pagination
 */
export async function getAllOrders(req, res, next) {
  try {
    const { status, search, page = 1, limit = 20 } = req.query;
    const query = {};

    if (status && status !== 'all') {
      query.status = status;
    }

    if (search && search.trim()) {
      query.$or = [
        { orderNumber: { $regex: search.trim(), $options: 'i' } },
        { 'shippingAddress.recipientName': { $regex: search.trim(), $options: 'i' } },
        { 'shippingAddress.phone': { $regex: search.trim(), $options: 'i' } },
      ];
    }

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    const [orders, total] = await Promise.all([
      Order.find(query)
        .populate('user', 'name email phone')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Order.countDocuments(query),
    ]);

    const formattedOrders = orders.map(o => ({
      ...o,
      totalAmountINR: o.totalAmountInPaise / 100,
      subtotalINR: o.subtotalInPaise / 100,
      shippingINR: o.shippingChargeInPaise / 100,
    }));

    return res.json({
      success: true,
      orders: formattedOrders,
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
 * Update order status and fulfillment tracking
 */
export async function updateOrderStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status, trackingNumber, courierName } = req.body;

    const validStatuses = [
      'pending_payment',
      'paid',
      'processing',
      'shipped',
      'delivered',
      'cancelled',
      'refund_pending',
      'refunded',
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid order status transition.' });
    }

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    const oldStatus = order.status;
    order.status = status;

    if (trackingNumber !== undefined) order.trackingNumber = trackingNumber;
    if (courierName !== undefined) order.courierName = courierName;

    await order.save();

    // Record audit log
    await AuditLog.create({
      action: 'UPDATE_ORDER_STATUS',
      performedBy: req.user._id,
      performedByName: req.user.name,
      targetType: 'Order',
      targetId: order._id.toString(),
      details: {
        orderNumber: order.orderNumber,
        oldStatus,
        newStatus: status,
        trackingNumber,
      },
    });

    return res.json({
      success: true,
      message: `Order status updated to ${status}.`,
      order,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Retrieve recent administrative audit logs
 */
export async function getAuditLogs(req, res, next) {
  try {
    const logs = await AuditLog.find()
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    return res.json({ success: true, logs });
  } catch (error) {
    next(error);
  }
}
