// FormDrawer.js
import React from 'react';
import Drawer from '@mui/material/Drawer';

function FormDrawer({ open, onClose, children  }) {
  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <div>
        {children}
      </div>
    </Drawer>
  );
}

export default FormDrawer;
