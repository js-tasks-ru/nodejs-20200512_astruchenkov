const Category = require('../models/Category');

function mapSubcategory(category) {
  return {
    id: category._id,
    title: category.title,
  };
}


function mapCategory(category) {
  return {
    id: category._id,
    subcategories: category.subcategories.map(mapSubcategory),
    title: category.title,
  };
}

module.exports.categoryList = async function categoryList(ctx, next) {
  const categories = await Category.find().populate();
  ctx.body = {categories: categories.map(mapCategory) || []};
};
