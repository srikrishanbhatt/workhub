import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Index({ tasks = [], users = [], selectedAssigneeId = '' }) {
    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between gap-4">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Tasks
                    </h2>
                </div>
            }
        >
            <Head title="Tasks" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                            <div className="w-full max-w-xs">
                                <label htmlFor="assignee_id" className="mb-2 block text-sm font-medium text-slate-700">
                                    Filter by assignee
                                </label>
                                <select
                                    id="assignee_id"
                                    value={selectedAssigneeId}
                                    onChange={(e) => {
                                        const url = new URL(window.location.href);
                                        if (e.target.value) {
                                            url.searchParams.set('assignee_id', e.target.value);
                                        } else {
                                            url.searchParams.delete('assignee_id');
                                        }
                                        window.location.href = url.toString();
                                    }}
                                    className="w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                >
                                    <option value="">All assignees</option>
                                    {users.map((user) => (
                                        <option key={user.id} value={user.id}>
                                            {user.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {selectedAssigneeId && (
                                <Link
                                    href={route('tasks.index')}
                                    className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                                >
                                    Clear filter
                                </Link>
                            )}
                        </div>
                    </div>

                    {tasks.length === 0 ? (
                        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
                            <h3 className="text-lg font-semibold text-slate-900">No tasks found</h3>
                            <p className="mt-2 text-sm text-slate-500">
                                No tasks match the current assignee filter.
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-slate-200">
                                    <thead className="bg-slate-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                                                Task
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                                                Project
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                                                Assignee
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                                                Status
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                                                Priority
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                                                Updated
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200 bg-white">
                                        {tasks.map((task) => (
                                            <tr key={task.id} className="hover:bg-slate-50">
                                                <td className="px-6 py-4 text-sm font-medium text-slate-900">
                                                    <Link
                                                        href={route('tasks.show', task.id)}
                                                        className="text-slate-900 hover:text-slate-600"
                                                    >
                                                        {task.title}
                                                    </Link>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-slate-600">
                                                    {task.project}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-slate-600">
                                                    {task.assignee}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-slate-600">
                                                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                                                        {task.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-slate-600">
                                                    {task.priority}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-slate-500">
                                                    {task.updated_at}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
