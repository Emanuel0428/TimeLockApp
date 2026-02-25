import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function Register () {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const navigate = useNavigate()

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setSuccess('')

        // Validaciones básicas
        if (username.length < 3) {
            setError('El usuario debe tener al menos 3 caracteres')
            return
        }
        if (password.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres')
            return
        }

        // Obtener usuarios existentes
        const users = JSON.parse(localStorage.getItem('users') || '[]')
        
        // Verificar si el usuario ya existe
        if (users.some((u: any) => u.username === username)) {
            setError('Este usuario ya existe')
            return
        }

        // Guardar nuevo usuario
        users.push({ username, password })
        localStorage.setItem('users', JSON.stringify(users))
        
        setSuccess('¡Registro exitoso! Redirigiendo al login...')
        
        // Redirigir al login después de 2 segundos
        setTimeout(() => {
            navigate('/login')
        }, 2000)
    }
    
    return (
        <>
            <h1 className="text-2xl font-bold mb-18 mt-12 text-center">
                TimeLock
            </h1>
            <p className='text-lg font-medium flex items-center justify-center rounded-lg p-4 w-60 h-20 mx-auto bg-black text-white'>
                REGISTRO
            </p>

            {error && (
                <div className="text-center mt-4">
                    <p className="text-red-600 font-medium">{error}</p>
                </div>
            )}
            {success && (
                <div className="text-center mt-4">
                    <p className="text-green-600 font-medium">{success}</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col items-center mt-8">
                <p className="font-medium mb-2">Nombre de usuario</p>
                <input
                    type="text"
                    placeholder="Nombre de usuario"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="mb-4 px-4 py-2 rounded-lg w-64 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                />
                <p className="font-medium mb-2" >Contraseña</p>
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
                    Registrar
                </button>
            </form>
                <div className="text-center mt-4">
                <p >
                    ¿Ya tienes una cuenta? <Link to="/login" className="text-black hover:underline">Inicia sesión aquí</Link>
                </p>
            </div>
        </>
    )
}

export default Register