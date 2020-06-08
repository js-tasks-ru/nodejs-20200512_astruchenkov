// const Category = require('../models/Category');
const Product = require('../models/Product');


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

module.exports.productsBySubcategory = async function productsBySubcategory(ctx, next) {
  const subcategoryId= ctx.request.query.subcategory;
  let products = [];
  if (subcategoryId) {
    try {
      products = await Product.find({subcategory: subcategoryId}).populate();
    } catch (err) {
      if (err.name ==='CastError') {
        ctx.status = 400;
        ctx.body = 'categoryId is invalid';
      } else {
        throw err;
      }
    }
  } else {
    products = await Product.find().populate();
  }
  ctx.body = {products: products.map(productMap) || []};
  next();
};

module.exports.productList = async function productList(ctx, next) {
  const products = await Product.find().populate();
  ctx.body = {products: products.map(productMap)};
};

module.exports.productById = async function productById(ctx, next) {
  const productId = ctx.params.id;
  try {
    const product = await Product.findById(productId).populate();
    if (!product) {
      ctx.status = 404;
      ctx.body = {message: 'Product not found'};
      next();
      return;
    }

    ctx.body = {
      product: [product].map(productMap)[0],
    };
  } catch (err) {
    if (err.name ==='CastError') {
      ctx.status = 400;
      ctx.body = 'categoryId is invalid';
    } else {
      throw err;
    }
  }
};

