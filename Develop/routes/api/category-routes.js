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
        res
          .status(404)
          .json({ message: "Unsuccessful, No category found with this id" });
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

//Delete Category
router.delete("/:id", (req, res) => {
  //DELETE HTTP method is defined and  ':id specifies which category to delete based on unique ID,
  Category.destroy({
    //Category,destory method is called to delete a category and takes a object from the where property based on the id from req,params.id
    where: {
      id: req.params.id,
    },
  }) ////Promise handling with then method is used to handle the promise to return the category.destroy
    .then((deleteCategory) => {
      if (!deleteCategory) {
        res.status(404).json({
          message: "Unsuccessful, no category was found",
        });
        return;
      }
      res.json(deleteCategory); //if a error occurs during the deletion process/ something unexpected happened
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

// HTTP status codes
// Informational Codes (1xx):
// 100: Continue - The server has received the initial part of the request and is willing to proceed.
// 101: Switching Protocols - The server agrees to switch protocols as requested by the client.
// Successful Codes (2xx):
// 200: OK - The request was successful, and the server has returned the requested resource.
// 201: Created - The request was successful, and a new resource was created as a result.
// 204: No Content - The server successfully processed the request but does not need to return any content.
// Redirection Codes (3xx):
// 301: Moved Permanently - The requested resource has been permanently moved to a new location.
// 302: Found - The requested resource has been temporarily moved to a different location.
// 304: Not Modified - The client's cached version of the requested resource is still valid.
// Client Error Codes (4xx):
// 400: Bad Request - The server could not understand the request due to malformed syntax or invalid parameters.
// 401: Unauthorized - The client must authenticate itself to get the requested resource.
// 404: Not Found - The requested resource could not be found on the server.
// Server Error Codes (5xx):
// 500: Internal Server Error - The server encountered an unexpected condition that prevented it from fulfilling the request.
// 503: Service Unavailable - The server is temporarily unable to handle the request due to maintenance or overload.
