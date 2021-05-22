import { useEffect, useState } from 'react'
import axios from 'axios'

import './App.css'

async function postImage({ image, description }) {
  const formData = new FormData();
  formData.append("image", image)
  formData.append("description", description)

  const result = await axios.post('/images', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
  return result.data
}

function App() {
  const [file, setFile] = useState();
  const [description, setDescription] = useState('');
  const [images, setImages] = useState();

  const submit = async event => {
    event.preventDefault()
    const result = await postImage({ image: file, description })
    console.log(result);
  }

  const fileSelected = event => {
    const file = event.target.files[0]
    setFile(file)
  }

  const getImages = () => {
    axios.get('/images')
    .then((response) => {
      setImages(response.data)
      console.log(response.data);
    })
    .catch((err) => console.log(err))
  }

  useEffect(() => {
    getImages();
  }, [])

  return (
    <div className="App">
      <h1>AWS S3 Image Upload and Download</h1>
      <form onSubmit={submit}>
        <input onChange={fileSelected} type="file" accept="image/*"></input>
        <input value={description} onChange={e => setDescription(e.target.value)} type="text"></input>
        <button type="submit">Submit</button>
      </form>
      {JSON.stringify(images)}
      {/* { images.map(image => (
        <div key={image.id}>
          <img src={image.imagepath}></img>
        </div>
      ))} */}
    </div>
  );
}

export default App;