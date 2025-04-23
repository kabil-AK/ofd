
import { Toaster } from 'react-hot-toast';
import './App.css'
import './index.css'
import AppRouter from './routes/AppRouter';
import { Tooltip } from 'react-tooltip'
import { AuthProvider } from './utils/idb.jsx';
import ScrollToTop from './components/ScrollToTop.jsx';


function App() {

  return (
    <>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
      <Toaster />
      <Tooltip id="my-tooltip" />
    </>
  )
}

export default App
