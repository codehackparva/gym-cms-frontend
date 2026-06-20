import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { Users, TrendingUp, Calendar, Plus, X, LogOut, Menu, UserCheck } from 'lucide-react'
import API from '../../api/axios'

export default function AdminDashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [activeTab, setActiveTab] = useState('members')
  const [message, setMessage] = useState('')
  const [newMember, setNewMember] = useState({
    full_name: '', email: '', password: '',
    phone: '', weight_kg: '', membership_expirey: ''
  })
  const [checkins, setCheckins] = useState([])
  const [checkinsLoading, setCheckinsLoading] = useState(true)
  const [showRenewForm, setShowRenewForm] = useState(false)
  const [renewingMember, setRenewingMember] = useState(null)
  const [newExpiry, setNewExpiry] = useState('')

  useEffect(() => { fetchMembers(); fetchCheckins() }, [])

  const fetchMembers = async () => {
    try {
      const res = await API.get('/admin/members')
      setMembers(res.data)
      setLoading(false)
    } catch (err) {
      setLoading(false)
    }
  }

  const fetchCheckins = async () => {
    try {
      const res = await API.get('/checkin/today')
      setCheckins(res.data)
      setCheckinsLoading(false)
    } catch (err) {
      setCheckinsLoading(false)
    }
  }

  const handleAddMember = async (e) => {
    e.preventDefault()
    try {
      await API.post('/admin/members', {
        ...newMember,
        weight_kg: parseFloat(newMember.weight_kg)
      })
      setMessage('Member added successfully!')
      setShowAddForm(false)
      setNewMember({ full_name: '', email: '', password: '', phone: '', weight_kg: '', membership_expirey: '' })
      fetchMembers()
      setTimeout(() => setMessage(''), 3000)
    } catch (err) {
      setMessage('Error adding member')
    }
  }

  const openRenewForm = (member) => {
    setRenewingMember(member)
    setNewExpiry(member.membership_expirey)
    setShowRenewForm(true)
  }

  const handleRenew = async (e) => {
    e.preventDefault()
    try {
      await API.patch(`/admin/members/${renewingMember.id}`, {
        membership_expirey: newExpiry,
        weight_kg: renewingMember.weight_kg,
        status: 'active'
      })
      setMessage('Membership renewed successfully!')
      setShowRenewForm(false)
      setRenewingMember(null)
      fetchMembers()
      setTimeout(() => setMessage(''), 3000)
    } catch (err) {
      setMessage('Error renewing membership')
    }
  }

  const handleLogout = () => { logout(); navigate('/login') }

  // Single source of truth for membership status — always derived from the
  // actual expiry date, never trusts a stale stored "status" field.
  const isExpired = (member) => {
    if (!member.membership_expirey) return true
    const expiry = new Date(member.membership_expirey)
    const now = new Date()
    return expiry < now
  }

  const isExpiringSoon = (member) => {
    if (!member.membership_expirey || isExpired(member)) return false
    const expiry = new Date(member.membership_expirey)
    const now = new Date()
    const diffDays = (expiry - now) / (1000 * 60 * 60 * 24)
    return diffDays <= 30
  }

  const activeCount = members.filter(m => !isExpired(m)).length
  const expiringCount = members.filter(m => isExpiringSoon(m)).length

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex">
      {/* Sidebar */}
      <div className="w-64 bg-black border-r border-zinc-800 flex flex-col">
        <div className="p-6 border-b border-zinc-800">
          <h1 className="font-display text-3xl text-orange-400 tracking-wider">GYM CMS</h1>
          <p className="text-zinc-500 text-xs mt-1">Admin Panel</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {[
            { id: 'members', label: 'Members', icon: Users },
            { id: 'attendance', label: 'Attendance', icon: UserCheck },
            { id: 'stats', label: 'Statistics', icon: TrendingUp },
            { id: 'billing', label: 'Billing', icon: Calendar },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
                activeTab === id
                  ? 'bg-orange-500 text-black font-bold'
                  : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'
              }`}
            >
              <Icon size={18} />
              {label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-zinc-800">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 bg-orange-500 rounded-full flex items-center justify-center text-black font-bold text-sm">
              {user?.name?.charAt(0)}
            </div>
            <div>
              <p className="text-white text-sm font-medium">{user?.name}</p>
              <p className="text-zinc-500 text-xs">Admin</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 text-zinc-400 hover:text-red-400 transition-colors text-sm px-2"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <div className="bg-black border-b border-zinc-800 px-8 py-5 flex justify-between items-center">
          <div>
            <h2 className="font-display text-3xl tracking-wider text-white">
              {activeTab === 'members' ? 'MEMBERS' : activeTab === 'attendance' ? 'ATTENDANCE' : activeTab === 'stats' ? 'STATISTICS' : 'BILLING'}
            </h2>
            <p className="text-zinc-500 text-sm">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
          {activeTab === 'members' && (
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-2 bg-orange-500 hover:bg-orange-400 text-black font-bold px-5 py-2.5 rounded-xl transition-colors"
            >
              <Plus size={18} /> Add Member
            </button>
          )}
        </div>

        <div className="p-8">
          {message && (
            <div className="bg-orange-500/10 border border-orange-500/30 text-orange-400 px-4 py-3 rounded-xl mb-6">
              {message}
            </div>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-4 gap-6 mb-8">
            {[
              { label: 'Total Members', value: members.length, color: 'orange' },
              { label: 'Active Members', value: activeCount, color: 'blue' },
              { label: 'Expiring Soon', value: expiringCount, color: 'yellow' },
              { label: 'Checked In Today', value: checkins.length, color: 'green' },
            ].map((stat) => (
              <div key={stat.label} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                <p className="text-zinc-400 text-sm mb-2">{stat.label}</p>
                <p className={`font-display text-5xl ${
                  stat.color === 'orange' ? 'text-orange-400' :
                  stat.color === 'blue' ? 'text-blue-400' :
                  stat.color === 'green' ? 'text-green-400' : 'text-yellow-400'
                }`}>{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Members Table */}
          {activeTab === 'members' && (
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-zinc-800">
                <h3 className="font-bold text-white">All Members</h3>
              </div>
              {loading ? (
                <div className="p-8 text-center text-zinc-500">Loading...</div>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-zinc-800">
                      <th className="px-6 py-4 text-left text-zinc-400 text-sm font-medium">Name</th>
                      <th className="px-6 py-4 text-left text-zinc-400 text-sm font-medium">Phone</th>
                      <th className="px-6 py-4 text-left text-zinc-400 text-sm font-medium">Weight</th>
                      <th className="px-6 py-4 text-left text-zinc-400 text-sm font-medium">Status</th>
                      <th className="px-6 py-4 text-left text-zinc-400 text-sm font-medium">Expiry</th>
                    </tr>
                  </thead>
                  <tbody>
                    {members.map((member, i) => (
                      <tr key={member.id} className={`border-b border-zinc-800/50 hover:bg-zinc-800/50 transition-colors ${i % 2 === 0 ? '' : 'bg-zinc-900/50'}`}>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-orange-500/20 border border-orange-500/30 rounded-full flex items-center justify-center text-orange-400 text-sm font-bold">
                              {member.profiles?.full_name?.charAt(0)}
                            </div>
                            <span className="font-medium">{member.profiles?.full_name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-zinc-400">{member.profiles?.phone}</td>
                        <td className="px-6 py-4 font-bold text-white">{member.weight_kg} kg</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            isExpired(member)
                              ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                              : isExpiringSoon(member)
                              ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                              : 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                          }`}>
                            {isExpired(member) ? 'EXPIRED' : isExpiringSoon(member) ? 'EXPIRING SOON' : 'ACTIVE'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <span className="text-zinc-400">{member.membership_expirey}</span>
                            <button
                              onClick={() => openRenewForm(member)}
                              className="text-orange-400 hover:text-orange-300 text-xs font-bold px-2 py-1 rounded-md border border-orange-500/30 hover:bg-orange-500/10 transition-colors"
                            >
                              RENEW
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* Attendance Tab */}
          {activeTab === 'attendance' && (
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-zinc-800 flex justify-between items-center">
                <h3 className="font-bold text-white">Today's Check-Ins</h3>
                <button
                  onClick={fetchCheckins}
                  className="text-orange-400 hover:text-orange-300 text-sm font-medium"
                >
                  Refresh
                </button>
              </div>
              {checkinsLoading ? (
                <div className="p-8 text-center text-zinc-500">Loading...</div>
              ) : checkins.length === 0 ? (
                <div className="p-12 text-center">
                  <UserCheck size={48} className="text-zinc-600 mx-auto mb-4" />
                  <p className="text-zinc-400">No one has checked in yet today.</p>
                </div>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-zinc-800">
                      <th className="px-6 py-4 text-left text-zinc-400 text-sm font-medium">Member</th>
                      <th className="px-6 py-4 text-left text-zinc-400 text-sm font-medium">Check-In Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {checkins.map((c) => (
                      <tr key={c.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-green-500/20 border border-green-500/30 rounded-full flex items-center justify-center text-green-400 text-sm font-bold">
                              {c.members?.profiles?.full_name?.charAt(0)}
                            </div>
                            <span className="font-medium">{c.members?.profiles?.full_name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-zinc-400">
                          {new Date(c.checked_in_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* Stats Tab */}
          {activeTab === 'stats' && (
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 text-center">
              <TrendingUp size={48} className="text-orange-400 mx-auto mb-4" />
              <h3 className="font-display text-3xl text-white mb-2">COMING SOON</h3>
              <p className="text-zinc-400">Progress charts and analytics will appear here</p>
            </div>
          )}

          {/* Billing Tab */}
          {activeTab === 'billing' && (
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-zinc-800">
                <h3 className="font-bold text-white">Membership Billing</h3>
              </div>
              <table className="w-full">
                <thead>
                  <tr className="border-b border-zinc-800">
                    <th className="px-6 py-4 text-left text-zinc-400 text-sm font-medium">Member</th>
                    <th className="px-6 py-4 text-left text-zinc-400 text-sm font-medium">Join Date</th>
                    <th className="px-6 py-4 text-left text-zinc-400 text-sm font-medium">Expiry</th>
                    <th className="px-6 py-4 text-left text-zinc-400 text-sm font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {members.map((member) => (
                    <tr key={member.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/50 transition-colors">
                      <td className="px-6 py-4 font-medium">{member.profiles?.full_name}</td>
                      <td className="px-6 py-4 text-zinc-400">{member.join_date}</td>
                      <td className="px-6 py-4 text-zinc-400">{member.membership_expirey}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          isExpired(member)
                            ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                            : 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                        }`}>
                          {isExpired(member) ? 'OVERDUE' : 'PAID'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Add Member Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-lg">
            <div className="flex justify-between items-center p-6 border-b border-zinc-800">
              <h3 className="font-display text-2xl text-white tracking-wider">ADD NEW MEMBER</h3>
              <button onClick={() => setShowAddForm(false)} className="text-zinc-400 hover:text-white">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleAddMember} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-zinc-400 text-sm block mb-1">Full Name</label>
                  <input
                    type="text"
                    value={newMember.full_name}
                    onChange={(e) => setNewMember({...newMember, full_name: e.target.value})}
                    className="w-full bg-zinc-800 border border-zinc-700 text-white px-4 py-2.5 rounded-xl focus:outline-none focus:border-orange-500"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="text-zinc-400 text-sm block mb-1">Phone</label>
                  <input
                    type="text"
                    value={newMember.phone}
                    onChange={(e) => setNewMember({...newMember, phone: e.target.value})}
                    className="w-full bg-zinc-800 border border-zinc-700 text-white px-4 py-2.5 rounded-xl focus:outline-none focus:border-orange-500"
                    placeholder="9876543210"
                  />
                </div>
              </div>
              <div>
                <label className="text-zinc-400 text-sm block mb-1">Email</label>
                <input
                  type="email"
                  value={newMember.email}
                  onChange={(e) => setNewMember({...newMember, email: e.target.value})}
                  className="w-full bg-zinc-800 border border-zinc-700 text-white px-4 py-2.5 rounded-xl focus:outline-none focus:border-orange-500"
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <label className="text-zinc-400 text-sm block mb-1">Password</label>
                <input
                  type="password"
                  value={newMember.password}
                  onChange={(e) => setNewMember({...newMember, password: e.target.value})}
                  className="w-full bg-zinc-800 border border-zinc-700 text-white px-4 py-2.5 rounded-xl focus:outline-none focus:border-orange-500"
                  placeholder="••••••••"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-zinc-400 text-sm block mb-1">Weight (kg)</label>
                  <input
                    type="number"
                    value={newMember.weight_kg}
                    onChange={(e) => setNewMember({...newMember, weight_kg: e.target.value})}
                    className="w-full bg-zinc-800 border border-zinc-700 text-white px-4 py-2.5 rounded-xl focus:outline-none focus:border-orange-500"
                    placeholder="75"
                  />
                </div>
                <div>
                  <label className="text-zinc-400 text-sm block mb-1">Membership Expiry</label>
                  <input
                    type="date"
                    value={newMember.membership_expirey}
                    onChange={(e) => setNewMember({...newMember, membership_expirey: e.target.value})}
                    className="w-full bg-zinc-800 border border-zinc-700 text-white px-4 py-2.5 rounded-xl focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-orange-500 hover:bg-orange-400 text-black font-bold py-3 rounded-xl transition-colors mt-2"
              >
                ADD MEMBER
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Renew Membership Modal */}
      {showRenewForm && renewingMember && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md">
            <div className="flex justify-between items-center p-6 border-b border-zinc-800">
              <h3 className="font-display text-2xl text-white tracking-wider">RENEW MEMBERSHIP</h3>
              <button onClick={() => setShowRenewForm(false)} className="text-zinc-400 hover:text-white">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleRenew} className="p-6 space-y-4">
              <div>
                <p className="text-zinc-400 text-sm mb-1">Member</p>
                <p className="text-white font-bold text-lg">{renewingMember.profiles?.full_name}</p>
              </div>
              <div>
                <p className="text-zinc-400 text-sm mb-1">Current Expiry</p>
                <p className="text-red-400 font-medium">{renewingMember.membership_expirey}</p>
              </div>
              <div>
                <label className="text-zinc-400 text-sm block mb-1">New Expiry Date</label>
                <input
                  type="date"
                  value={newExpiry}
                  onChange={(e) => setNewExpiry(e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 text-white px-4 py-2.5 rounded-xl focus:outline-none focus:border-orange-500"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-orange-500 hover:bg-orange-400 text-black font-bold py-3 rounded-xl transition-colors mt-2"
              >
                CONFIRM RENEWAL
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}