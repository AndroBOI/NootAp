import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'


export default function Register() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        console.log('Registering with:', formData)
        // TODO: Add your backend call here
    }

    return (
  <div className="flex justify-center items-center min-h-screen bg-background">
    <div className="max-w-md w-full p-6 border rounded-2xl shadow-md bg-white dark:bg-gray-900">
      <h2 className="text-2xl font-semibold mb-6 text-center">Register</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name Field */}
        <div className="flex flex-col space-y-2">
          <Label htmlFor="name" className="mb-5">Name</Label>
          <Input id="name" name="name" value={formData.name} onChange={handleChange} />
        </div>

        {/* Email Field */}
        <div className="flex flex-col space-y-2">
          <Label htmlFor="email" className="mb-5">Email</Label>
          <Input type="email" id="email" name="email" value={formData.email} onChange={handleChange} />
        </div>

        {/* Password Field */}
        <div className="flex flex-col space-y-2">
          <Label htmlFor="password" className="mb-5">Password</Label>
          <Input type="password" id="password" name="password" value={formData.password} onChange={handleChange} />
        </div>

        {/* Submit Button */}
        <Button type="submit" className="w-full mt-2">Create Account</Button>

        {/* Login Link */}
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
