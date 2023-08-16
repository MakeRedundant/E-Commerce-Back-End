const router = require("express").Router();
const { Category, Product } = require("../../models");
// The `/api/categories` endpoint
//Defining an API endpoint

//Gets all the cateogries with their associated products
router.get("/", (req, res) => {
  // find all categories
  Category.findAll({
    attributes: ["id", "category_name"],
    include: [
      //include option to include associated data
      {
        model: Product,
        attributes: ["id", "product_name", "price", "stock", "category_id"],
      },
    ],
  })
    .then((categoryData) => res.json(categoryData))
    .catch((err) => {
      console.log(err);
      res.status(500).json(err); //means something went wrong on the server end and it coudnt handle the request properly.
    });
});

//Route handler retrives a single category by its id
router.get("/:id", (req, res) => {
  // find one category by its `id` value
  Category.findOne({
    where: {
      //Where option specifies the condition for the id column so it uses the req.params.id value to match category id
      id: req.params.id,
    },
    attributes: ["id", "category_name"],
    // be sure to include its associated Products
    include: [
      {
        model: Product,
        attributes: ["id", "product_name", "price", "stock", "category_id"],
      },
    ],
  }) //then method is used to handle resolved promise
    .then((categoryData) => {
      if (!categoryData) {
        //if no category is found than return 404
        res.status(404).json({ message: "No category found with this id" });
        return;
      }
      res.json(categoryData); //if a category is found than retrieve the data in JSON format
    })
    .catch((err) => {
      //if an error errors during the operation than .catch() is used to handle the error and log 500
      console.log(err);
      res.status(500).json(err);
    });
});

//This route handler creates a new category can use .bulkCreate for multiple
router.post("/", (req, res) => {
  // creates a new category
  Category.create(req.body)
    .then((newCategory) => {
      res.json(newCategory);
    })
    .catch((err) => {
      res.status(400).json(err); // 400 is bad requst (invalid data or clinet error)
    });
});

router.put("/:id", (req, res) => {
  // update a category by its `id` value
  Category.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((updatecategoryData) => {
      if (!updatecategoryData) {
        res
          .status(404)
          .json({ message: "Unsuccessful, No category found with this id" });
        return;
      }
      res.json(updatecategoryData);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.delete("/:id", (req, res) => {
  Category.destroy({
    where: {
      id: req.params.id,
    },
  })
    .then((deleteCategory) => {
      if (!deleteCategory) {
        res.status(404).json({
          message: "Unsuccessful, no category was found",
        });
        return;
      }
      res.json(deleteCategory);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});
module.exports = router;

// GET: "Get me information." This is used to ask the server for data. Like opening a book to read its content.

// POST: "Here's some new data, please save it." Used to send new information to the server. Like submitting a form with your details.

// PUT: "Update this existing data." Used to modify data that's already on the server. Like editing a text document and saving the changes.

// DELETE: "Remove this piece of data." Used to ask the server to remove something
