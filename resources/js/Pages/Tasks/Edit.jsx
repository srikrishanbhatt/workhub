import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Edit({ task, users = [] }) {
    const { data, setData, put, processing, errors } = useForm({
        title: task.title || '',
        status: task.status || 'todo',
        priority: task.priority || 'medium',
        description: task.description || '',
        assignee_id: task.assignee_id ?? '',
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('tasks.update', task.id));
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-semibold leading-tight text-gray-800">
                            Edit task
                        </h2>
                        <p className="mt-1 text-sm text-slate-500">Task #{task.id}</p>
                    </div>
                    <Link
                        href={route('tasks.show', task.id)}
                        className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                    >
                        Back to task
                    </Link>
                </div>
            }
        >
            <Head title="Edit task" />

            <div className="py-12">
                <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
                    <form
                        onSubmit={submit}
                        className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
                    >
                        <div className="space-y-6">
                            <div>
                                <label htmlFor="title" className="mb-2 block text-sm font-medium text-slate-700">
                                    Task title
                                </label>
                                <input
                                    id="title"
                                    type="text"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    className="w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                />
                                {errors.title && (
                                    <div className="mt-2 text-sm text-red-600">{errors.title}</div>
                                )}
                            </div>

                            <div className="grid gap-6 md:grid-cols-2">
                                <div>
                                    <label htmlFor="assignee_id" className="mb-2 block text-sm font-medium text-slate-700">
                                        Assignee
                                    </label>
                                    <select
                                        id="assignee_id"
                                        value={data.assignee_id}
                                        onChange={(e) => setData('assignee_id', e.target.value)}
                                        className="w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    >
                                        {users.map((user) => (
                                            <option key={user.id} value={user.id}>
                                                {user.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="status" className="mb-2 block text-sm font-medium text-slate-700">
                                        Status
                                    </label>
                                    <select
                                        id="status"
                                        value={data.status}
                                        onChange={(e) => setData('status', e.target.value)}
                                        className="w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    >
                                        <option value="todo">Todo</option>
                                        <option value="in progress">In progress</option>
                                        <option value="review">Review</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid gap-6 md:grid-cols-2">
                                <div>
                                    <label htmlFor="priority" className="mb-2 block text-sm font-medium text-slate-700">
                                        Priority
                                    </label>
                                    <select
                                        id="priority"
                                        value={data.priority}
                                        onChange={(e) => setData('priority', e.target.value)}
                                        className="w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    >
                                        <option value="low">Low</option>
                                        <option value="medium">Medium</option>
                                        <option value="high">High</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label htmlFor="description" className="mb-2 block text-sm font-medium text-slate-700">
                                    Description
                                </label>
                                <textarea
                                    id="description"
                                    rows="4"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    className="w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                />
                            </div>

                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-50"
                                >
                                    {processing ? 'Saving...' : 'Update task'}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
