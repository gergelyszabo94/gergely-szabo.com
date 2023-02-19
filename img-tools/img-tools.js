import sharp from 'sharp';
import fs from 'fs';
import { promisify } from 'util';
import convert from 'heic-convert';

const resizeImage = async (path, resizedPath, width, height) => {
  try {
    await sharp(path)
      .resize({
        width,
        height,
      })
      .toFile(resizedPath);
  } catch (error) {
    console.log(error);
  }
};

const pngToJPG = async (path, convertedPath) => {
  try {
    await sharp(path)
      .toFormat("jpeg", { mozjpeg: true })
      .toFile(convertedPath);
  } catch (error) {
    console.log(error);
  }
};

const galleryConvert = () => {
  fs.readdirSync('in/').forEach(file => {
    const filePath = `in/${file}`
    const splitFileName = file.split('.');
    const name = splitFileName[0];
    const extension = splitFileName[1];

    if (extension === 'heic' || extension === 'heif') {
      console.log(file);

      (async () => {
        const inputBuffer = await promisify(fs.readFile)(filePath);
        const outputBuffer = await convert({
          buffer: inputBuffer, // the HEIC file buffer
          format: 'JPEG',      // output format
          quality: 1           // the jpeg compression quality, between 0 and 1
        });

        await promisify(fs.writeFile)(`out/${name}.jpg`, outputBuffer);
      })();
    }
  });
};

const galleryResize = () => {
  fs.readdirSync('in/').forEach(file => {
    console.log(file);

    const filePath = `in/${file}`
    const splitFileName = file.split('.');
    const name = splitFileName[0];
    const extension = splitFileName[1];

    sharp(filePath).metadata().then((metaData) => {
      resizeImage(filePath, `out/${name}_smallplaceholder.${extension}`, 400, 300);
      resizeImage(filePath, `out/${file}`, 800, 600);
      resizeImage(filePath, `out/${name}_large.${extension}`, metaData.width, metaData.height);
    });
  });
};

// create "in" and "out" directories for source and destination
// only run one of these at once
//galleryResize();
galleryConvert();