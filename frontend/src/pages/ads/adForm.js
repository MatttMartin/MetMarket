import { useState, useEffect, useRef } from "react";
import StatusFields from "../../components/adForm/statusField";
import DeleteConfirmationModal from "../../components/adForm/deleteConfirmationModal";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useUser } from "../../userContext";
import  { useNavigate } from 'react-router-dom'
import { jwtDecode } from "jwt-decode";
import LocationField from "../../components/adForm/locationField";
import isLoggedIn from '../../util/isLoggedIn';

//var imageFiles = []; // array of images
var rawImageFiles = []; // for uploading new images
//var imageLinks = []; // for edit form, cloudinary links

{/* 
This page is used for both making and editing an ad. 
The only difference between the two is that the edit page has the fields pre-filled, 
and also allows the user to delete an ad or change its status. 
*/}

function AdForm(props) {
  const navigate = useNavigate();


  const [meetOnCampus, setMeetOnCampusChecked] = useState(false);
  const [categoryId, setCategoryId] = useState(0);
  const [subcategoryId, setSubcategoryId] = useState(0);
  const [imageFiles, setImageFiles] = useState([]);
  const [imageLinks, setImageLinks] = useState([]);
  const [locationId, setLocationId] = useState(0);



  const [isDeleteModalShown, setIsDeleteModalShown] = useState(false);
  const { id } = useParams();
  const { userId, setUserId } = useUser();
  const [url, setUrl] = useState("");

  // Form fields
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState("");

  const [province_id, setProvincesId] = useState(0);

  const [is_available, setAvailability] = useState(true);
  const [loading, setLoading] = useState(true);



    useEffect(() => {
      if (!isLoggedIn()) {
        navigate("/login");
      }
      
      if (props.isEditForm) {
        const fetchAdData = async () => {
          try {
            const response = await axios.get(process.env.REACT_APP_APIURL + `/ads/editDetails/${id}`, {
              headers: {
                authorization: sessionStorage.getItem("token"),
              },
              params: {
                id: id,
                userId: jwtDecode(sessionStorage.getItem("token")).id,
              },
              
            });
            
            if (response.data.rows.length === 0) {
              navigate("/404");
            }
            setTitle(response.data.rows[0].title);
            setDescription(response.data.rows[0].description);
            setPrice(response.data.rows[0].price);
            setProvincesId(response.data.rows[0].province_id);
            setImageLinks(response.data.rows[0].image_links);
            setSubcategoryId(response.data.rows[0].subcategory_id);
            setCategoryId(response.data.rows[0].category_id);
            setAvailability(response.data.rows[0].is_available === "1" ? true : false);
            setMeetOnCampusChecked(response.data.rows[0].meet_on_campus === "1" ? true : false);
            setLocationId(response.data.rows[0].location_id);

            setLoading(false);
          } catch (error) {
            console.error("Error fetching ad data:", error);
            if (error.response.status == 403) {
              navigate("/forbidden");
            }
            setLoading(false);
          }
        };
      
        fetchAdData();
      }
      else {
        setLoading(false);
      }
    }, [id]);

    const postAd = (event) => {
      event.preventDefault();
      var editFormData = {
        user_id: jwtDecode(sessionStorage.getItem("token")).id,
        location_id: locationId,
        title: title,
        description: description,
        price: price, 
        category_id: categoryId,
        subcategory_id: subcategoryId,
        meet_on_campus: meetOnCampus === true ? 1 : 0,
        is_available: is_available === true ? 1 : 0,
      };

      
      fetch(process.env.REACT_APP_APIURL + "/ads/postNewAd", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: sessionStorage.getItem("token"),
        },
        body: JSON.stringify(editFormData),
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to post new ad');
        }
        return response.json(); 
      })
      .then(data => {
        console.log("Ad uploaded successfully with ID:", data.id);
        uploadImage(data.id);
      })
      .catch(error => console.error("Error posting ad:", error));
       
    };

    const updateAd = (event) => {
      event.preventDefault();
      var editFormData = {
        product_id: id,
          values: {
            location_id: locationId,
            title: title,
            description: description,
            price: price, 
            category_id: categoryId,
            subcategory_id: subcategoryId,
            meet_on_campus: meetOnCampus === true ? 1 : 0,
            is_available: is_available === true ? 1 : 0,
          }
      };

      fetch(process.env.REACT_APP_APIURL + "/ads/updateAd", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: sessionStorage.getItem("token"),
        },
        body: JSON.stringify(editFormData),
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to update ad');
        }
        console.log("in response frontend");
        return response.json(); 
      })
      .then(data => {
        uploadImage(id);
        alert("Ad Updated Succesfully!");
        navigate("/MyListings");
        //console.log("Response from server:", data);
      })
      .catch(error => console.error("Error posting ad:", error));
    }

    const convertBase64 = (file) => {
      return new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);
    
        fileReader.onload = () => {
          resolve(fileReader.result);
        };
    
        fileReader.onerror = (error) => {
          reject(error);
        };
      });
    };
    
    function uploadSingleImage(base64, product_id) {
      setLoading(true);
      return axios
        .post(process.env.REACT_APP_APIURL + "/cloudinary/uploadImage", { image: base64, product_id: product_id })
        .then((res) => {
          setUrl(res);
          alert("Ad Posted Succesfully!");
          navigate("/MyListings");
        })
        .finally(() => setLoading(false))
        .catch(console.log);
    }
    
    function uploadMultipleImages(images, product_id) {
      setLoading(true);
      return axios
        .post(process.env.REACT_APP_APIURL + "/cloudinary/uploadMultipleImages", { images, product_id: product_id })
        .then((res) => {
          setUrl(res.data);
          alert("Ad Posted Succesfully!");
          navigate("/MyListings");
        })
        .finally(() => setLoading(false))
        .catch(console.log);
    }

    function updateImages(images) {
      setLoading(true);
      return axios
        .post(process.env.REACT_APP_APIURL + "/cloudinary/updateImages", 
        { product_id: id, existing_images: imageLinks, new_images: images })
        .then((res) => {
          setUrl(res.data);
        })
        .finally(() => setLoading(false))
        .catch(console.log);
    }
    
    const uploadImage = async (product_id) => {
      const files = rawImageFiles;
      console.log(files.length);
    
      if (props.isEditForm) {
        console.log("hereeeeee");
        const base64s = await Promise.all(files.map(convertBase64));
        await updateImages(base64s);
      } else {
        if (files.length === 1) {
          const base64 = await convertBase64(files[0]);
          await uploadSingleImage(base64, product_id);
        } else {
          const base64s = await Promise.all(files.map(convertBase64));
          await uploadMultipleImages(base64s, product_id);
        }
      }
    };

    function removeImage(removeFromFiles, image) {
      if (removeFromFiles) {
        const arr = imageFiles.filter(ele => ele.name !== image);
        setImageFiles(arr);
      } else {
        const arr = imageLinks.filter(ele => ele !== image);
        setImageLinks(arr);
      }
    }


    useEffect(() => {
      console.log("Updated imageFiles:", imageFiles);

      let selDiv = document.querySelector("#selectedFiles");
      if (selDiv) {

  
      //selDiv.innerHTML = "";

      imageFiles.forEach(function(f) {
        if(!f.type.match("image.*")) {
          return;
        }
    
        var reader = new FileReader();
        reader.onload = function (event) {
          var html = 
          "<div><img style='max-height:100px;' class='mt-3' src=\"" + event.target.result + "\">" 
          + "<button class='btn align-self-center' onClick='{($event) => {$event.preventDefault(); removeImage(true, f)}}' data-id='" + f.name + "'>&#x2715;</button></div>";
          selDiv.innerHTML += html;				
        }
        reader.readAsDataURL(f); 
      });
    }
    }, [imageFiles]);

    
    useEffect(() => {
      console.log("Updated imageLinks:", imageLinks);
    }, [imageLinks]);
  
    
    async function fileUpload(event) {
      if(!event.target.files || !window.FileReader) return;
      
      var files = event.target.files;
      rawImageFiles.push(...files);
  
      var filesArr = Array.prototype.slice.call(files);
      
      await setImageFiles([...imageFiles, ...filesArr]);
    }


    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);

    useEffect(() => {
      fetch(process.env.REACT_APP_APIURL + "/categories/sections")
        .then((response) => response.json())
        .then((data) => {
          setCategories(data);
        })
        .catch((error) => console.error("Error fetching categories:", error));
    }, []);

    useEffect(() => {
      fetch(process.env.REACT_APP_APIURL + "/categories/sections/subcategories")
        .then((response) => response.json())
        .then((data) => {
          setSubCategories(data);
        })
        .catch((error) => console.error("Error fetching categories:", error));
    }, []);
    
  if (loading)
    { return <p>Loading...</p> }


  return (
    <form className="m-5">
      {
        props.isEditForm == true ? <StatusFields status={is_available} change={() => setAvailability(!is_available)}/> : ""
      }
      <h2>Item Information</h2>
      <div className="row">
        {/* Title */}
        <div className="col col-sm-6 col-12 mb-3">
          <label htmlFor="title" className="form-label">Title <span className="text-danger">*</span></label>
          <input type="text" id="title" placeholder="Title" required
                 className="form-control bg-body-tertiary" maxLength="100" 
                defaultValue={title} onChange={($event) => setTitle($event.target.value)} name="title"
                 />
        </div>
        {/* Price */}
        <div className="col col-sm-6 col-12 mb-3">
          <label htmlFor="price" className="form-label">Price <span className="text-danger">*</span></label>
          <div className="input-group">
          <span className="input-group-text">$</span>
          <input type="number" className="form-control bg-body-tertiary" name="price"
                 id="price" placeholder="Price" min="0" required
                 defaultValue={price} onChange={($event) => setPrice($event.target.value)}
                 />  
          </div>    
        </div>
      </div>
      {/* Description */}
      <div className="mb-3">
        <label htmlFor="description" className="form-label">Description</label>
        <textarea className="form-control bg-body-tertiary" id="description" 
                  placeholder="Lorem ipsum..." rows="3" name="description"
                  defaultValue={description} onChange={($event) => setDescription($event.target.value)}
                  >
        </textarea>
      </div>
      {/* Category */}
      <div className="mb-3">
        <label htmlFor="category_id" className="form-label">Category <span className="text-danger">*</span></label>
        <select id="category" className="form-select bg-body-tertiary" value={parseInt(categoryId)}
                name="category_id" required onChange={(event) => {setCategoryId(event.target.value); }}
                >
          <option value="0">Select a category</option>
          {categories.map((category) => (<option value={category.category_id} key={category.category_id}>{category.category_name}</option>))}
        </select>
      </div>
      {
        categoryId === "3" ? 
          (<div className="mb-3">
            <label htmlFor="subcategory_id" className="form-label">Subcategory <span className="text-danger">*</span></label>
            <select id="subcategory_id" className="form-select bg-body-tertiary" defaultValue={parseInt(subcategoryId)}
                    name="subcategory_id" required onChange={(event) => {setSubcategoryId(event.target.value);}}
                    >
              <option value="0">Select a subcategory</option>
              {subCategories.map((sub) => (<option value={sub.subcategory_id} key={sub.subcategory_id}>{sub.subcategory_name}</option>))}
            </select>
          </div>)
        : ""

      }

      {/* File upload */}
      {/* TODO: ADD THE IMAGES */}
      <div className="mb-3">
        <label htmlFor="formFile" className="form-label">Images <span className="text-danger">*</span></label>
        <input onChange={(event) => {fileUpload(event);}}
                className="form-control bg-body-tertiary" type="file" id="formFile" 
                multiple="multiple" accept=".jpg,.png" required name="images"/>
        <div id="selectedFiles" className="mt-3">
          {
            imageLinks.length > 0 && imageLinks[0] !== null ? imageLinks.map((f) => 
            (<div key={f}><img className="mt-3" src={f} style={{maxHeight: '100px'}}/><button className='btn align-self-center' onClick={($event) => {$event.preventDefault(); removeImage(false, f)}} data-id={f}>&#x2715;</button></div>))
            : (<div className="text-muted">No images for this ad yet. Use the file selector above to add some images.</div>)
          }
        </div>
      </div>
      <hr className="my-4"></hr>
      <h2>Meetup Information</h2>
      <p>Where do you want the transaction to happen?</p>
      {/* Address */}
      {/* TODO: ADD LOCATION */}
      <div className="mb-3 form-check">
        <input className="form-check-input" type="checkbox" name="meet_on_campus" value={meetOnCampus} id="meet-on-campus" checked={meetOnCampus}
                onChange={() => {setMeetOnCampusChecked(!meetOnCampus)}
            }
        />
        <label className="form-check-label" htmlFor="meet-on-campus">
          Meet on TMU's Campus
        </label>
      </div>
      {
        meetOnCampus === true ? "": 
        <>
        Or specify a location: 
        <LocationField selectedCity={locationId} selectedProvince={province_id}
        changeSelectedCity={(val) => setLocationId(val)}/> 
        </>
      }
      
      {/* Submit/cancel buttons */}
      <div className="text-end pb-5">
          {props.isEditForm ? 
            <button className="btn btn-yellow rounded border-0 p-2 px-4 mx-1"
            onClick={($event) => {$event.preventDefault(); setIsDeleteModalShown(!isDeleteModalShown)}}
            >
              Delete Ad
            </button>
            : ""
          }

        <button className="btn btn-primary text-white rounded border-0 p-2 px-4 mx-1" 
               type="submit" onClick={props.isEditForm == true ? updateAd : postAd}>
                {props.isEditForm == true ? "Update Ad" : "Post Ad"}
        </button>
        <a type="button" href="/MyListings" className="btn p-2 px-4" >Cancel</a>
      </div>

      {/* Delete confirmation modal */}
      <DeleteConfirmationModal show={isDeleteModalShown} 
            id={id}
            onHide={() => setIsDeleteModalShown(false)}
            />
    </form>
  )
  }


  function addressFields(street, city, country) {
    return (
      <div>
        <div className="mb-3">
          <label htmlFor="street" className="form-label">Street Address</label>
          <input type="text" className="form-control bg-body-tertiary" id="street" 
                 placeholder="Street Adress" autoComplete="street-address" name="street"
                 defaultValue={street}
                 />
        </div>
        <div className="row">
          <div className="col col-sm-6 col-12 mb-3">
            <label htmlFor="city" className="form-label">City <span className="text-danger">*</span></label>
            <input type="text" className="form-control bg-body-tertiary" id="city" 
                   placeholder="City" autoComplete="address-level2" required 
                   name="city" defaultValue={city}
                   />
          </div>
          <div className="col col-sm-6 col-12 mb-3">
            <label htmlFor="country" className="form-label">Country <span className="text-danger">*</span></label>
            <input type="text" className="form-control bg-body-tertiary" id="country" 
            placeholder="Country" autoComplete="country" required name="country" defaultValue={country}/>
          </div>
      </div>
      </div>
    );
    
  }


export default AdForm;