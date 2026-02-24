import QuickAccess from "../components/QuickAccess";

const Home = () => {
    return (
        <>
            <QuickAccess />
            
            {/* Contenido principal */}
            <main className="pt-16 px-4">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">
                        Bienvenido a TimeLock
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 text-center">
                        Gestiona tu tiempo de manera efectiva
                    </p>
                </div>
            </main>
        </>
    )
}

export default Home
