import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Dashboard({ stats = [], priorities = [], workload = [] }) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    WorkHub Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl space-y-8 px-4 sm:px-6 lg:px-8">
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                        {stats.map((item) => (
                            <div
                                key={item.label}
                                className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
                            >
                                <div className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${item.tone}`}>
                                    {item.label}
                                </div>
                                <div className="mt-4 text-3xl font-bold text-slate-900">
                                    {item.value}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-end">
                        <Link
                            href={route('projects.index')}
                            className="inline-flex items-center rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-slate-700"
                        >
                            View Projects
                        </Link>
                    </div>

                    <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
                        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                            <div className="mb-5 flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-slate-900">
                                    Priority tasks
                                </h3>
                                <span className="text-sm text-slate-500">
                                    This week
                                </span>
                            </div>

                            <div className="space-y-4">
                                {priorities.length > 0 ? (
                                    priorities.map((task) => (
                                        <div
                                            key={task.title}
                                            className="flex items-center justify-between rounded-lg border border-slate-200 p-4"
                                        >
                                            <div>
                                                <div className="font-medium text-slate-800">
                                                    {task.title}
                                                </div>
                                                <div className="mt-1 text-sm text-slate-500">
                                                    Owner: {task.owner}
                                                </div>
                                            </div>
                                            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                                                {task.due}
                                            </span>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-slate-500">No active tasks yet.</p>
                                )}
                            </div>
                        </div>

                        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                            <div className="mb-5 flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-slate-900">
                                    Team workload
                                </h3>
                                <span className="text-sm text-slate-500">
                                    Active assignments
                                </span>
                            </div>

                            <div className="space-y-4">
                                {workload.length > 0 ? (
                                    workload.map((member) => (
                                        <div key={member.id} className="space-y-1">
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="font-medium text-slate-700">{member.name}</span>
                                                <span className="text-slate-500">{member.tasks} tasks</span>
                                            </div>
                                            <div className="h-2.5 w-full rounded-full bg-slate-200">
                                                <div
                                                    className="h-2.5 rounded-full bg-emerald-500"
                                                    style={{ width: `${Math.min(member.tasks * 25, 100)}%` }}
                                                />
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-slate-500">No team workload yet.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
