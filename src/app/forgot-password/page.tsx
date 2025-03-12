/* eslint-disable prettier/prettier */
// Create the ForgotPassword component with the basic layout

import Image from "next/image";
// import Link from "next/link";

export default function ForgotPassword() {
  return (
    <div className="h-screen bg-gradient-to-br from-green-400 to-blue-400 flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 mb-4">
            <Image
              src="/paw-icon.png"
              alt="Paw icon"
              width={64}
              height={64}
              className="object-contain"
            />
          </div>
          <h2 className="text-2xl text-gray-600 font-semibold mb-2">
            Redefinição de senha
          </h2>
          <p className="text-gray-600 text-center mb-6">
            Digite seu e-mail para que possamos te enviar uma nova senha
          </p>
        </div>
        <form className="w-full">
          <label className="block mb-2 text-gray-700">Email</label>
          <div className="relative mb-6">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-700">
              📧
            </span>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full pl-10 p-3 border rounded-lg outline-none focus:ring-2 focus:ring-green-400 text-gray-700"
              required
            />
          </div>
        </form>
      </div>
    </div>
  );
}
