import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

const statusStyles = {
    'In progress': 'bg-blue-100 text-blue-700',
    Todo: 'bg-slate-100 text-slate-700',
    Review: 'bg-amber-100 text-amber-700',
};

const priorityStyles = {
    High: 'bg-rose-100 text-rose-700',
    Medium: 'bg-violet-100 text-violet-700',
    Low: 'bg-emerald-100 text-emerald-700',
};

export default function Show({ task }) {
    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-semibold leading-tight text-gray-800">
                            {task.title}
                        </h2>
                        <p className="mt-1 text-sm text-slate-500">
                            Project: {task.project}
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link
                            href={route('tasks.edit', task.id)}
                            className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
                        >
                            Edit task
                        </Link>
                        <button
                            type="button"
                            onClick={() => {
                                if (confirm('Delete this task?')) {
                                    window.location.href = route('tasks.destroy', task.id);
                                }
                            }}
                            className="rounded-md border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-100"
                        >
                            Delete task
                        </button>
                        <Link
                            href={route('projects.show', task.project_id)}
                            className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                        >
                            Back to project
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title={task.title} />

            <div className="py-12">
                <div className="mx-auto max-w-4xl space-y-6 px-4 sm:px-6 lg:px-8">
                    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="flex flex-wrap items-center gap-3">
                            <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles[task.status] || 'bg-slate-100 text-slate-700'}`}>
                                {task.status}
                            </span>
                            <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${priorityStyles[task.priority] || 'bg-slate-100 text-slate-700'}`}>
                                {task.priority}
                            </span>
                        </div>

                        <dl className="mt-6 grid gap-4 sm:grid-cols-2">
                            <div className="rounded-lg bg-slate-50 p-4">
                                <dt className="text-sm text-slate-500">Assignee</dt>
                                <dd className="mt-1 font-medium text-slate-900">
                                    {task.assignee}
                                </dd>
                            </div>
                            <div className="rounded-lg bg-slate-50 p-4">
                                <dt className="text-sm text-slate-500">Task ID</dt>
                                <dd className="mt-1 font-medium text-slate-900">
                                    #{task.id}
                                </dd>
                            </div>
                        </dl>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                        <h3 className="text-lg font-semibold text-slate-900">Description</h3>
                        <p className="mt-4 text-base leading-7 text-slate-600">
                            {task.description}
                        </p>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
