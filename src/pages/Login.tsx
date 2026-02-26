import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function Login () {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const navigate = useNavigate()

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        // Obtener usuarios del localStorage
        const users = JSON.parse(localStorage.getItem('users') || '[]')
        
        // Buscar usuario
        const user = users.find((u: any) => u.username === username && u.password === password)
        
        if (user) {
            // Guardar sesión
            localStorage.setItem('currentUser', JSON.stringify({ username: user.username }))
            // Redirigir a home
            navigate('/')
        } else {
            setError('Usuario o contraseña incorrectos')
        }
    }

    return (
        <>
            <div className="min-h-screen bg-[#0F172A] flex flex-col items-center justify-center px-4">
                <h1 className="text-4xl font-bold mb-8 text-[#F8FAFC] text-center">
                    TimeLock
                </h1>
                <div className='text-lg text-[#F8FAFC] font-bold flex items-center bg-[#1E293B] justify-center rounded-2xl p-6 w-60 h-20 mx-auto mb-8' >
                    INICIO DE SESIÓN
                </div>

                {error && (
                    <div className="text-center mb-4 w-64">
                        <p className="text-red-400 font-medium bg-red-500/20 px-4 py-2 rounded-lg">{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col items-center w-full max-w-xs">
                    <p className="font-medium mb-2 text-[#F8FAFC] w-full text-left">Usuario</p>
                    <input
                        type="text"
                        placeholder="Usuario"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        className="mb-4 px-4 py-2 rounded-lg w-full border border-[#64748B] bg-[#1E293B] text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:ring-2 focus:ring-[#131F37] transition duration-300"
                    />
                    <p className="font-medium mb-2 text-[#F8FAFC] w-full text-left">Contraseña</p>
                    <input
                        type="password"
                        placeholder="Contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="mb-8 px-4 py-2 rounded-lg w-full border border-[#64748B] bg-[#1E293B] text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:ring-2 focus:ring-[#131F37] transition duration-300"
                    />
                    <button 
                        type="submit"
                        className="px-6 py-2 bg-[#1E293B] text-white rounded-lg transition duration-300 mb-4 hover:bg-[#2D3E52] w-full font-semibold"
                    >
                        Enviar
                    </button>
                </form>
                <div className="text-center mt-4 w-64">
                    <p className="text-[#F8FAFC]">
                        ¿No tienes una cuenta? <Link to="/register" className="text-[#3B82F6] hover:text-[#2563EB] font-semibold">Regístrate aquí</Link>
                    </p>
                </div>
            </div>
        </>
    )
}

export default Login