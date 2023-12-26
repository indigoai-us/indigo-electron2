import { useEffect } from 'react';

const Standby = () => {

  useEffect(() => {
    window.electron.ipcRenderer.send(
      'window-resize',
      0, // height
      0  // width
    )
  }, []);

  return null;
};

export default Standby;