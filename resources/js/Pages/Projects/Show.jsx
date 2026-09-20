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

export default function Show({ project }) {
    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-semibold leading-tight text-gray-800">
                            {project.name}
                        </h2>
                        <p className="mt-1 text-sm text-slate-500">
                            owned by {project.owner}
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link
                            href={route('projects.edit', project.id)}
                            className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
                        >
                            Edit project
                        </Link>
                        <button
                            type="button"
                            onClick={() => {
                                if (confirm('Delete this project?')) {
                                    window.location.href = route('projects.destroy', project.id);
                                }
                            }}
                            className="rounded-md border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-100"
                        >
                            Delete project
                        </button>
                        <Link
                            href={route('projects.index')}
                            className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                        >
                            Back to projects
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title={project.name} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl space-y-6 px-4 sm:px-6 lg:px-8">
                    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="flex flex-wrap items-center gap-3">
                            <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles[project.status] || 'bg-slate-100 text-slate-700'}`}>
                                {project.status}
                            </span>
                            <span className="text-sm text-slate-500">Last updated 2 hours ago</span>
                        </div>

                        <p className="mt-5 max-w-2xl text-base text-slate-600">
                            {project.summary}
                        </p>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="mb-5 flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-slate-900">
                                Tasks
                            </h3>
                            <div className="flex items-center gap-3">
                                <span className="text-sm text-slate-500">
                                    {project.tasks.length} items
                                </span>
                                <Link
                                    href={route('tasks.create', project.id)}
                                    className="rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-700"
                                >
                                    Add task
                                </Link>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {project.tasks.map((task) => (
                                <div
                                    key={task.id}
                                    className="flex flex-col gap-3 rounded-lg border border-slate-200 p-4 md:flex-row md:items-center md:justify-between"
                                >
                                    <div>
                                        <Link
                                            href={route('tasks.show', task.id)}
                                            className="font-medium text-slate-800 hover:text-slate-600"
                                        >
                                            {task.title}
                                        </Link>
                                        <div className="mt-1 text-sm text-slate-500">
                                            Task #{task.id}
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${priorityStyles[task.priority] || 'bg-slate-100 text-slate-700'}`}>
                                            {task.priority}
                                        </span>
                                        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles[task.status] || 'bg-slate-100 text-slate-700'}`}>
                                            {task.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
