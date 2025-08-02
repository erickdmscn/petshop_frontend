const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="space-y-4">
            <h3 className="mb-4 text-xl font-bold text-white">Sobre Nós</h3>
            <p className="max-w-md leading-relaxed text-gray-300">
              Somos uma plataforma dedicada ao cuidado e bem-estar dos seus
              pets. Oferecemos serviços de qualidade para garantir a melhor
              experiência para você e seu animal de estimação.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="mb-4 text-xl font-bold text-white">Contato</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <span className="text-gray-300">authomatize2025@gmail.com</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-gray-700 pt-8">
          <div className="flex flex-col items-center justify-between space-y-4 sm:flex-row sm:space-y-0">
            <p className="text-sm text-gray-400">
              &copy; {new Date().getFullYear()} PetCare. Todos os direitos
              reservados.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
