const express = require("express");
const MongoClient = require("mongodb").MongoClient;
const cors = require("cors");
const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const app = express();
app.use(cors());
app.use(express.json());
const port = 4000;

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Node JS API Project for mongodb",
            version: "1.0.0",
        },
        servers: [
            {
                url: `http://localhost:${port}/`,
            },
        ],
    },
    apis: ["./mongodb.js"],
};
const swaggerSpec = swaggerJSDoc(options);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @swagger
 * /:
 *  get:
 *      summary: This api is used to check if get method is working or not
 *      description: This api is used to check if get method is working or not
 *      responses:
 *          200:
 *              description: To test GET method
 */

// eslint-disable-next-line no-unused-vars
var database = null;

app.get("/", (req, res) => {
    res.send("mongodb");
});

/**
 * @swagger
 *  components:
 *      schemas:
 *          Book:
 *              type: object
 *              properties:
 *                  id:
 *                      type: number
 *                  name:
 *                      type: string
 */

/**
 * @swagger
 * /api/books:
 *  get:
 *      summary: To get all books from mongodb
 *      description: This API is used to fetch data from mongodb
 *      responses:
 *          200:
 *              description: This API is used to fetch data from mongodb
 *              content:
 *                      application/json:
 *                          schema:
 *                              type: array
 *                              items:
 *                                  $ref: '#components/schemas/Book'
 */

app.get("/api/books", (req, res) => {
    database
        .collection("books")
        .find({})
        .project({
            _id: 1,
            id: 1,
            name: 1,
        })
        .toArray((error, result) => {
            if (error) throw error;
            res.send({
                total: result.length,
                result: result,
            });
            // console.log(result);
            // res.send(result);
        });
});

/**
 * @swagger
 * /api/books/{id}:
 *  get:
 *      summary: To get all books from mongodb
 *      description: This API is used to fetch data from mongodb
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            description: Numeric ID required
 *            schema:
 *              type: integer
 *      responses:
 *          200:
 *              description: This API is used to fetch data from mongodb
 *              content:
 *                      application/json:
 *                          schema:
 *                              type: array
 *                              items:
 *                                  $ref: '#components/schemas/Book'
 */

app.get("/api/books/:id", (req, res) => {
    let query = { id: Number(req.params.id) };
    database.collection("books").findOne(query, (error, result) => {
        if (error) throw error;
        if (result) {
            res.send({ result });
        } else {
            res.status(304).send("ID not found");
        }
    });
});

/**
 * @swagger
 * /api/books/{id}:
 *  put:
 *      summary: used to update into mongoDB
 *      description: This API is used to fetch data from mongodb
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            description: Numeric ID required
 *            schema:
 *              type: integer
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#components/schemas/Book'
 *      responses:
 *          200:
 *              description: Updated sucessfully!!
 */

app.put("/api/books/:id", (req, res) => {
    let book = {
        id: Number(req.params.id),
        name: req.body.name,
    };
    database.collection("books").updateOne(
        { id: Number(req.params.id) },
        {
            $set: book,
        },
        (error, result) => {
            if (error) throw error;
            console.log("dfdsfsdfdf ::", result);
            if (result.matchedCount === 1) {
                res.send(book);
            } else {
                res.status(304).send("ID not found");
            }
        }
    );
});

/**
 * @swagger
 * /api/books/{id}:
 *  delete:
 *      summary: To delete book from mongodb
 *      description: This API is used to fetch data from mongodb
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            description: Numeric ID required
 *            schema:
 *              type: integer
 *      responses:
 *          200:
 *              description: This API is used to delete data from mongodb
 */

app.delete("/api/books/:id", (req, res) => {
    let query = { id: Number(req.params.id) };
    database.collection("books").deleteOne(query, (error, result) => {
        if (error) throw error;
        console.log(result);
        if (result.deletedCount === 1) {
            res.send({ result: "Book deleted !!" });
        } else {
            res.status(304).send("ID not found");
        }
    });
});

/**
 * @swagger
 * /api/books/addBook:
 *  post:
 *      summary: used to insert into mongoDB
 *      description: This API is used to fetch data from mongodb
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#components/schemas/Book'
 *      responses:
 *          200:
 *              description: Added sucessfully!!
 */

app.post("/api/books/addBook", async (req, res) => {
    console.log("herere");
    let response = await database
        .collection("books")
        .find({})
        .sort({ id: -1 })
        .limit(1)
        .toArray();
    response.forEach((element) => {
        if (element) {
            let book = {
                id: element.id + 1,
                name: req.body.name,
            };
            database.collection("books").insertOne(book, (err, result) => {
                if (err) throw res.status(500).send(err);
                res.send("Added Successfully !!");
            });
        }
    });
});

app.listen(port, () => {
    MongoClient.connect(
        "mongodb://localhost:27017",
        { useNewUrlParser: true },
        (error, result) => {
            if (error) throw error;
            // console.log(database);
            database = result.db("mydatabase");
            // console.log(database);
            console.log("connection successful!!! at " + port);
        }
    );
});
