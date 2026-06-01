import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import Landing from './pages/Landing'
import Registro from './pages/Registro'
import Resultados from './pages/Resultados'
import Admin from './pages/Admin'
import Terminos from './pages/Terminos'
import Perfil from './pages/Perfil'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/registro" element={<Registro />} />
            <Route path="/resultados" element={<Resultados />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/terminos" element={<Terminos />} />
            <Route path="/perfil" element={<Perfil />} />
          </Routes>
        </main>
      </AuthProvider>
    </BrowserRouter>
  )
}
