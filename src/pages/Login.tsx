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
            <h1 className="text-2xl font-bold mb-18 mt-12 text-center" >
                TimeLock
            </h1>
            <p className='text-lg text-white font-medium flex items-center bg-black justify-center rounded-lg p-4 w-60 h-20 mx-auto' >
                INICIO DE SESIÓN
            </p>

            {error && (
                <div className="text-center mt-4">
                    <p className="text-red-600 font-medium">{error}</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col items-center mt-8">
                <p className="font-medium mb-2">Usuario</p>
                <input
                    type="text"
                    placeholder="Usuario"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="mb-4 px-4 py-2 rounded-lg w-64 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                />
                <p className="font-medium mb-2">Contraseña</p>
                <input
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="mb-8 px-4 py-2 rounded-lg w-64 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                />
                <button 
                    type="submit"
                    className="px-6 py-2 bg-black text-white rounded-lg transition duration-300 mb-4 hover:bg-gray-800"
                >
                    Enviar
                </button>
            </form>
            <div className="text-center mt-4">
                <p>
                    ¿No tienes una cuenta? <Link to="/register" className="text-black hover:underline">Regístrate aquí</Link>
                </p>
            </div>
        </>
    )
}

export default Login