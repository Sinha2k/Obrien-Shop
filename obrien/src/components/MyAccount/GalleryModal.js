import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useDispatch, useSelector } from "react-redux";
import {
  IconButton,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  Tooltip,
} from "@mui/material";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "../firebase";
import {
  addImages,
  deleteImages,
  fetchFruitDetail,
} from "../../redux_toolkit/reducer/productSliceReducer";

const GalleryModal = ({ openGallery, setOpenGallery, transition }) => {
  const product = useSelector((state) => state.products.fruitDetail);

  const dispatch = useDispatch();

  const [display, setDisplay] = useState(false);

  const uploadGallery = (imagesArray) => {
    const arrayUrl = [];
    imagesArray.map((file) => {
      const storageRef = ref(storage, `/files/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // const prog = Math.round((snapshot.bytesTransferred/ snapshot.totalBytes)*100)
          // setProgress(prog)
        },
        (err) => console.log(err),
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((url) => {
            arrayUrl.push(url);
          });
        }
      );
    });
    setTimeout(() => {
      if (arrayUrl.length > 0) {
        dispatch(addImages({ id: product.ID, gallery: arrayUrl }));
      }
    }, [1500]);
  };

  const handlerChangeImage = (e) => {
    e.preventDefault();
    const imagesArray = [];
    for (let i = 0; i < e.target.files.length; i++) {
      const file = e.target.files[i];
      if (!file) {
        alert("File doesn't exist");
      }
      if (file.size > 1024 * 1024) {
        alert("File too large");
      }
      if (
        file.type !== "image/jpeg" &&
        file.type !== "image/png" &&
        file.type !== "image/jpg"
      ) {
        alert("File format is incorrect");
      }
      file["id"] = Math.random();
      imagesArray.push(file);
    }
    uploadGallery(imagesArray);
  };
  const handleUploadImage = () => {
    const inputFile = document.getElementById("fileUpload");
    inputFile.click();
  };

  const handleDeleteImage = (id) => {
    if (window.confirm("Do u really want to delete this image ???")) {
      dispatch(deleteImages(id));
      setTimeout(() => {
        dispatch(fetchFruitDetail(product.ID));
      }, [2000]);
    }
  };

  return (
    <div>
      <Dialog
        fullWidth
        maxWidth="md"
        open={openGallery}
        TransitionComponent={transition}
        keepMounted
        onClose={() => setOpenGallery(false)}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle style={{ position: "relative" }}>
          {"Product Gallery"}{" "}
        </DialogTitle>
        <DialogContent>
          {/* <Button variant="outlined">Add</Button> */}
          <div onClick={handleUploadImage} className="plus-button">
            <input
              hidden="hidden"
              onChange={handlerChangeImage}
              accept=".jpg,.png"
              id="fileUpload"
              multiple
              type="file"
            />
            <Tooltip title="Upload Gallery" placement="left">
              <i className="fa fa-plus" aria-hidden="true"></i>
            </Tooltip>
          </div>
          <ImageList
            sx={{ width: "100%", height: 450 }}
            variant="quilted"
            cols={4}
            rowHeight={200}
          >
            {/* <ImageList cols={3} rowHeight={164} gap={8}> */}
            {product?.gallery?.length > 0
              ? product?.gallery?.map((item) => (
                  <ImageListItem key={item.ID}>
                    <img
                      onMouseOver={() => setDisplay(true)}
                      src={`${item.URLImage}?w=248&fit=crop&auto=format`}
                      srcSet={`${item.URLImage}?w=248&fit=crop&auto=format&dpr=2 2x`}
                      alt=""
                      loading="lazy"
                    />
                    <ImageListItemBar
                      sx={{
                        background: "transparent",
                      }}
                      position="bottom"
                      actionIcon={
                        <IconButton sx={{ color: "white" }}>
                          <i
                            onClick={() => handleDeleteImage(item.ID)}
                            style={{
                              fontSize: "1.2rem",
                              margin: "auto",
                              color: "black",
                              background: "none",
                            }}
                            className="fa fa-trash-o"
                            aria-hidden="true"
                          ></i>
                        </IconButton>
                      }
                      actionPosition="right"
                    />
                  </ImageListItem>
                ))
              : "No image"}
          </ImageList>
        </DialogContent>
        <DialogActions></DialogActions>
      </Dialog>
    </div>
  );
};

export default GalleryModal;
