import React from 'react'
import { useFormContext } from 'react-hook-form'

interface InputProps {
  label: string
  name: string
  placeholder: string
  type?: string
  step?: string
  required?: boolean
  disabled?: boolean
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void
}

const InputForm: React.FC<InputProps> = ({
  label,
  name,
  placeholder,
  type = 'text',
  step,
  required = true,
  disabled = false,
  onFocus,
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
        step={step}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full rounded-md bg-gray-100 p-2 outline-none focus:ring-2 focus:ring-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
        onFocus={onFocus}
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
