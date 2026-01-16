'use client';

import { useEffect, useState } from 'react';
import { Member } from '@/lib/db';
import Link from 'next/link';

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMembers = async () => {
    setLoading(true);
    try {
        const res = await fetch('/api/admin/members', { cache: 'no-store' });
        const data = await res.json();
        setMembers(data.members || []);
    } catch (e) {
        console.error(e);
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleAction = async (memberId: string, status: 'APPROVED' | 'REJECTED') => {
      // Optimistic
      setMembers(prev => prev.map(m => m.id === memberId ? { ...m, status } : m));

      await fetch('/api/admin/members/action', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ memberId, status })
      });
      fetchMembers();
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-white p-8 font-mono">
        <div className="flex justify-between items-center mb-8 border-b border-white/20 pb-4 max-w-7xl mx-auto">
            <div className="flex items-center gap-4">
                <Link href="/admin" className="text-gray-400 hover:text-white">&larr; Back</Link>
                <h1 className="text-4xl font-bold uppercase text-[#facc15]">Member List</h1>
            </div>
            <button onClick={fetchMembers} className="px-4 py-2 border border-white hover:bg-white hover:text-black transition-colors">
                REFRESH
            </button>
        </div>

        <div className="max-w-7xl mx-auto">
            <div className="bg-black border border-white/20 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-white/10 uppercase text-xs font-bold">
                        <tr>
                            <th className="p-4">Name / Email</th>
                            <th className="p-4">ID Number</th>
                            <th className="p-4">Joined</th>
                            <th className="p-4">Spent</th>
                            <th className="p-4">Status</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                        {loading ? (
                            <tr><td colSpan={6} className="p-8 text-center animate-pulse">Scanning database...</td></tr>
                        ) : members.map(member => (
                            <tr key={member.id} className="hover:bg-white/5 transition-colors">
                                <td className="p-4">
                                    <div className="font-bold text-[#facc15]">{member.fullName}</div>
                                    <div className="text-xs text-gray-500">{member.email}</div>
                                </td>
                                <td className="p-4 font-mono">{member.idNumber}</td>
                                <td className="p-4 text-sm text-gray-400">{new Date(member.joinedAt).toLocaleDateString()}</td>
                                <td className="p-4 font-bold">R{member.totalSpent}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 text-xs font-bold border ${
                                        member.status === 'APPROVED' ? 'text-green-500 border-green-500' :
                                        member.status === 'REJECTED' ? 'text-red-500 border-red-500' :
                                        'text-orange-500 border-orange-500'
                                    }`}>
                                        {member.status}
                                    </span>
                                </td>
                                <td className="p-4 text-right space-x-2">
                                    {member.status !== 'APPROVED' && (
                                        <button onClick={() => handleAction(member.id, 'APPROVED')} className="text-xs bg-green-900 text-green-300 px-2 py-1 hover:bg-green-800">
                                            APPROVE
                                        </button>
                                    )}
                                    {member.status !== 'REJECTED' && (
                                        <button onClick={() => handleAction(member.id, 'REJECTED')} className="text-xs bg-red-900 text-red-300 px-2 py-1 hover:bg-red-800">
                                            BAN
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {!loading && members.length === 0 && (
                     <div className="p-8 text-center text-gray-500">No members found.</div>
                )}
            </div>
        </div>
    </div>
  );
}
