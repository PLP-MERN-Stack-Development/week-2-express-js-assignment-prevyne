const express = require('express');
const bodyParser = require('body-parser');

const mongoose= require('mongoose');
const app = express();
const PORT = 3000;
const mongoUri = "mongodb+srv://Prevyne:Justcause2@cluster0.akx03ss.mongodb.net/";

app.use(bodyParser.json());

mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log(`Connected to MongoDB`))
  .catch(err => console.error(`MongoDB conection error: `, err));
;

const productSchema = new mongoose.Schema({
  id: {
        type: Number,
        unique: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: false,
        trim: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    category: {
        type: String,
        required: true,
        trim: true
    },
    inStock: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

//Sample in-memory products database
let products = [
  {
    id: '1',
    name: 'Laptop',
    description: 'High-performance laptop with 16GB RAM',
    price: 1200,
    category: 'electronics',
    inStock: true
  },
  {
    id: '2',
    name: 'Smartphone',
    description: 'Latest model with 128GB storage',
    price: 800,
    category: 'electronics',
    inStock: true
  },
  {
    id: '3',
    name: 'Coffee Maker',
    description: 'Programmable coffee maker with timer',
    price: 50,
    category: 'kitchen',
    inStock: false
  }
];

//Pre-save hook to generate unique numerical ID without a separate counter model
productSchema.pre('save', async function(next) {
  if(this.isNew && ! this.id) {
    try {
    const lastProduct = await productSchema.findOne().sort({id: -1}).limit(1);
    this.id = (lastProduct && lastProduct.id) ? lastProduct.id + 1: 1;
  } catch (error) {
    return next(new Error('Failed to generate unique product ID: ' + error.message));
  }
}
  this.updatedAt = Date.now();
  next();
});

// --- Pre-findOneAndUpdate hook to update 'updatedAt' ---
productSchema.pre('findOneAndUpdate', function(next) {
    this.set({ updatedAt: Date.now() });
    next();
});

const Product = mongoose.model('Product', productSchema);

// GET all products with filtering by category and pagination
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};
app.get('/products', asyncHandler(async (req, res) => {
    const queryObj = {};

    // 1. Filtering by category
    if (req.query.category) {
        queryObj.category = req.query.category;
    }

    // Base query
    let query = Product.find(queryObj);

    // 2. Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    query = query.skip(skip).limit(limit);

    const totalProducts = await Product.countDocuments(queryObj);
    const products = await query;

    res.status(200).json({
        status: 'success',
        results: products.length,
        pagination: {
            currentPage: page,
            limit: limit,
            totalPages: Math.ceil(totalProducts / limit),
            totalProducts: totalProducts
        },
        data: {
            products
        }
    });
}));

// ---Routes---
app.get('/', (req, res) => {
    res.send('Hello again world!');
});

//Create a new product
app.post('/products', async (req, res) => {
    try {
        const newProduct = new Product(req.body);
        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
    } catch (error) {
        console.error("Error creating product:", error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: "Validation error", errors: error.errors });
        }
        // Handle the custom error from the pre-save hook
        if (error.message.includes('Failed to generate unique product ID')) {
            return res.status(500).json({ message: error.message });
        }
        res.status(500).json({ message: "Failed to create product", error: error.message });
    }
});


//List all products
app.get('/products', async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ message: "Failed to retrieve products", error: error.message });
    }
});

//Get a specific product by ID
app.get('/products/:id', async (req, res) => {
    try {
        const productId = parseInt(req.params.id, 10);
        if (isNaN(productId)) {
            return res.status(400).json({ message: "Invalid product ID format. Must be a number." });
        }

        const product = await Product.findOne({ id: productId });

        if (!product) {
            return res.status(404).json({ message: "Product not found." });
        }
        res.status(200).json(product);
    } catch (error) {
        console.error(`Error fetching product with ID ${req.params.id}:`, error);
        res.status(500).json({ message: "Failed to retrieve product", error: error.message });
    }
});

// PUT (Update) an existing product by its custom numerical 'id'
app.put('/products/:id', async (req, res) => {
    try {
        const productId = parseInt(req.params.id, 10);
        if (isNaN(productId)) {
            return res.status(400).json({ message: "Invalid product ID format. Must be a number." });
        }

        const updatedProduct = await Product.findOneAndUpdate(
            { id: productId },
            { ...req.body },
            { new: true, runValidators: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({ message: "Product not found." });
        }
        res.status(200).json(updatedProduct);
    } catch (error) {
        console.error(`Error updating product with ID ${req.params.id}:`, error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: "Validation error", errors: error.errors });
        }
        res.status(500).json({ message: "Failed to update product", error: error.message });
    }
});

// DELETE a product by its custom numerical 'id'
app.delete('/products/:id', async (req, res) => {
    try {
        const productId = parseInt(req.params.id, 10);
        if (isNaN(productId)) {
            return res.status(400).json({ message: "Invalid product ID format. Must be a number." });
        }

        const deletedProduct = await Product.findOneAndDelete({ id: productId });

        if (!deletedProduct) {
            return res.status(404).json({ message: "Product not found." });
        }
        res.status(200).json({ message: "Product deleted successfully.", deletedProduct });
    } catch (error) {
        console.error(`Error deleting product with ID ${req.params.id}:`, error);
        res.status(500).json({ message: "Failed to delete product", error: error.message });
    }
});


// ---Global Error Handling Middleware---
app.use(((req, res, next, error) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    // Development error response (more details for debugging)
    if (process.env.NODE_ENV === 'development') {
        console.error('ERROR 💥', err); // Log the full error for developers
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
            error: err,
            stack: err.stack,
            validationErrors: err.validationErrors // Include detailed validation errors if present
        });
    } else {
        // Production error response (less details for security)
        if (err.isOperational) {
            // Operational, trusted error: send message to client
            res.status(err.statusCode).json({
                status: err.status,
                message: err.message
            });
        } else {
            // Programming or other unknown error: don't leak details
            console.error('ERROR 💥', err); // Log for server-side debugging
            res.status(500).json({
                status: 'error',
                message: 'Something went very wrong!'
            });
        }
    }

    // Handle specific Mongoose errors
    if (err.name === 'ValidationError' && err.errors) {
        // Mongoose validation errors often have an 'errors' object with details
        const errors = Object.values(err.errors).map(el => el.message);
        return res.status(400).json({
            status: 'fail',
            message: `Invalid input data. ${errors.join('. ')}`,
            errors: errors
        });
    }

    // Handle duplicate key errors (e.g., trying to create a product with an existing 'id')
    if (err.code === 11000) { // MongoDB duplicate key error code
        const value = err.message.match(/(["'])(\\?.)*?\1/)[0]; // Extract the duplicate value
        return res.status(400).json({
            status: 'fail',
            message: `Duplicate field value: ${value}. Please use another value!`,
        });
    }

    // Handle CastError (e.g., invalid ObjectId if we were using it for primary ID)
    if (err.name === 'CastError') {
        return res.status(400).json({
            status: 'fail',
            message: `Invalid ${err.path}: ${err.value}.`
        });
    }
}));

// --- Server Listener ---
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log('API Endpoints:');
    console.log(`  GET /products`);
    console.log(`  GET /products/:id`);
    console.log(`  POST /products`);
    console.log(`  PUT /products/:id`);
    console.log(`  DELETE /products/:id`);
});

//Fire up the server
 app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
 });

 //Export the app for testing purposes
 module.exports = app;