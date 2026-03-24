import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react"

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <SignedOut>
        <div className="flex items-center justify-center min-h-screen">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">AutoAssist</h1>
            <p className="text-gray-600 mb-6">
              Sistema de gestión para talleres mecánicos
            </p>
            <SignInButton mode="modal">
              <button className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                Iniciar Sesión
              </button>
            </SignInButton>
          </div>
        </div>
      </SignedOut>

      <SignedIn>
        <nav className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <div className="flex items-center">
                <h1 className="text-xl font-bold text-gray-900">AutoAssist</h1>
              </div>
              <div className="flex items-center gap-4">
                <UserButton afterSignOutUrl="/" />
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              ¡Bienvenido a AutoAssist!
            </h2>
            <p className="text-gray-600 mb-4">
              Tu sistema de gestión está listo. Aquí podrás:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Gestionar clientes y vehículos</li>
              <li>Registrar servicios de mantenimiento</li>
              <li>Generar cotizaciones con IA</li>
              <li>Enviar recordatorios automáticos</li>
              <li>Ver métricas de tu taller</li>
            </ul>
            
            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Próximos pasos:</strong> Configurar tu base de datos en Supabase 
                y agregar tu primer cliente.
              </p>
            </div>
          </div>
        </main>
      </SignedIn>
    </div>
  )
}

export default App
