'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Task } from '@/types'
import { Plus, Trash2, User } from 'lucide-react'

export default function TaskBoard() {
    const [tasks, setTasks] = useState<Task[]>([])
    const [technicians, setTechnicians] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [newTask, setNewTask] = useState({
        title: '',
        description: '',
        assigned_to: '',
        priority: 'medium',
        due_date: ''
    })

    const supabase = createClient()

    useEffect(() => {
        fetchData()

        const channel = supabase
            .channel('all_tasks')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks' }, () => fetchData())
            .subscribe()

        return () => { supabase.removeChannel(channel) }
    }, [])

    const fetchData = async () => {
        // Fetch technicians
        const { data: techData } = await supabase
            .from('profiles')
            .select('id, email')
            .eq('role', 'technician')

        if (techData) setTechnicians(techData)

        // Fetch tasks
        const { data: taskData } = await supabase
            .from('tasks')
            .select('*, assignee:profiles!assigned_to(email)')
            .order('created_at', { ascending: false })

        if (taskData) setTasks(taskData)
        setLoading(false)
    }

    const handleCreateTask = async (e: React.FormEvent) => {
        e.preventDefault()
        const { data: { user } } = await supabase.auth.getUser()

        const { error } = await supabase.from('tasks').insert({
            ...newTask,
            created_by: user?.id,
            status: 'pending'
        })

        if (!error) {
            setShowForm(false)
            setNewTask({ title: '', description: '', assigned_to: '', priority: 'medium', due_date: '' })
        }
    }

    const handleDelete = async (id: string) => {
        if (confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?')) {
            await supabase.from('tasks').delete().eq('id', id)
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-[var(--text)]">Gestion des Tâches</h2>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--accent)] text-white hover:opacity-90 transition-opacity"
                >
                    <Plus className="w-5 h-5" /> Nouvelle Tâche
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleCreateTask} className="p-6 rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] mb-6 animation-fade-in">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <input
                            type="text"
                            placeholder="Titre de la tâche"
                            className="p-3 rounded-lg border bg-[var(--bg)] text-[var(--text)] w-full"
                            value={newTask.title}
                            onChange={e => setNewTask({ ...newTask, title: e.target.value })}
                            required
                        />
                        <select
                            className="p-3 rounded-lg border bg-[var(--bg)] text-[var(--text)] w-full"
                            value={newTask.assigned_to}
                            onChange={e => setNewTask({ ...newTask, assigned_to: e.target.value })}
                            required
                        >
                            <option value="">Assigner à un technicien...</option>
                            {technicians.map(tech => (
                                <option key={tech.id} value={tech.id}>{tech.email}</option>
                            ))}
                        </select>
                        <select
                            className="p-3 rounded-lg border bg-[var(--bg)] text-[var(--text)] w-full"
                            value={newTask.priority}
                            onChange={e => setNewTask({ ...newTask, priority: e.target.value })}
                        >
                            <option value="low">Priorité Basse</option>
                            <option value="medium">Priorité Moyenne</option>
                            <option value="high">Priorité Haute</option>
                        </select>
                        <input
                            type="date"
                            className="p-3 rounded-lg border bg-[var(--bg)] text-[var(--text)] w-full"
                            value={newTask.due_date}
                            onChange={e => setNewTask({ ...newTask, due_date: e.target.value })}
                            required
                        />
                    </div>
                    <textarea
                        placeholder="Description détaillée..."
                        className="p-3 rounded-lg border bg-[var(--bg)] text-[var(--text)] w-full mb-4 h-24 resize-none"
                        value={newTask.description}
                        onChange={e => setNewTask({ ...newTask, description: e.target.value })}
                        required
                    />
                    <div className="flex justify-end gap-3">
                        <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-[var(--text-light)]">Annuler</button>
                        <button type="submit" className="px-6 py-2 bg-[var(--accent)] text-white rounded-lg">Créer la tâche</button>
                    </div>
                </form>
            )}

            <div className="grid gap-4">
                {tasks.map(task => (
                    <div key={task.id} className="p-4 rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] flex justify-between items-center group">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-1">
                                <h3 className="font-semibold text-[var(--text)]">{task.title}</h3>
                                <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase border ${task.status === 'completed' ? 'bg-green-100 text-green-700 border-green-200' :
                                        task.status === 'in_progress' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                                            'bg-gray-100 text-gray-700 border-gray-200'
                                    }`}>{task.status.replace('_', ' ')}</span>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-[var(--text-light)]">
                                <span className="flex items-center gap-1"><User className="w-3 h-3" /> {task.assignee?.email || 'Non assigné'}</span>
                                <span>📅 {new Date(task.due_date).toLocaleDateString()}</span>
                            </div>
                        </div>
                        <button
                            onClick={() => handleDelete(task.id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}
