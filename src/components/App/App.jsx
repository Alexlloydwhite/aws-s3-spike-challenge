import { useState } from 'react'
import axios from 'axios'

import './App.css'

// Async function used to post images
async function postImage({ image, description }) {
  // initing form data
  const formData = new FormData();
  formData.append("image", image)
  formData.append("description", description)
  // Sending formdata to the server
  const result = await axios.post('/images', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
  // returning results
  return result.data
}

function App() {
  // Local State
  const [file, setFile] = useState()
  const [description, setDescription] = useState("")
  const [images, setImages] = useState([])
  // Function to handle submit event
  const submit = async event => {
    event.preventDefault()
    // Async - on submit use function to post image
    const result = await postImage({ image: file, description })
    console.log(result);
    // Add the image to the images array
    setImages([result.imagePath, ...images])
  }
  // function to handle file select
  const fileSelected = event => {
    const file = event.target.files[0]
    setFile(file)
  }

  return (
    <div className="App">
      <h1>AWS S3 Image Upload and Download</h1>
      <form onSubmit={submit}>
        <input onChange={fileSelected} type="file" accept="image/*"></input>
        <input value={description} onChange={e => setDescription(e.target.value)} type="text"></input>
        <button type="submit">Submit</button>
      </form>

      { images.map(image => (
        <div key={image}>
          <img src={image}></img>
        </div>
      ))}
    </div>
  );
}

export default App;