const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const axios = require("axios");
const fs = require('fs');
const path = require("path");

const app = express();
app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({extended:true}))

app.get('/getVideoFile', (req, res) => {
  const videoFilePath = path.join(__dirname, 'saved_video.mp4');
  if (fs.existsSync(videoFilePath)) {
    res.setHeader('Content-Type', 'video/mp4');
    const videoStream = fs.createReadStream(videoFilePath);
    videoStream.pipe(res);
  } else {
    res.status(404).send('Video file not found');
  }
});

app.post("/urlSubmit", async (req, res) => {
  const urlsend = req.body.url;
  console.log(urlsend);
  async function saveVideoFromURL(url, filename) {
    try {
      const response = await axios.get(url, { responseType: "stream" });
      const writer = fs.createWriteStream(filename);
      response.data.pipe(writer);
      return new Promise((resolve, reject) => {
        writer.on("finish", resolve);
        writer.on("error", reject);
      });
    } catch (error) {
      console.error("Error occurred while saving the video:", error);
    }
  }
  const options = {
    method: "GET",
    url: "https://instagram-downloader-download-instagram-videos-stories1.p.rapidapi.com/get-info-rapidapi",
    params: {
      url: urlsend,
    },
    headers: {
      "X-RapidAPI-Key": "1354ddc61fmsh0758c2b03f881ccp1d5a28jsnc728103f7251",
      "X-RapidAPI-Host":
        "instagram-downloader-download-instagram-videos-stories1.p.rapidapi.com",
    },
  };
  try {
    var response = await axios.request(options);
    console.log(response);
  } catch (error) {
    console.error(error);
  }
  const videoUrl = response.data.download_url;
  const videoFilename = "saved_video.mp4";
  saveVideoFromURL(videoUrl, videoFilename)
    .then(() => {
      console.log("Video saved successfully!");
      res.send("video saved in backend");
    })
    .catch((error) => {
      console.error("Failed to save the video:", error);
      res.send("failed to save video in backend");
    });
});

app.listen(4000, (req, res) => {
  console.log("running");
});
