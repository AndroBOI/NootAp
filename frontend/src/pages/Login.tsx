import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import {
  Link, useNavigate
} from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import axios from 'axios'
type Errors = {
  email?: string,
  password?: string
}


export default function Login() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const [errors, setErrors] = useState<Errors>({})
  const [showPassword, setShowPassword] = useState(false)


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setErrors(prev => ({ ...prev, [e.target.name]: undefined }))
  }

  const togglePassword = () => {
    setShowPassword(!showPassword)
  }


  const check = () => {
    const newErrors: Errors = {}
    if (!formData.email.trim()) newErrors.email = "Email is required"
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

    try {
      const response = await axios.post('http://localhost:5000/app/login', formData);
      const userId = response.data.user._id;
      if (response.status === 200) {
        alert('Login successful!');
        navigate('/dashboard', { state: { userId } });
      }
    } catch (error: any) {
      if (error.response) {
        setErrors({ password: error.response.data.message });
      } else {
        alert('Server error or network issue.');
      }
      console.error('Login error:', error);
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-background">
      <div className="max-w-md w-full p-6 border rounded-2xl shadow-md bg-white dark:bg-gray-900">
        <h2 className="text-2xl font-semibold mb-6 text-center">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Email Field */}
          <div className="flex flex-col space-y-2">
            <Label htmlFor="email" className="mb-5">Email</Label>
            <Input className={errors.email ? 'border-red-500 focus:ring-red-500' : ''} type="email" id="email" name="email" value={formData.email} onChange={handleChange} />
          </div>
          {errors.email && <p className="text-red-600 text-xs mt-5">{errors.email}</p>}

          {/* Password Field */}

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
          </div>
          {errors.password && <p className="text-red-600 text-xs mt-5">{errors.password}</p>}

          {/* Submit Button */}
          <Button type="submit" className="w-full mt-2">Login</Button>

          {/* Login Link */}
          <div className="mt-4 flex justify-center">
            <Link
              to="/"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Dont have an account? Register
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
