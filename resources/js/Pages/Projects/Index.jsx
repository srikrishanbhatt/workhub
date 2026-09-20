import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Index({ projects: projectList = [], users = [], selectedOwnerId = '' }) {
    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between gap-4">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Projects
                    </h2>
                    <Link
                        href={route('projects.create')}
                        className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
                    >
                        New project
                    </Link>
                </div>
            }
        >
            <Head title="Projects" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                            <div className="w-full max-w-xs">
                                <label htmlFor="owner_id" className="mb-2 block text-sm font-medium text-slate-700">
                                    Filter by owner
                                </label>
                                <select
                                    id="owner_id"
                                    value={selectedOwnerId}
                                    onChange={(e) => {
                                        const url = new URL(window.location.href);
                                        if (e.target.value) {
                                            url.searchParams.set('owner_id', e.target.value);
                                        } else {
                                            url.searchParams.delete('owner_id');
                                        }
                                        window.location.href = url.toString();
                                    }}
                                    className="w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                >
                                    <option value="">All owners</option>
                                    {users.map((user) => (
                                        <option key={user.id} value={user.id}>
                                            {user.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {selectedOwnerId && (
                                <Link
                                    href={route('projects.index')}
                                    className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                                >
                                    Clear filter
                                </Link>
                            )}
                        </div>
                    </div>

                    {projectList.length === 0 ? (
                        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
                            <h3 className="text-lg font-semibold text-slate-900">No projects yet</h3>
                            <p className="mt-2 text-sm text-slate-500">
                                Create your first project to start tracking work.
                            </p>
                            <Link
                                href={route('projects.create')}
                                className="mt-6 inline-flex rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
                            >
                                New project
                            </Link>
                        </div>
                    ) : (
                        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-slate-200">
                                    <thead className="bg-slate-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                                                Project
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                                                Owner
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                                                Status
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                                                Updated
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200 bg-white">
                                        {projectList.map((project) => (
                                            <tr key={project.id} className="hover:bg-slate-50">
                                                <td className="px-6 py-4 text-sm font-medium text-slate-900">
                                                    <Link
                                                        href={route('projects.show', project.id)}
                                                        className="text-slate-900 hover:text-slate-600"
                                                    >
                                                        {project.name}
                                                    </Link>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-slate-600">
                                                    {project.owner}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-slate-600">
                                                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                                                        {project.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-slate-500">
                                                    {project.updated_at}
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
