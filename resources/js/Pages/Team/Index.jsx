import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Index({ team = [] }) {
    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between gap-4">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Team
                    </h2>
                </div>
            }
        >
            <Head title="Team" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-slate-200">
                                <thead className="bg-slate-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                                            Member
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                                            Projects owned
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                                            Tasks assigned
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200 bg-white">
                                    {team.map((member) => (
                                        <tr key={member.id} className="hover:bg-slate-50">
                                            <td className="px-6 py-4 text-sm font-medium text-slate-900">
                                                {member.name}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-600">
                                                {member.projects}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-600">
                                                {member.tasks}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
