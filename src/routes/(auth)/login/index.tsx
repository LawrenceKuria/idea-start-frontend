import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { loginUser } from '@/api/auth'
import { useAuth } from '@/context/AuthContext'

export const Route = createFileRoute('/(auth)/login/')({
  component: LoginPage,
})

function LoginPage() {
    const navigate = useNavigate()
    const { setAccessToken, setUser } = useAuth()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    
    const { mutateAsync, isPending } = useMutation({
            mutationFn: loginUser,
            onSuccess: (data) => {
                setAccessToken(data.accessToken)
                setUser(data.user)
                navigate({to: '/ideas'})
            },
            onError: (error: any) => {
                setError(error.message)
            }
        })
    
        const handleSubmit = async (e: React.FormEvent) => {
            e.preventDefault()
            try {
                await mutateAsync({ email, password})
            } catch (error: any) {
               console.log(error.message); 
            }
        }

    return ( 
    <div className="flex justify-center py-12">
          <div className="bg-gray-100 rounded-2xl p-8 shadow-sm w-full max-w-md">
            <h1 className="text-3xl font-extrabold text-gray-700 mb-6">
              Login
            </h1>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-black font-medium mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="
                    w-full border border-gray-300
                    rounded-lg px-4 py-2 text-black
                    focus:outline-none focus:ring-2 focus:ring-gray-500
                    focus:border-transparent
                  "
                />
              </div>
              <div>
                <label className="block text-black font-medium mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  className="
                    w-full border border-gray-300
                    rounded-lg px-4 py-2 text-black
                    focus:outline-none focus:ring-2 focus:ring-gray-500
                    focus:border-transparent
                  "
                />
              </div>
              {error && (
                <p className="text-red-500 text-sm">
                  {error}
                </p>
              )}
              <button
                disabled={isPending}
                type="submit"
                className="
                  w-full bg-blue-600 hover:bg-blue-700
                  text-white font-medium
                  px-4 py-2 rounded-lg shadow cursor-pointer
                  transition
                "
              >
                {isPending ? 'Logging in...' : 'Log in'}
              </button>
            </form>
    
            <p className="mt-6 text-center text-gray-600">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="text-blue-600 hover:underline font-medium"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
   )
}
