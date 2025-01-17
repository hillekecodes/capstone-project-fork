import { useState, useCallback, useEffect } from "react";
import axios from "axios";
import React from "react";
import Button from "react-bootstrap/Button";
import { Form, Col, Row } from "react-bootstrap";
import { toast } from "react-toastify";
import { StateList } from "./StateList";

const Uploader = ({ onSuccess }) => {
  const initialUserData = {
    item: "",
    store: "",
    total: "",
    description: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    // photos: [],
    category: ""
  };

  const [files, setFiles] = useState();
  const [userData, setUserData] = useState(initialUserData);
  const [state, setState] = useState();

  const updateUserDataHandler = useCallback( (type) => (event) => {
    setUserData({...userData, [type]: event.target.value}, [userData])
  })

  const formHandler = useCallback( (type ) => (event) => {
    console.log('inside formhandler')
    event.preventDefault()
    console.log(userData);
    }, 
    [userData]
  )
  
  const onInputChange = async (e) => {
    setFiles(e.target.files);
  };

  const onSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
      for (let key in userData) {
        formData.append(key, userData[key]);
    }
 
    const arr = [...files];
      arr.forEach((file, id) => {
        formData.append(`file-${id}`, file, file.name);
    })
    
    console.log(userData);

    axios
      .post("//localhost:8000/upload", formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      .then((response) => {
        toast.success("Upload Successful");
        onSuccess(response.data);
      })
      .catch((e) => {
        toast.error("Upload Error");
      });
  };

  return (
    <>
      <div className="upload-container ">
        <div
          className="uploadInfo "
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Form method="post" action="#" id="#" onSubmit={formHandler()}
            style={{
              display: "grid", alignContent: "center",justifyContent: "center", marginTop: "5vh", height: "84vh", 
              backgroundColor: "whitesmoke", color: "black", width: "50%", borderRadius: "50px", border: "solid"
            }}>
          <Row className="mb-3">
              <h1 style={{ fontSize: "5vw" }}>The Deal</h1>
              <Form.Group as={Col} controlId="formGridAddress1">
                <Form.Label>Item</Form.Label>
                <Form.Control
                  placeholder="Macbook Pro 2016, GoPro Hero 9, etc.."
                  onChange={updateUserDataHandler("item")}
                  required
                />
              </Form.Group>
              <Form.Group as={Col} controlId="formGridState">
                <Form.Label>Category</Form.Label>
                <Form.Select
                  defaultValue="Category"
                  onChange={updateUserDataHandler("category")}
                >
                  <option>Choose Category...</option>
                  <option value="Clothing">Clothing</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Food">Food</option>
                  <option value="General">General</option>
                </Form.Select>
              </Form.Group>
            </Row>
            <Row className="mb-3">
              <Form.Group as={Col} controlId="formGridEmail">
                <Form.Label>Store</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Best Buy"
                  onChange={updateUserDataHandler("store")}
                  required
                />
              </Form.Group>

              <Form.Group as={Col} controlId="formGridPassword">
                <Form.Label>Total</Form.Label>
                <Form.Control
                  type="value"
                  placeholder="$25.00"
                  onChange={updateUserDataHandler("total")}
                  required
                />
              </Form.Group>
            </Row>

            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                onChange={updateUserDataHandler("description")}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formGridAddress1">
              <Form.Label>Address</Form.Label>
              <Form.Control
                placeholder="1234 Main St"
                onChange={updateUserDataHandler("address")}
                required
              />
            </Form.Group>

            <Row className="mb-3">
              <Form.Group as={Col} controlId="formGridCity">
                <Form.Label>City</Form.Label>
                <Form.Control
                  onChange={updateUserDataHandler("city")}
                  required
                />
              </Form.Group>

              <Form.Group as={Col} controlId="formGridState">
                <Form.Label>State</Form.Label>
                <Form.Select
                  defaultValue="Choose..."
                  onChange={updateUserDataHandler("state")}
                >
                  <option>Choose...</option>
                  {StateList.map(state => {
                    return <option>{state }</option>
                  } )}
                </Form.Select>
              </Form.Group>

              <Form.Group as={Col} controlId="formGridZip">
                <Form.Label>Zip</Form.Label>
                <Form.Control
                  onChange={updateUserDataHandler("zip")}
                  required
                />
              </Form.Group>
            </Row>
          </Form>
        </div>

        <div className="file-upload container" 
          style={{
            display: "grid", alignItems: "center", justifyContent: "center", marginTop: "5vh", height: "70vh", 
            backgroundColor: "whitesmoke", color: "black", width: "25%", borderRadius: "50px", border: "solid", marginBottom: "7vh"
          }}>
          <form method="post" action="#" id="#" onSubmit={onSubmit}>
            <div className="form-group files">
            <h1 style={{ fontSize: "5vw" }}>Uploader</h1>
              <input         
                onChange={onInputChange}
                type="file"
                accept=".jpeg, .png, .jpg"
                className="form-control"
                required
              />
            </div>
            <br/>
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Uploader;