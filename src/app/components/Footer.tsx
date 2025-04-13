import Link from 'next/link'

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <h3 className="mb-4 text-lg font-semibold">Sobre Nós</h3>
            <p className="text-gray-400">
              Somos uma plataforma dedicada ao cuidado e bem-estar dos seus
              pets. Oferecemos serviços de qualidade para garantir a melhor
              experiência para você e seu animal de estimação.
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold">Links Úteis</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/login"
                  className="text-gray-400 hover:text-emerald-400"
                >
                  Login
                </Link>
              </li>
              <li>
                <Link
                  href="/company_register"
                  className="text-gray-400 hover:text-emerald-400"
                >
                  Cadastre sua Empresa
                </Link>
              </li>
              <li>
                <Link
                  href="/reset-password"
                  className="text-gray-400 hover:text-emerald-400"
                >
                  Recuperar Senha
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold">Contato</h3>
            <ul className="space-y-2 text-gray-400">
              <li>Email: contato@petshop.com</li>
              <li>Telefone: (11) 99999-9999</li>
              <li>Endereço: Rua dos Pets, 123 - São Paulo, SP</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-700 pt-8 text-center text-gray-400">
          <p>
            &copy; {new Date().getFullYear()} PetShop. Todos os direitos
            reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
