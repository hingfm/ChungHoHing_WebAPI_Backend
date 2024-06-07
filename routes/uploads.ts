import Router, {RouterContext} from "koa-router";
import koaBody from "koa-body";
import mime from "mime-types";
import { copyFileSync, existsSync, createReadStream, readFileSync } from "fs";
import { v4 as uuidv4 } from 'uuid';
import * as tf from '@tensorflow/tfjs-node';
import csv from 'csv-parser';
import fs from 'fs';

const upload_options= {
    multipart: true,
    formidable: { uploadDir: './img' }
};

const koaBodyM = koaBody(upload_options);
const fileStore:string= './img';
const router:Router = new Router({ prefix:'/api/v1'});
const modelPath = './tensorflow_model';
const labelsPath = './tensorflow_model/petbreed_labels.csv';
let labels: string[] = [];
let model: any ;

// Initialize labels and model
async function init() {
  labels = await loadLabels(labelsPath);
  model = await loadModel();
}

function loadLabels(filePath: string): Promise<string[]> {
  return new Promise((resolve, reject) => {
      const tempLabels: string[] = [];
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (data) => tempLabels.push(data.label))
        .on('end', () => {
          resolve(tempLabels);
        })
        .on('error', (error) => reject(error));
  });
}

async function loadModel() {
  if (!model) {
        model = await tf.node.loadSavedModel(modelPath);
  }
  return model;
}

async function classifyImage(imagePath: string) {
  await loadModel();
  const imageBuffer = readFileSync(imagePath);
  const decodedImage = tf.node.decodeImage(imageBuffer, 3); // Ensure this is a 3-channel (RGB) image
  const resizedImage = tf.image.resizeBilinear(decodedImage, [300, 300]); // Resize to the expected dimensions
  const normalizedImage = resizedImage.div(tf.scalar(255)); // Normalize pixel values
  const batchedImage = normalizedImage.expandDims(0); // Add the batch dimension

  if (!model) {
      throw new Error("Model not loaded");
  }

  const prediction = await model.predict(batchedImage);
  const predictionArray = await prediction.array();

  const highestIndex = predictionArray[0].indexOf(Math.max(...predictionArray[0]));
  const highestLabel = labels[highestIndex];

  return highestLabel;
}

router.post('/images', koaBodyM, async (ctx: RouterContext) => {
  try {
      const upload = ctx.request.files?.upload;
      let path: string | undefined;
      let name: string | undefined;
      let type: string | undefined;

      if (Array.isArray(upload)) {
          path = upload[0]?.filepath;
          name = upload[0]?.newFilename;
          type = upload[0]?.mimetype || '';
      } else {
          path = upload?.filepath;
          name = upload?.newFilename;
          type = upload?.mimetype || '';
      }

      if (!path) {
          throw new Error('No file uploaded.');
      }

      const imageName = uuidv4();
      const newPath = `${fileStore}/${imageName}`;
      copyFileSync(path, newPath);

      const predictedLabel = await classifyImage(newPath);

      console.log('Uploaded file details:', { path, name, type, predictedLabel });
      ctx.status = 201;
      ctx.body = {
          filename: name,
          type: type,
          predictedLabel,
          links: {
              path: `http://${ctx.host}${router.url('get_image', imageName)}`
          }
      };
  } catch (err: any) {
      console.error(`Error during file upload or classification: ${err.message}`);
      ctx.throw(500, 'Upload or classification error', { message: err.message });
  }
});

router.get('get_image', '/images/:uuid([0-9a-f\\-]{36})', async (ctx: RouterContext) => {
  const uuid = ctx.params.uuid;
  const path = `${fileStore}/${uuid}`;
  console.log('Client requested image with path:', path);
  try {
      if (existsSync(path)) {
          console.log('Image found');
          const src = createReadStream(path);
          ctx.type = 'image/jpeg';
          ctx.body = src;
          ctx.status = 200;
      } else {
          console.log('Image not found');
          ctx.status = 404;
      }
  } catch (err: any) {
      console.error(`Error serving image: ${err.message}`);
      ctx.throw(500, 'Image download error', { message: err.message });
  }
});

// Start the server with initialized data
init().then(() => {
  console.log('Labels and model loaded');
}).catch((error) => {
  console.error('Failed to initialize:', error);
});

export {router};

