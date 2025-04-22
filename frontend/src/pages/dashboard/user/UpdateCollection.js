import React, { useState, useEffect } from "react";
import {
  Button,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Box,
  IconButton,
  LinearProgress,
} from "@mui/material";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import axios from "axios";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { API_URL } from "../../../config/config";
import { storage } from "../../../firebaseConfig"; 

const UpdateCollection = ({ initialData, onClose }) => {
  const [wasteType, setWasteType] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [emergencyCollection, setEmergencyCollection] = useState("");
  const [image, setImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    
    if (initialData) {
      setWasteType(initialData.wasteType);
      setDate(new Date(initialData.chooseDate).toISOString().split("T")[0]);
      setDescription(initialData.wasteDescription);
      setEmergencyCollection(initialData.emergencyCollection);
      setImage(initialData.wasteImage); 
    }
  }, [initialData]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    let downloadURL = null;

    
    if (imageFile) {
      const storageRef = ref(storage, `special-collections/${imageFile.name}`);
      const uploadTask = uploadBytesResumable(storageRef, imageFile);

      try {
       
        await new Promise((resolve, reject) => {
          uploadTask.on(
            "state_changed",
            (snapshot) => {
              const prog = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              setProgress(prog);
            },
            (error) => {
              console.error("Image upload error: ", error);
              setErrorMessage("Image upload failed.");
              reject(error);
            },
            async () => {
              downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              resolve();
            }
          );
        });
      } catch (error) {
        console.error("Error during image upload: ", error);
        return; 
      }
    }

    
    const formData = {
      wasteType,
      chooseDate: date,
      wasteDescription: description,
      emergencyCollection,
      wasteImage: downloadURL || image, 
    };

   
    await updateSpecialCollection(formData);
  };

  
  const updateSpecialCollection = async (formData) => {
    try {
      const response = await axios.put(
        `${API_URL}/specialCollection/update/${initialData._id}`,
        formData
      );
      console.log("Data updated successfully: ", response.data);
      onClose(); 
    } catch (error) {
      console.error("Error updating data: ", error);
      setErrorMessage("Failed to update data. Please try again.");
    }
  };

  
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file)); 
      setImageFile(file);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        width: "100%",
        maxWidth: 400,
        margin: "auto",
        padding: 3,
        boxShadow: 3,
        borderRadius: 2,
        backgroundColor: "white",
        "@media (min-width: 768px)": {
          maxWidth: 600,
        },
      }}
    >
      
      <FormControl fullWidth>
        <InputLabel>Select waste type</InputLabel>
        <Select
          value={wasteType}
          onChange={(e) => setWasteType(e.target.value)}
          label="Select waste type"
          required
        >
          <MenuItem value="Organic">Organic</MenuItem>
          <MenuItem value="Plastic">Plastic</MenuItem>
          <MenuItem value="Metal">Metal</MenuItem>
          <MenuItem value="Electronic">Electronic</MenuItem>
          <MenuItem value="Hazardous">Hazardous</MenuItem>
        </Select>
      </FormControl>

      
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          border: "1px dashed gray",
          width: 150,
          height: 150,
          cursor: "pointer",
          margin: "0 auto",
          overflow: "hidden", 
        }}
      >
        <input
          accept="image/*"
          style={{ display: "none" }}
          id="image-upload"
          type="file"
          onChange={handleImageUpload}
        />
        <label htmlFor="image-upload">
          <IconButton component="span" sx={{ width: "100%", height: "100%" }}>
            {image ? (
              <img
                src={image}
                alt="Uploaded"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover", 
                }}
              />
            ) : (
              <AddPhotoAlternateIcon sx={{ fontSize: 40 }} />
            )}
          </IconButton>
        </label>
      </Box>

      
      <TextField
        fullWidth
        label="Choose Date"
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        InputLabelProps={{
          shrink: true,
        }}
        required
      />

      
      <TextField
        label="Enter waste description"
        multiline
        rows={3}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />

      
      <TextField
        label="In emergency waste collection"
        multiline
        rows={2}
        value={emergencyCollection}
        onChange={(e) => setEmergencyCollection(e.target.value)}
        required
      />

      
      {progress > 0 && <LinearProgress variant="determinate" value={progress} />}

      
      {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}

      
      <Button
        variant="contained"
        type="submit"
        sx={{
          backgroundColor: "#28a745",
          color: "white",
          "&:hover": {
            backgroundColor: "#218838",
          },
        }}
      >
        Update
      </Button>
    </Box>
  );
};

export default UpdateCollection;
