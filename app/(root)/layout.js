import Footer from "@/components/shared/footer";
import Header from "@/components/shared/header";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { SessionProvider } from "next-auth/react"


export default function RootLayout({ children }) {
  return (
     <SessionProvider>
      <div className="flex h-screen flex-col">
          <Header />
          <main className="flex-1 wrapper">
            {children}
          </main>
          <ToastContainer 
                        theme="colored"
                        position="top-center"
                        autoClose={3000}
                        hideProgressBar={false}
                        newestOnTop={false}
                        closeOnClick
                        rtl={false}
                        toastClassName={"text-sm"}
                        pauseOnFocusLoss
                        pauseOnHover/> 
          <Footer />
      </div>
    </SessionProvider>
  );
}
