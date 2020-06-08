const Products = require('../models/Product');

function productMap(product) {
  return {
    id: product._id,
    title: product.title,
    images: product.images,
    category: product.category,
    subcategory: product.subcategory,
    price: product.price,
    description: product.description,
  };
}

module.exports.productsByQuery = async function productsByQuery(ctx, next) {
  const query = ctx.request.query.query;
  let products = [];
  if (query) {
      products = await Products.find({$text: {$search: query}});
      if (products) {
        products = products.map(productMap);
      }
  }
  ctx.body = {products: products};
};
