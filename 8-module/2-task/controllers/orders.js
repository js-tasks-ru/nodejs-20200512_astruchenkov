const Order = require('../models/Order');
const sendMail = require('../libs/sendMail');

module.exports.checkout = async function checkout(ctx, next) {
  if (ctx.user) {
    try {
      const order = await Order.create({
        ...ctx.request.body,
        user: ctx.user._id,
      });
      await order.populate('product');
      await sendMail({
        template: 'order-confirmation',
        locals: {id: order._id, product: order.product},
        to: ctx.user.email,
        subject: 'Заказ',
      });
      ctx.status =200;
      ctx.body = {order: order._id};
    } catch (e) {
      throw e;
    }
  } else {
    ctx.status = 401;
    ctx.body= {error: 'пользователь не авторизован'};
  }
};

module.exports.getOrdersList = async function ordersList(ctx, next) {
  if (!ctx.user) {
    ctx.status = 401;
    ctx.body= {error: 'пользователь не авторизован'};
    return;
  }
  try {
    const orderList = await Order.find({user: ctx.user._id});
    if (orderList) {
      ctx.status = 200;
      ctx.body = {orders: orderList};
    }
  } catch (e) {
    throw (e);
  }
};
