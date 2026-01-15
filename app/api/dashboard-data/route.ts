import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { loadAllData } from '@/lib/dataLoader'

export async function GET() {
    const cookieStore = cookies()
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return cookieStore.get(name)?.value
                },
            },
        }
    )

    try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Check if user is a manager
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single()

        if (profile?.role !== 'manager') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

        const data = await loadAllData()
        return NextResponse.json(data)
    } catch (error) {
        console.error('API Error:', error)
        return NextResponse.json({ error: 'Failed to load data' }, { status: 500 })
    }
}
