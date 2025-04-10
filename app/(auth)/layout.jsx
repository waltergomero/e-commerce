
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default function AuthLayout({ children }) {
  return (
<div className="flex-center min-h-screen w-full">
      {children}
    <ToastContainer 
                  theme="colored"
                  position="top-center"
                  autoClose={6000}
                  hideProgressBar={false}
                  newestOnTop={false}
                  closeOnClick
                  rtl={false}
                  toastClassName={"text-sm"}
                  pauseOnFocusLoss
                  pauseOnHover/> 

</div>
  );
}
