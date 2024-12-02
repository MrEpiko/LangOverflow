import { createPortal } from 'react-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const ToastMessage = () => {
  return createPortal(
    <ToastContainer theme='dark' autoClose={1500} draggable/>
    ,document.getElementById('toasts')
  );
}
export default ToastMessage;