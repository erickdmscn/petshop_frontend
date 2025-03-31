import React from 'react'
import { useFormContext } from 'react-hook-form'

interface InputProps {
  label: string
  name: string
  placeholder: string
  type?: string
  required?: boolean
}

const InputForm: React.FC<InputProps> = ({
  label,
  name,
  placeholder,
  type = 'text',
  required = true,
}) => {
  const {
    register,
    formState: { errors },
  } = useFormContext()

  return (
    <div className="space-y-2">
      <label htmlFor={name} className="block text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        id={name}
        type={type}
        placeholder={placeholder}
        className="w-full rounded-md bg-gray-100 p-2 outline-none focus:ring-2 focus:ring-emerald-400"
        {...register(name)}
      />
      {errors[name] && (
        <p className="text-sm text-red-500">
          {errors[name]?.message as string}
        </p>
      )}
    </div>
  )
}

export default InputForm
