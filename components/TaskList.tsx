'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Task } from '@/types'
import { CheckCircle, Clock, AlertCircle } from 'lucide-react'

export default function TaskList() {
    const [tasks, setTasks] = useState<Task[]>([])
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    const fetchTasks = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return

            const { data, error } = await supabase
                .from('tasks')
                .select('*')
                .eq('assigned_to', user.id)
                .order('created_at', { ascending: false })

            if (data) setTasks(data)
        } catch (error) {
            console.error('Error fetching tasks:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchTasks()

        const channel = supabase
            .channel('my_tasks')
            .on('postgres_changes',
                { event: '*', schema: 'public', table: 'tasks' },
                () => fetchTasks()
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [])

    const updateStatus = async (taskId: string, newStatus: Task['status']) => {
        const { error } = await supabase
            .from('tasks')
            .update({ status: newStatus })
            .eq('id', taskId)

        if (!error) {
            setTasks(tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t))
        }
    }

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high': return 'text-red-500 bg-red-100 border-red-200'
            case 'medium': return 'text-yellow-600 bg-yellow-100 border-yellow-200'
            case 'low': return 'text-green-600 bg-green-100 border-green-200'
            default: return 'text-gray-500 bg-gray-100 border-gray-200'
        }
    }

    if (loading) return <div className="p-8 text-center text-[var(--text-light)]">Chargement de vos tâches...</div>

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-[var(--text)]">Mes Tâches Assignées</h2>

            {tasks.length === 0 ? (
                <div className="text-center p-12 border-2 border-dashed rounded-xl border-[var(--border)]">
                    <CheckCircle className="w-12 h-12 mx-auto text-[var(--text-light)] mb-4" />
                    <p className="text-[var(--text-light)]">Aucune tâche en attente. Tout est sous contrôle !</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {tasks.map((task) => (
                        <div key={task.id} className="p-6 rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] hover:shadow-lg transition-all">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-xl font-semibold text-[var(--text)]">{task.title}</h3>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(task.priority)}`}>
                                            {task.priority.toUpperCase()}
                                        </span>
                                    </div>
                                    <p className="text-[var(--text-light)]">{task.description}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    {task.status === 'pending' && (
                                        <button
                                            onClick={() => updateStatus(task.id, 'in_progress')}
                                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                                        >
                                            <Clock className="w-4 h-4" /> Commencer
                                        </button>
                                    )}
                                    {task.status === 'in_progress' && (
                                        <button
                                            onClick={() => updateStatus(task.id, 'completed')}
                                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors"
                                        >
                                            <CheckCircle className="w-4 h-4" /> Terminer
                                        </button>
                                    )}
                                    {task.status === 'completed' && (
                                        <span className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-100 text-green-700 font-medium">
                                            <CheckCircle className="w-4 h-4" /> Fait
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="text-sm text-[var(--text-light)] flex items-center gap-4">
                                <span>📅 Échéance : {new Date(task.due_date).toLocaleDateString()}</span>
                                <span>🆔 {task.id.slice(0, 8)}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
