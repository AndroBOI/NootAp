import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import axios from 'axios'
import {toast, Toaster} from 'react-hot-toast'
type Errors = {
  name?: string,
  email?: string,
  password?: string
}

export default function Register() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  })

  const [errors, setErrors] = useState<Errors>({})
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const togglePassword = () => {
    setShowPassword(!showPassword)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setErrors(prev => ({ ...prev, [e.target.name]: undefined }))
  }

  const check = () => {
    const newErrors: Errors = {}
    if (!formData.name.trim()) newErrors.name = "Name is required"
    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid"
    }
    if (!formData.password.trim()) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!check()) return

    setLoading(true)
    try {
      const response = await axios.post("http://localhost:5000/app/users", formData)

      if (response.status === 201) {
        toast.success("User registered successfully!")

        // Save token if backend sends it (adjust if your backend sends token)
        if (response.data.token) {
          localStorage.setItem('token', response.data.token)
        }

        // Navigate with user ID from response
        navigate('/dashboard', { state: { userId: response.data._id } })

        setFormData({
          name: "",
          email: "",
          password: ""
        })
      }
    } catch (error: any) {
      if (error.response) {
        toast.error(error.response.data.message || "Registration failed.")
      } else {
        toast.error("Network error or server is down.")
      }
      console.error("Error during registration:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-background">
       <Toaster position="top-right" reverseOrder={false} />
      <div className="max-w-md w-full p-6 border rounded-2xl shadow-md bg-white dark:bg-gray-900">
        <h2 className="text-2xl font-semibold mb-6 text-center">Register</h2>
        <form onSubmit={handleSubmit} className="space-y-6">

          <div className="flex flex-col space-y-2">
            <Label htmlFor="name" className="mb-5">Name</Label>
            <Input
              className={errors.name ? 'border-red-500 focus:ring-red-500' : ''}
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
            {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
          </div>

          <div className="flex flex-col space-y-2">
            <Label htmlFor="email" className="mb-5">Email</Label>
            <Input
              className={errors.email ? 'border-red-500 focus:ring-red-500' : ''}
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
          </div>

          <div className="flex flex-col space-y-2">
            <Label htmlFor="password" className="mb-2">Password</Label>
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`${errors.password ? 'border-red-500 focus:ring-red-500' : ''} pr-10`}
              />

              <button
                type="button"
                onClick={togglePassword}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary"
              >
                {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>
            </div>
            {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password}</p>}
          </div>

          <Button type="submit" className="w-full mt-2" disabled={loading}>
            {loading ? "Registering..." : "Create Account"}
          </Button>

          <div className="mt-4 flex justify-center">
            <Link
              to="/login"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Already have an account? Log in
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
