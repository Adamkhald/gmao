'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Loader2, LogIn } from 'lucide-react'
import Link from 'next/link'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()
    const supabase = createClient()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            })

            if (error) throw error

            // Force a hard redirect to ensure middleware picks up the session
            window.location.href = '/'
        } catch (err: any) {
            setError(err.message)
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--bg)' }}>
            <div className="w-full max-w-md border rounded-2xl shadow-2xl p-8 animation-fade-in" style={{
                background: 'var(--bg-secondary)',
                borderColor: 'var(--border)'
            }}>
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{
                        background: 'var(--accent)',
                        color: 'white'
                    }}>
                        <LogIn className="w-8 h-8" />
                    </div>
                    <h1 className="text-4xl font-bold mb-2" style={{ color: 'var(--text)' }}>
                        GMAO Dashboard
                    </h1>
                    <p style={{ color: 'var(--text-light)' }}>
                        Connectez-vous pour accéder au système de gestion de maintenance
                    </p>
                </div>

                <form onSubmit={handleLogin} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text)' }}>
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-3 rounded-lg outline-none transition-all"
                            style={{
                                background: 'var(--bg)',
                                color: 'var(--text)',
                                border: '1px solid var(--border)'
                            }}
                            placeholder="votre@email.com"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text)' }}>
                            Mot de passe
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-3 rounded-lg outline-none transition-all"
                            style={{
                                background: 'var(--bg)',
                                color: 'var(--text)',
                                border: '1px solid var(--border)'
                            }}
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    {error && (
                        <div className="p-3 rounded-lg text-sm font-medium" style={{
                            background: 'rgba(239, 68, 68, 0.1)',
                            border: '1px solid rgba(239, 68, 68, 0.2)',
                            color: 'var(--danger)'
                        }}>
                            {error}
                        </div>
                    )}

                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full p-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
                            style={{
                                background: loading ? 'var(--text-light)' : 'var(--accent)',
                                color: 'white',
                                cursor: loading ? 'not-allowed' : 'pointer'
                            }}
                        >
                            {loading ? (
                                <Loader2 className="animate-spin w-5 h-5" />
                            ) : (
                                <>
                                    <LogIn className="w-5 h-5" />
                                    Se connecter
                                </>
                            )}
                        </button>
                    </div>
                </form>

                <div className="mt-8 text-center text-sm">
                    <p style={{ color: 'var(--text-light)' }}>
                        Pas encore de compte ?{' '}
                        <Link
                            href="/signup"
                            className="font-semibold hover:underline"
                            style={{ color: 'var(--accent)' }}
                        >
                            Créer un compte
                        </Link>
                    </p>
                </div>

                <div className="mt-6 text-center text-[10px]" style={{ color: 'var(--text-light)' }}>
                    <p className="opacity-50">GMAO Dashboard v1.0</p>
                </div>
            </div>
        </div>
    )
}
