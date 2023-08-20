const router = require("express").Router();
const { Tag, Product, ProductTag } = require("../../models");

// The `/api/tags` endpoint

router.get("/", (req, res) => {
  // Finds all tags
  Tag.findAll({
    attributes: ["id", "tag_name"], //specifies which attributes of the tag data should be included in the result.
    // Included associated Product data
    include: [
      {
        model: Product,
        attributes: ["id", "product_name", "price", "stock", "category_id"],
        through: ProductTag, //This specifies that you're also including the ProductTag model to establish the many-to-many relationship between tags and products.
        as: "tagIds",
      },
    ],
  })
    .then((tagData) => res.json(tagData))
    .catch((err) => {
      console.log(err);
      res.status(500).json(err); // If an error occurs, respond with a 500 status and the error message in JSON format
    });
});

router.get("/:id", (req, res) => {
  // Finds a single tag by its `id`
  Tag.findOne({
    where: {
      // Use the value from the request parameter to find a tag with matching id
      id: req.params.id,
    },
    attributes: ["id", "tag_name"],
    // Included its associated Product data
    include: [
      {
        model: Product,
        attributes: ["id", "product_name", "price", "stock", "category_id"],
        through: ProductTag,
        as: "tagIds",
      },
    ],
  })
    .then((tagData) => {
      // Check if a tag matched the id
      if (!tagData) {
        // If no matching tag is found, respond with a 404 status and a message
        res
          .status(404)
          .json({ message: "Unsuccessful, No tag found with this id" });
        return;
      }
      // If a matching tag is found, respond with the tag data in JSON format
      res.json(tagData);
    })
    // If there's an error, catch it and send a response
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.post("/", (req, res) => {
  // create a new tag
  Tag.create(req.body) //Tag model's create method to insert a new tag into the databse. The req.body contains the data sent
    .then((createTagData) => res.json(createTagData)) //when you send data over the HTTP protocol it needs to be formated in a way the recipient can understand (JSON)
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

// So to summarise the code, it defines a HTTPs request for a post route using the .create method to create new tags into the db.
//  A promise is created where the createTagdata is made and parsed into json and if there is a error it will be caught and logged alonside
//  a 400 error code and the error in json

router.put("/:id", (req, res) => {
  // update a tag's name by its `id` value
  Tag.update(req.body, {
    //If no rows were affected (meaning no tag was found with the given id), it means that updateTagData would be falsy,
    where: {
      //Where option provided by Sequelize
      id: req.params.id,
    },
  })
    .then((updateTagData) => {
      if (!updateTagData) {
        res
          .status(404)
          .json({ message: "Unsuccesful, No tag found with this id!" });
        return;
      }
      res.json(updateTagData);
    })
    .catch((err) => {
      //if any error that occurs during the update operation gets caught in the catch block, logs the error
      console.log(err);
      res.status(500).json(err);
    });
});

//The code defines an HTTP request for a PUT route using the .update method from Sequelize to update a tag in the database.
//  The where option is used to specify that only records with a matching id should be updated.
//  A promise is created to handle the outcome of the update operation. If no record with the specified id is found,
//  a 404 error along with a message is returned. If the update is successful, the updated tag data is returned as JSON.
//  f any error occurs during the operation, it's caught and a 500 error is returned along with the error details in JSON

router.delete("/:id", (req, res) => {
  // Deletes on tag by its `id` value
  Tag.destroy({
    where: {
      id: req.params.id,
    },
  })
    .then((dbTagData) => {
      if (!dbTagData) {
        res
          .status(404)
          .json({ message: "Unsuccessful, No tag found with this id!" });
        return;
      }
      res.json(dbTagData);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

// The code defines an HTTP request for a DELETE route using the .destroy method from Sequelize to delete a tag from the database.
// The where option is used to specify that only records with a matching id should be deleted.
//  A promise is created to handle the outcome of the deletion operation. If no record with the specified id is found,
//  a 404 error along with a message is returned. If the deletion is successful, the deleted tag data is returned as JSON.
//  If any error occurs during the operation, it's caught and a 500 error is returned along with the error details in JSON.

module.exports = router;
