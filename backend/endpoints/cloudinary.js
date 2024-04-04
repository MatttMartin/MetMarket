const express = require("express");
const cors = require("cors");
const router = express.Router();
const pool = require("../db");
const bodyParser = require('body-parser')
router.use(bodyParser.json()); 
router.use(bodyParser.urlencoded({ extended: true })); 

var cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const opts = {
  overwrite: true,
  invalidate: true,
  resource_type: "auto",
};


const uploadImage = (image) => {
  //imgage = > base64
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(image, opts, (error, result) => {
      if (result && result.secure_url) {

        console.log(`coming from line 30: ${result.secure_url}`);
        return resolve(result.secure_url);
      }
      console.log(error.message);
      return reject({ message: error.message });
    });
  });
};
/*
module.exports = (image) => {
  //imgage = > base64
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(image, opts, (error, result) => {
      if (result && result.secure_url) {
        console.log(result.secure_url);
        return resolve(result.secure_url);
      }
      console.log(error.message);
      return reject({ message: error.message });
    });
  });
};
*/
const uploadMultipleImages = (images) => {
  return new Promise((resolve, reject) => {
    const uploads = images.map((base) => uploadImage(base));
    Promise.all(uploads)
      .then((values) => resolve(values))
      .catch((err) => reject(err));
  });
};


async function uploadImagesToDB(product_id, image_links) {
  try {
    console.log("got to here");
    

    const images = Array.isArray(image_links) ? image_links.map((link) => `(${product_id}, '${link}')`).join(', ') : `(${product_id}, '${image_links}')`;
    const query = `INSERT INTO images (product_id, image_link) VALUES ${images};`;

    const result = await pool.query(query);
    console.log("Images uploaded successfully:", result.rows);

    return result.rows;
  } catch (error) {
    console.error("Error uploading images:", error);
    throw error;
  }
}


async function updateImagesInDB(product_id, existing_images, new_images) {
  try {
    console.log("got to here");

    const imagesInDBQuery = `SELECT ARRAY_AGG(image_link) AS image_links FROM images WHERE product_id = ${product_id};`;
    const existing_images_in_DB = await pool.query(imagesInDBQuery);
    console.log(existing_images_in_DB);
    const deletedImages = existing_images_in_DB.rows[0].image_links.filter(item => existing_images.indexOf(item) === -1);

    if (deletedImages.length > 0) {
      const deleteQuery = `DELETE FROM images WHERE product_id = ${product_id} AND image_link IN (${deletedImages.map((image) => `'${image}'`).join(', ')});`;
      console.log(existing_images_in_DB);
      const deletionResult = await pool.query(deleteQuery);
      console.log("Images deleted successfully:", deletionResult.rows);
    }
    if (new_images.length > 0) {
      const images = new_images.map((link) => `(${product_id}, '${link}')`).join(', ');
      const query = `INSERT INTO images (product_id, image_link) VALUES ${images};`;

      const result = await pool.query(query);
      console.log("Images uploaded successfully:", result.rows);
        
      return result.rows;
    }
  } catch (error) {
    console.error("Error uploading images:", error);
    throw error;
  }
}

router.use(cors());
/*
router.post("/uploadImage", (req, res) => {
  
  uploadImage(req.body.image)
    .then((url) => {res.status(201).json({url: url}); console.log(`this is the url: ${url}`)})
    .catch((err) => res.status(500).send(err));
});
*/
router.post('/uploadImage', async (req, res) => {
  try {
      const fileStr = req.body.image;
      const product_id = req.body.product_id;
      const uploadResponse = await cloudinary.uploader.upload(fileStr);
      console.log(uploadResponse.secure_url);
      uploadImagesToDB(product_id, uploadResponse.secure_url);
      
      res.status(201).json({url: uploadResponse.secure_url});
  } catch (err) {
      console.error(err);
      res.status(500).json({ err: 'Something went wrong' });
  }
});


router.post("/uploadMultipleImages", (req, res) => {
    const product_id = req.body.product_id;
    const images = req.body.images;
    uploadMultipleImages(images)
    .then((urls) => {
      //console.log(urls);
      uploadImagesToDB(product_id, urls);
      res.status(201).json({status: "Success!"});
    })
    .catch((err) => res.status(500).send(err));
});

router.post("/updateImages", (req, res) => {
  const product_id = req.body.product_id;
  const existingImages = req.body.existing_images;
  const newImages = req.body.new_images;

  uploadMultipleImages(newImages)
  .then((urls) => {
    console.log("here in cloudinary.js line 150");
    updateImagesInDB(product_id, existingImages, urls);
    res.status(201).json({status: "Success!"});
  })
  .catch((err) => res.status(500).send(err));
});

module.exports = router;

