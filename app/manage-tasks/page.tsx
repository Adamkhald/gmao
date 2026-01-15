'use client'

import TaskBoard from "@/components/TaskBoard";
import { useUser } from "@/components/UserProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function ManageTasksPage() {
    const { role, loading } = useUser();
    const router = useRouter();

    useEffect(() => {
        if (!loading && role !== 'manager') {
            router.push('/');
        }
    }, [role, loading, router]);

    if (loading || role !== 'manager') {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <Loader2 className="w-12 h-12 text-[var(--accent)] animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-[1400px] mx-auto px-8 py-8">
            <div className="mb-8">
                <h1 className="text-4xl font-bold mb-2">Gestion des Interventions</h1>
                <p className="text-[var(--text-light)]">
                    Assignez des tâches aux techniciens et suivez l'avancement en temps réel.
                </p>
            </div>

            <TaskBoard />
        </div>
    );
}
