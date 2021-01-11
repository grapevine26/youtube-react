import React, {useState} from 'react'
import {Typography, Button, Form, message, Input, Icon} from 'antd'
import Dropzone from 'react-dropzone'
import Axios from 'axios';

const {TextArea} = Input;
const {Title} = Typography;

const PrivateOptions = [
  {value: 0, label: "Private"},
  {value: 1, label: "Public"},
]

const CategoryOptions = [
  {value: 0, label: "Film & Animation"},
  {value: 1, label: "Autos & Vehicles"},
  {value: 2, label: "Film & Animation"},
  {value: 3, label: "Autos & Vehicles"},
]


function VideoUploadPage() {
  const [VideoTitle, setVideoTitle] = useState("")
  const [Description, setDescription] = useState("")
  const [Private, setPrivate] = useState(0)
  const [Category, setCategory] = useState("Film & Animation")

  const onTitleChange = (e) => {
    setVideoTitle(e.currentTarget.value)
  }

  const onDescriptionChange = (e) => {
    setDescription(e.currentTarget.value)
  }

  const onPrivateChange = (e) => {
    setPrivate(e.currentTarget.value)
  }

  const onCategoryChange = (e) => {
    setCategory(e.currentTarget.value)
  }

  const onDrop = (files) => {
    let formData = new FormData;
    const config = {
      header: {'content-type': 'multipart/form-data'}
    }
    formData.append("file", files[0])

    console.log(files)
    Axios.post('/api/video/uploadfiles', formData, config)
    .then(response => {
      if(response.data.success) {
        console.log(response.data);

        let variable = {
          url:response.data.url,
          fileName: response.data.fileName
        }
        Axios.post('/api/video/thumbnail', variable
        .then(response => {
          if(response.data.success) {
            alert()
          } else {
            alert('썸네일 생성 실패')
          }
        }))
      } else {
        alert('업로드 실패')
      }
    })
  }


  return (
    <div style={{ maxWidth:'700px', margin:'2rem auto'}}>
      <div style={{ textAlign:'center', marginButton:'2rem'}}>
        <Title level={2}>Upload Video</Title>
      </div>

      <Form onSubmit>
        <div style={{ display:'flex', justifyContent:'space-between' }}>
          
          <Dropzone 
          onDrop={onDrop} 
          multiple={false} 
          maxSize={100000000}
          >

            {({getRootProps, getInputProps}) => (
              <div style={{ width: '300px', height: '240px', border: '1px solid lightgray', display: 'flex', 
                alignItems: 'center', justifyContent: 'center'}} {...getRootProps()}>
                  <input {...getInputProps()}/>
                  <Icon type="plus" style={{ fontSize: '3rem'}}/>
              </div>
            )}

          </Dropzone>

          <div>
            <img src alt></img>
          </div>

        </div>

        <br/>
        <br/>

        <label>Title</label>
        <Input 
          onChange={onTitleChange}
          value={VideoTitle}
        />

        <br/>
        <br/>

        <label>Description</label>
        <TextArea 
          onChange={onDescriptionChange}
          value={Description}
        />

        <br/>
        <br/>

        <select onChange={onPrivateChange}>
          {PrivateOptions.map((item, index) => (
            <option key={index} value={item.value}>{item.label}</option>
          ))}
        </select>

        <select onChange={onCategoryChange}>
          {CategoryOptions.map((item, index) => (
            <option key={index} value={item.value}>{item.label}</option>
          ))}
        </select>

        <Button type="primary" size="large" onClick>
          Submit
        </Button>
      </Form>

    </div>
  )
}

export default VideoUploadPage
