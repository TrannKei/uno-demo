import * as React from "react";

import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import Fab from "@mui/material/Fab";
import Card from "../ass/uno-wp/wp1.png";
import Button from '@mui/material/Button';

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "auto",
  bgcolor: "brgb(236, 236, 24)",
  // border: '2px solid #000',
  // boxShadow: 24,
  height: "80vh",
  p: 1,
};
export default function Winner() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  return (
    <>
      <Box sx={{ "& > :not(style)": { m: 1 } }} onClick={handleOpen}>
        <Fab color="primary" aria-label="add">
          <FormatListBulletedIcon sx={{ fontSize: "2rem" }} />
        </Fab>
      </Box>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="winner-div">
            <img className="winner-logo" src={Card} />
            <h1 className="title winner-title">LienDink?</h1>
          </div>
          <div className="after-win">
            <Button className="width-40" variant="contained" color="success">
              CHƠI TIẾP
            </Button>
            <Button className="width-40" variant="contained" color="error">
              THOÁT 
            </Button>
          </div>
        </Box>
      </Modal>
    </>
  );
}
