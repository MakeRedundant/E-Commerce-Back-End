const router = require("express").Router();
const { Product, Category, Tag, ProductTag } = require("../../models");

// The `/api/products` endpoint

// Get all products
//Defines a API endpoint using router.get method to handle the GET all products
router.get("/", (req, res) => {
  // find all products
  Product.findAll({
    //use product.finalALL() to retrieve all products from the db
    attributes: [
      //this is the attirbutes we want to retrieve
      "id",
      "product_name",
      "price",
      "stock",
      "category_id",
    ],
    // included its associated Category and Tag data
    include: [
      {
        model: Category,
        attributes: ["category_name"],
      },
      {
        model: Tag,
        attributes: ["tag_name"],
        through: ProductTag,
        as: "tagIds",
      },
    ],
  }) //then() callback sends the retrieved product data back to the client as a JSON
    .then((productData) => res.json(productData))
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

// Gets one product
router.get("/:id", (req, res) => {
  // find a single product by its `id`
  Product.findOne({
    where: {
      id: req.params.id,
    },
    attributes: ["id", "product_name", "price", "stock", "category_id"],
    // be sure to include its associated Category and Tag data
    include: [
      {
        model: Category,
        attributes: ["category_name"],
      },
      {
        model: Tag,
        attributes: ["tag_name"],
        through: ProductTag,
        as: "tagIds",
      },
    ],
  })
    .then((productData) => {
      if (!productData) {
        res
          .status(404)
          .json({ message: "Unsuccessful, No product found with that id" });
        return;
      }
      res.json(productData);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

// Create new product
router.post("/", (req, res) => {
  /* req.body should look like this...
    {
      product_name: "Basketball",
      price: 200.00,
      stock: 3,
      tagIds: [1, 2, 3, 4]
    }
  */
  Product.create(req.body)
    .then((product) => {
      // if there's product tags, we need to create pairings to bulk create in the ProductTag model
      if (req.body.tagIds.length) {
        const productTagIdArr = req.body.tagIds.map((tag_id) => {
          return {
            product_id: product.id,
            tag_id,
          };
        });
        return ProductTag.bulkCreate(productTagIdArr);
      }
      // if no product tags, just respond
      res.status(200).json(product);
    })
    .then((productTagIds) => res.status(200).json(productTagIds))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

// Update product
router.put("/:id", (req, res) => {
  // update product data
  Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((product) => {
      if (req.body.tagIds && req.body.tagIds.length) {
        ProductTag.findAll({
          where: { product_id: req.params.id },
        }).then((productTags) => {
          // create filtered list of new tag_ids
          const productTagIds = productTags.map(({ tag_id }) => tag_id);
          const newProductTags = req.body.tagIds
            .filter((tag_id) => !productTagIds.includes(tag_id))
            .map((tag_id) => {
              return {
                product_id: req.params.id,
                tag_id,
              };
            });

          // figure out which ones to remove
          const productTagsToRemove = productTags
            .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
            .map(({ id }) => id);
          // run both actions
          return Promise.all([
            ProductTag.destroy({ where: { id: productTagsToRemove } }),
            ProductTag.bulkCreate(newProductTags),
          ]);
        });
      }

      return res.json(product);
    })
    .catch((err) => {
      // console.log(err);
      res.status(400).json(err);
    });
});

router.delete("/:id", (req, res) => {
  // Deletes one product by its `id` value
  Product.destroy({
    where: {
      id: req.params.id,
    },
  })
    // send back in JSON and see if product matches id
    .then((deleteProductData) => {
      // Check if a product was successfully deleted
      if (!deleteProductData) {
        // If no product was deleted (false), send a 404 status with a message
        res
          .status(404)
          .json({ message: "Unsuccesful, No products found with this id!!" });
        return;
      }
      // If a product was deleted (true), send back the deleted product data in JSON
      res.json(deleteProductData);
    })
    // If there is an error during the deletion process, catch it and send a response
    .catch((err) => {
      console.log(err);
      res.status(500).json(err); // 500 is an internal server error
    });
});

module.exports = router;

// In summary, this module defines a set of routes that allow you to interact with product data stored in your database.
// It handles various operations such as retrieving all products, retrieving a single product, creating new products, updating existing products, and deleting products.
// The module leverages Sequelize models and associations to manage the relationships between products, categories, and tags
