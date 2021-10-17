import express from 'express';
import bodyParser from 'body-parser';
import { filterImageFromURL, deleteLocalFiles } from './util/util';

(async () => {

  //Images to delete after were sent
  const imagesDelete: string[] = []

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  app.get("/filteredimage", async (req: express.Request, res: express.Response) => {
    try {
      const url: string = req.query.image_url

      if (url) {
        const image: string = await filterImageFromURL(url)
        const split: string[] = image.split('/')
        const imageName: string = split[split.length - 1]
        const urlImageDelete: string = `${__dirname}/util/tmp/${imageName}`
        if (imagesDelete.length) {
          await deleteLocalFiles(imagesDelete)
        }
        imagesDelete.push(urlImageDelete)
        res.sendFile(image);
      }
      else {
        res.status(400).send('No image specified.')
      }
    } catch (error) {
      console.error(error);
      res.send("Server error").sendStatus(500)
    }
  })

  // Root Endpoint
  // Displays a simple message to the user
  app.get("/", async (req: express.Request, res: express.Response) => {
    res.send("try GET /filteredimage?image_url={{}}")
  });

  // Start the Server
  app.listen(port, () => {
    console.log(`server running http://localhost:${port}`);
    console.log(`press CTRL+C to stop server`);
  });
})();