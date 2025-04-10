import Footer from "@/components/shared/footer";
import Header from "@/components/shared/header";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default function RootLayout({ children }) {
  return (
<div className="flex h-screen flex-col">
    <Header />
    <main className="flex-1 wrapper">
      {children}
    </main>
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
    <Footer />
</div>
  );
}
