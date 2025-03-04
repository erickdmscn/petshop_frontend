/* eslint-disable prettier/prettier */
"use client";
import { Lock, User, Loader } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    
    if (!username || !password) {
      setError('Preencha todos os campos');
      return;
    }

    setLoading(true);

    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    setLoading(false);

    if (!response.ok) {
      setError(data.message || 'Erro ao fazer login');
    } else {
      console.log('Login bem-sucedido', data);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gray-100">
      <div className="flex h-screen w-full overflow-hidden bg-white">
        {/* Lado da Imagem */}
        <div className="hidden items-center justify-center bg-gradient-to-br from-green-400 to-teal-500 md:flex md:w-1/2 h-full">
          <img src="/images/bg-pets.png" alt="pets" className="w-full h-full object-cover" />
        </div>

        {/* Lado do Formulário */}
        <div className="mt-10 w-full md:w-1/2 flex flex-col justify-center items-center h-full p-10">
          <div className="w-full max-w-md">
            <h2 className="text-center font-poppins text-4xl font-bold text-green-700">
              LOGIN ADMINISTRADOR
            </h2>

            <form className="mt-10 space-y-6" onSubmit={handleSubmit}>
              {/* Campo Usuário */}
              <div>
                <label className="block font-poppins font-medium text-gray-700">
                  Nome de Usuário
                </label>
                <div className="mt-2 flex items-center rounded-lg border bg-gray-100 px-4 py-3">
                  <User className="h-6 w-6 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Usuário"
                    className="w-3/4 bg-transparent px-3 text-base outline-none"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
              </div>

              {/* Campo Senha */}
              <div>
                <label className="block font-poppins font-medium text-gray-700">
                  Senha
                </label>
                <div className="mt-2 flex items-center rounded-lg border bg-gray-100 px-4 py-3">
                  <Lock className="h-6 w-6 text-gray-500" />
                  <input
                    type="password"
                    placeholder="Senha"
                    className="w-3/4 bg-transparent px-3 text-base outline-none"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              {error && <p className="text-red-500 text-center">{error}</p>}

              {/* Botão Acessar */}
              <button
                type="submit"
                className="mt-6 w-full flex items-center justify-center rounded-lg bg-green-500 py-3 text-lg font-semibold text-white transition hover:bg-green-600"
                disabled={loading}
              >
                {loading ? <Loader className="h-6 w-6 animate-spin" /> : 'ACESSAR'}
              </button>

              {/* Link Esqueci a Senha */}
              <p className="mt-6 text-center text-sm text-gray-600">
                Esqueceu sua senha?{' '}
                <Link href='/' className="font-semibold text-blue-600">Recuperar</Link> 
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
