'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Loader2, UserPlus, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function SignupPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [role, setRole] = useState<'manager' | 'technician'>('technician')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)
    const router = useRouter()
    const supabase = createClient()

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            const { error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    emailRedirectTo: `${location.origin}/auth/callback`,
                    data: {
                        role: role
                    }
                },
            })

            if (error) throw error

            setSuccess(true)
            // Optional: redirect to login after a delay
            setTimeout(() => {
                router.push('/login')
            }, 5000)
        } catch (err: any) {
            setError(err.message)
            setLoading(false)
        }
    }

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--bg)' }}>
                <div className="w-full max-w-md border rounded-2xl shadow-2xl p-8 text-center animation-fade-in" style={{
                    background: 'var(--bg-secondary)',
                    borderColor: 'var(--border)'
                }}>
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 bg-green-500/10 text-green-500">
                        <UserPlus className="w-8 h-8" />
                    </div>
                    <h1 className="text-2xl font-bold mb-4" style={{ color: 'var(--text)' }}>
                        Compte créé !
                    </h1>
                    <p className="mb-6" style={{ color: 'var(--text-light)' }}>
                        Vérifiez votre email pour le lien de confirmation avant de vous connecter.
                    </p>
                    <Link
                        href="/login"
                        className="inline-flex items-center gap-2 text-sm font-medium hover:underline"
                        style={{ color: 'var(--accent)' }}
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Retour à la page de connexion
                    </Link>
                </div>
            </div>
        )
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
                        <UserPlus className="w-8 h-8" />
                    </div>
                    <h1 className="text-4xl font-bold mb-2" style={{ color: 'var(--text)' }}>
                        Inscription
                    </h1>
                    <p style={{ color: 'var(--text-light)' }}>
                        Créez votre compte GMAO Dashboard
                    </p>
                </div>

                <form onSubmit={handleSignUp} className="space-y-5">
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

                    <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text)' }}>
                            Rôle souhaité
                        </label>
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value as 'manager' | 'technician')}
                            className="w-full p-3 rounded-lg outline-none transition-all cursor-pointer"
                            style={{
                                background: 'var(--bg)',
                                color: 'var(--text)',
                                border: '1px solid var(--border)'
                            }}
                        >
                            <option value="technician">Technicien</option>
                            <option value="manager">Manager</option>
                        </select>
                        <ul className="mt-2 text-[10px] space-y-1 opacity-70" style={{ color: 'var(--text-light)' }}>
                            <li>• <b>Manager</b>: Vue complète, KPIs, Gestion des tâches.</li>
                            <li>• <b>Technicien</b>: Liste de tâches et Assistant IA uniquement.</li>
                        </ul>
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
                                    <UserPlus className="w-5 h-5" />
                                    S'inscrire
                                </>
                            )}
                        </button>
                    </div>
                </form>

                <div className="mt-8 text-center">
                    <p style={{ color: 'var(--text-light)' }} className="text-sm">
                        Déjà un compte ?{' '}
                        <Link
                            href="/login"
                            className="font-semibold hover:underline"
                            style={{ color: 'var(--accent)' }}
                        >
                            Connectez-vous
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
