import React from "react"
import { useState } from "react";
import axios from "axios";

export default function App(){
    const [url,setUrl] = useState('');
    const [videoUrl, setVideoUrl] = useState('');
    const [videoGot, setVideoGot] = useState(false)
    const [gettingVideo, setGettingVideo] = useState(false)
    
    function handleChange(event){
        setUrl(event.target.value);
    }

    const handleSubmit = async(event)=>{
        event.preventDefault();
        setGettingVideo(true);
        const response = await axios.post("http://localhost:4000/urlSubmit",{
            url : url
        })
        console.log(response.data);
        try {
            const response = await axios.get('http://localhost:4000/getVideoFile', {
              responseType: 'blob'
            });
            console.log(response);
            const videoBlob = new Blob([response.data], { type: 'video/mp4' });
            const url = URL.createObjectURL(videoBlob);
            setVideoUrl(url);
            setVideoGot(true)
          } catch (error) {
            console.error('Error fetching video:', error);
          }
          setGettingVideo(false)
    }

    const Download = async()=>{
            const a = document.createElement('a');
            a.href = videoUrl;
            a.download = 'downloaded_video.mp4';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
          };

    return(
        <div>
        <form onSubmit={handleSubmit}>
            <h1>Paste Your Link Here</h1>
            <input type="text" placeholder="Enter URL" value={url} id="url" onChange={handleChange} />
            <br />
            <button type="submit">Get Post</button>
        </form>
        {gettingVideo && <p>video is downloading please wait</p>}
        {videoGot && <button onClick={Download}>download</button>}
        </div>
    )
}