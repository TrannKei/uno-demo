import * as React from 'react';

import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import Fab from '@mui/material/Fab';


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 'auto',
    bgcolor: 'brgb(236, 236, 24)',
    // border: '2px solid #000',
    // boxShadow: 24,
    height: '80vh',
    p: 1
};
export default function ChooseColor() {

    

    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    return (
        <>
            <Box sx={{ '& > :not(style)': { m: 1 } }} onClick={handleOpen}>
                <Fab color="primary" aria-label="add">
                    <FormatListBulletedIcon sx={{ fontSize: '2rem' }} />
                </Fab>
            </Box>
         
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <div style={{ width: '300px' }}>
                        <h3 className='title' style={{color: "white"}}>CHỌN MÀU TIẾP THEO:</h3>
                        <div className='color-wheel'>
                            <div className='wheel-R square'></div>
                            <div className='wheel-G square'></div>
                            <div className='wheel-Y square'></div>
                            <div className='wheel-B square'></div>
                        </div>
                    </div>
                </Box>
            </Modal>
        </>
    );
}