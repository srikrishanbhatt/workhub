import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Create({ users = [], defaultOwnerId = null }) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        status: 'planning',
        summary: '',
        owner_id: defaultOwnerId ?? '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('projects.store'));
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between gap-4">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Create project
                    </h2>
                    <Link
                        href={route('projects.index')}
                        className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                    >
                        Back to projects
                    </Link>
                </div>
            }
        >
            <Head title="Create project" />

            <div className="py-12">
                <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
                    <form
                        onSubmit={submit}
                        className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
                    >
                        <div className="space-y-6">
                            <div>
                                <label htmlFor="name" className="mb-2 block text-sm font-medium text-slate-700">
                                    Project name
                                </label>
                                <input
                                    id="name"
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                />
                                {errors.name && (
                                    <div className="mt-2 text-sm text-red-600">{errors.name}</div>
                                )}
                            </div>

                            <div className="grid gap-6 md:grid-cols-2">
                                <div>
                                    <label htmlFor="owner_id" className="mb-2 block text-sm font-medium text-slate-700">
                                        Owner
                                    </label>
                                    <select
                                        id="owner_id"
                                        value={data.owner_id}
                                        onChange={(e) => setData('owner_id', e.target.value)}
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
                                        <option value="planning">Planning</option>
                                        <option value="in progress">In progress</option>
                                        <option value="review">Review</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label htmlFor="summary" className="mb-2 block text-sm font-medium text-slate-700">
                                    Summary
                                </label>
                                <textarea
                                    id="summary"
                                    rows="4"
                                    value={data.summary}
                                    onChange={(e) => setData('summary', e.target.value)}
                                    className="w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                />
                            </div>

                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-50"
                                >
                                    {processing ? 'Saving...' : 'Create project'}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
