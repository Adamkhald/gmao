'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

type UserRole = 'manager' | 'technician' | null

interface UserContextType {
    user: any | null
    role: UserRole
    loading: boolean
    signOut: () => Promise<void>
}

const UserContext = createContext<UserContextType>({
    user: null,
    role: null,
    loading: true,
    signOut: async () => {},
})

export function UserProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<any | null>(null)
    const [role, setRole] = useState<UserRole>(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter()
    const supabase = createClient()

    useEffect(() => {
        const fetchUserAndRole = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser()
                setUser(user)

                if (user) {
                    const { data: profile } = await supabase
                        .from('profiles')
                        .select('role')
                        .eq('id', user.id)
                        .single()
                    
                    setRole(profile?.role || 'technician')
                }
            } catch (error) {
                console.error('Error fetching user:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchUserAndRole()

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === 'SIGNED_OUT') {
                setUser(null)
                setRole(null)
                router.push('/login')
            } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
                 // Re-fetch to ensure role is up to date
                 fetchUserAndRole()
            }
        })

        return () => {
            subscription.unsubscribe()
        }
    }, [router, supabase])

    const signOut = async () => {
        await supabase.auth.signOut()
        router.push('/login')
    }

    return (
        <UserContext.Provider value={{ user, role, loading, signOut }}>
            {children}
        </UserContext.Provider>
    )
}

export const useUser = () => useContext(UserContext)
