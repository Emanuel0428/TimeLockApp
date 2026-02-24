import {useState, useEffect} from 'react'

function Register () {
    const [theme, setTheme] = useState<'light' | 'dark'>('light')
    useEffect(() => {
        // Detectar el tema preferido del sistema
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null
        const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light')
        setTheme(initialTheme)
        document.documentElement.setAttribute('data-theme', initialTheme)
    }, [])

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light'
        setTheme(newTheme)
        document.documentElement.setAttribute('data-theme', newTheme)
        localStorage.setItem('theme', newTheme)
    }
    
    return (
        <>
            <link rel="stylesheet" href="/src/style.css" /> 
            {/* Botón de cambio de tema */}
            <div className="absolute top-4 right-4">
                <button
                    onClick={toggleTheme}
                    className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition duration-300"
                    aria-label="Cambiar tema"
                >
                    {theme === 'light' ? '🌙' : '☀️'}
                </button>
            </div>

            <h1 className="text-2xl font-bold mb-18 mt-12 text-center">
                TimeLock
            </h1>
            <p className='text-lg font-medium flex items-center justify-center rounded-lg p-4 w-60 h-20 mx-auto'>
                REGISTRO
            </p>

            <div className="flex flex-col items-center mt-8">
                <p className="font-medium mb-2">Nombre de usuario</p>
                <input
                    type="text"
                    placeholder="Nombre de usuario"
                    className="mb-4 px-4 py-2 rounded-lg w-64 focus:outline-none focus:ring-2 transition duration-300"
                />
                <p className="font-medium mb-2" >Contraseña</p>
                <input
                    type="password"
                    placeholder="Contraseña"
                    className="mb-8 px-4 py-2 rounded-lg w-64 focus:outline-none focus:ring-2 transition duration-300"
                />
                <button className="px-4 py-2 rounded-lg transition duration-300 mb-4"
                        onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
                        onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}>
                    Registrar
                </button>
            </div>
                <div className="text-center mt-4">
                <p >
                    ¿Ya tienes una cuenta? <a href="/login" className="text-black hover:underline">Inicia sesión aquí</a>
                </p>
            </div>
        </>
    )
}

export default Register