import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
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
  const [stats, setStats] = useState(null)
  const [statsLoading, setStatsLoading] = useState(true)

  useEffect(() => {
    fetchMembers()
    fetchCheckins()
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const res = await API.get('/admin/stats')
      setStats(res.data)
      setStatsLoading(false)
    } catch (err) {
      setStatsLoading(false)
    }
  }

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

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

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
    <div className="bg-background text-on-surface font-body-md overflow-hidden min-h-screen relative flex">
      {/* Fixed Side Navigation */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-surface-container-low border-r border-surface-border flex flex-col justify-between py-8 z-50">
        <div className="px-6">
          <div className="mb-10">
            <h1 className="font-display-lg text-primary-container tracking-tighter leading-none text-[36px] uppercase">
              APEX FORGE
            </h1>
            <p className="font-label-caps text-[10px] text-on-surface-variant tracking-[0.3em] mt-1 opacity-60">ELITE PERFORMANCE</p>
          </div>
          <nav className="space-y-2">
            {[
              { id: 'members', label: 'Members', icon: 'group' },
              { id: 'attendance', label: 'Attendance', icon: 'how_to_reg' },
              { id: 'stats', label: 'Statistics', icon: 'bar_chart' },
              { id: 'billing', label: 'Billing', icon: 'payments' },
            ].map(({ id, label, icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-150 uppercase tracking-widest text-[12px] cursor-pointer ${
                  activeTab === id
                    ? 'text-primary-container font-bold border-r-4 border-primary-container bg-primary-container/10'
                    : 'text-secondary opacity-60 hover:bg-surface-container-high hover:text-primary'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">{icon}</span>
                <span>{label}</span>
              </button>
            ))}
          </nav>

          {activeTab === 'members' && (
            <button 
              onClick={() => setShowAddForm(true)}
              className="w-full mt-10 bg-primary-container text-white font-action-text py-3 rounded-xl orange-glow hover:brightness-110 transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">add</span>
              <span className="tracking-wider">ADD MEMBER</span>
            </button>
          )}
        </div>

        <div className="px-6 border-t border-surface-border pt-6">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-9 h-9 bg-primary-container rounded-full flex items-center justify-center text-white font-bold text-sm">
              {user?.name?.charAt(0)}
            </div>
            <div>
              <p className="text-white text-xs font-semibold">{user?.name}</p>
              <p className="text-zinc-500 text-[10px] uppercase tracking-wider">Admin</p>
            </div>
          </div>
          <button 
            onClick={handleLogout} 
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-error-ruby/70 hover:bg-error-ruby/10 hover:text-error-ruby transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">logout</span>
            <span className="font-body-md uppercase tracking-widest text-[12px]">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="ml-64 flex-1 min-h-screen flex flex-col relative overflow-hidden bg-[#0c0e14]">
        {/* Top Navigation */}
        <header className="sticky top-0 z-40 w-full bg-background/85 backdrop-blur-md border-b border-surface-border flex justify-between items-center px-8 h-20">
          <div className="flex items-center gap-8">
            <h2 className="font-heading-2 text-primary-container tracking-widest text-2xl uppercase">
              {activeTab === 'members' ? 'MEMBERS DATA' : activeTab === 'attendance' ? 'ATTENDANCE SYSTEM' : activeTab === 'stats' ? 'TELEMETRY STATS' : 'BILLING CONTROL'}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative group">
              <input 
                className="bg-surface-container-low border border-surface-border rounded-full px-5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-container/30 transition-all w-64 text-white pl-10" 
                placeholder="Search database..." 
                type="text"
              />
              <span className="material-symbols-outlined absolute left-3.5 top-2.5 text-on-surface-variant text-[18px]">search</span>
            </div>
            <button className="p-2 text-on-surface-variant hover:text-primary transition-colors cursor-pointer">
              <span className="material-symbols-outlined">notifications</span>
            </button>
          </div>
        </header>

        {/* Page Canvas */}
        <div className="p-8 flex-grow custom-scrollbar overflow-y-auto">
          {message && (
            <div className="bg-success-neon/10 border border-success-neon/20 text-success-neon px-4 py-3 rounded-xl mb-6 text-sm">
              {message}
            </div>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[
              { label: 'Total Members', value: members.length, color: 'primary-container' },
              { label: 'Active Members', value: activeCount, color: 'info-blue' },
              { label: 'Expiring Soon', value: expiringCount, color: 'warning-gold' },
              { label: 'Checked In Today', value: checkins.length, color: 'success-neon' },
            ].map((stat) => (
              <div key={stat.label} className="bg-surface-container-low border border-surface-border rounded-2xl p-6 hover:border-primary-container/50 transition-colors group">
                <p className="font-label-caps text-on-surface-variant mb-2 text-[10px] tracking-widest uppercase">{stat.label}</p>
                <p className={`font-display-lg text-4xl leading-none text-${stat.color}`}>{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Members Table */}
          {activeTab === 'members' && (
            <div className="bg-surface-container-low border border-surface-border rounded-2xl overflow-hidden shadow-xl">
              <div className="px-6 py-4 border-b border-surface-border">
                <h3 className="font-heading-2 text-on-surface text-xl tracking-wider">ALL MEMBERS</h3>
              </div>
              {loading ? (
                <div className="p-8 text-center text-zinc-500">Synchronizing...</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-surface-container/50 text-on-surface-variant font-label-caps text-[10px] uppercase tracking-widest border-b border-surface-border">
                      <tr>
                        <th className="px-6 py-4">Name</th>
                        <th className="px-6 py-4">Phone</th>
                        <th className="px-6 py-4">Weight</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4">Expiry</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-surface-border">
                      {members.map((member, i) => (
                        <tr key={member.id} className="hover:bg-surface-container-high/30 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-primary-container/20 border border-primary-container/30 rounded-full flex items-center justify-center text-primary-container text-sm font-bold">
                                {member.profiles?.full_name?.charAt(0)}
                              </div>
                              <span className="font-bold text-on-surface text-sm">{member.profiles?.full_name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-on-surface-variant">{member.profiles?.phone || 'N/A'}</td>
                          <td className="px-6 py-4 text-sm font-bold text-white">{member.weight_kg ? `${member.weight_kg} kg` : 'N/A'}</td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 text-[10px] font-bold rounded-full uppercase tracking-tighter border ${
                              isExpired(member)
                                ? 'bg-error-ruby/10 text-error-ruby border-error-ruby/20'
                                : isExpiringSoon(member)
                                ? 'bg-warning-gold/10 text-warning-gold border-warning-gold/20'
                                : 'bg-success-neon/10 text-success-neon border-success-neon/20'
                            }`}>
                              {isExpired(member) ? 'EXPIRED' : isExpiringSoon(member) ? 'EXPIRING SOON' : 'ACTIVE'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <span className="text-sm text-on-surface-variant">{member.membership_expirey || 'N/A'}</span>
                              <button
                                onClick={() => openRenewForm(member)}
                                className="text-primary-container hover:text-white text-xs font-bold px-2 py-1 rounded-md border border-primary-container/30 hover:bg-primary-container/10 transition-colors cursor-pointer uppercase tracking-wider"
                              >
                                RENEW
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Attendance Tab */}
          {activeTab === 'attendance' && (
            <div className="bg-surface-container-low border border-surface-border rounded-2xl overflow-hidden shadow-xl">
              <div className="px-6 py-4 border-b border-surface-border flex justify-between items-center">
                <h3 className="font-heading-2 text-on-surface text-xl tracking-wider">TODAY'S CHECK-INS</h3>
                <button
                  onClick={fetchCheckins}
                  className="text-primary-container hover:text-white text-xs font-bold border border-primary-container/20 rounded px-3 py-1 cursor-pointer uppercase tracking-wider"
                >
                  Refresh
                </button>
              </div>
              {checkinsLoading ? (
                <div className="p-8 text-center text-zinc-500">Retrieving logs...</div>
              ) : checkins.length === 0 ? (
                <div className="p-12 text-center">
                  <span className="material-symbols-outlined text-[48px] text-on-surface-variant opacity-30 mb-2">how_to_reg</span>
                  <p className="text-on-surface-variant text-sm">No check-in activity recorded yet today.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-surface-container/50 text-on-surface-variant font-label-caps text-[10px] uppercase tracking-widest border-b border-surface-border">
                      <tr>
                        <th className="px-6 py-4">Member</th>
                        <th className="px-6 py-4">Check-In Time</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-surface-border">
                      {checkins.map((c) => (
                        <tr key={c.id} className="hover:bg-surface-container-high/30 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-success-neon/20 border border-success-neon/30 rounded-full flex items-center justify-center text-success-neon text-sm font-bold">
                                {c.members?.profiles?.full_name?.charAt(0)}
                              </div>
                              <span className="font-bold text-on-surface text-sm">{c.members?.profiles?.full_name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-on-surface-variant">
                            {new Date(c.checked_in_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Stats Tab */}
          {activeTab === 'stats' && (
            <div className="space-y-6">
              {statsLoading ? (
                <div className="bg-surface-container-low border border-surface-border rounded-2xl p-12 text-center">
                  <p className="text-zinc-500 text-sm">Processing performance logs...</p>
                </div>
              ) : stats ? (
                <>
                  {/* Attendance Trend Chart */}
                  <div className="bg-surface-container-low border border-surface-border rounded-2xl p-6 shadow-xl">
                    <h3 className="font-heading-2 text-on-surface text-xl mb-1 tracking-wider">ATTENDANCE VOLUME</h3>
                    <p className="text-on-surface-variant text-xs mb-6">Daily check-ins over the last 14 days</p>
                    <div className="h-72 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={stats.attendanceTrend} margin={{ left: -20 }}>
                          <defs>
                            <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                              <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                          <XAxis
                            dataKey="date"
                            stroke="#a78b7d"
                            tickFormatter={(val) => {
                              const d = new Date(val + 'T00:00:00')
                              return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                            }}
                            fontSize={10}
                            opacity={0.6}
                          />
                          <YAxis stroke="#a78b7d" allowDecimals={false} fontSize={10} opacity={0.6} />
                          <Tooltip
                            contentStyle={{ backgroundColor: '#12131a', border: '1px solid #27272a', borderRadius: '12px' }}
                            labelStyle={{ color: '#ffb690', fontWeight: 'bold' }}
                            itemStyle={{ color: '#fff' }}
                            labelFormatter={(val) => {
                              const d = new Date(val + 'T00:00:00')
                              return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
                            }}
                            formatter={(value) => [value, 'Check-ins']}
                          />
                          <Area type="monotone" dataKey="count" stroke="#f97316" strokeWidth={3} fill="url(#colorCount)" dot={{ fill: '#f97316', r: 4 }} activeDot={{ r: 6 }} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Membership Status Breakdown */}
                  <div className="bg-surface-container-low border border-surface-border rounded-2xl p-6 shadow-xl">
                    <h3 className="font-heading-2 text-on-surface text-xl mb-1 tracking-wider">MEMBERSHIP CATEGORIES</h3>
                    <p className="text-on-surface-variant text-xs mb-6">Current active/expired distribution</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {[
                        { label: 'Active', value: stats.membershipBreakdown.active, color: 'success-neon', bg: 'bg-success-neon' },
                        { label: 'Expiring Soon', value: stats.membershipBreakdown.expiringSoon, color: 'warning-gold', bg: 'bg-warning-gold' },
                        { label: 'Expired', value: stats.membershipBreakdown.expired, color: 'error-ruby', bg: 'bg-error-ruby' },
                      ].map((item) => {
                        const pct = stats.membershipBreakdown.total > 0 ? Math.round((item.value / stats.membershipBreakdown.total) * 100) : 0
                        return (
                          <div key={item.label} className="bg-surface-container border border-surface-border rounded-xl p-5">
                            <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-3">{item.label}</p>
                            <p className={`font-display-lg text-4xl mb-3 text-${item.color}`}>{item.value}</p>
                            <div className="w-full bg-surface-container-low rounded-full h-1.5 mb-1">
                              <div className={`${item.bg} h-1.5 rounded-full transition-all`} style={{ width: `${pct}%` }}></div>
                            </div>
                            <p className="text-zinc-500 text-[10px] font-semibold">{pct}% of database</p>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </>
              ) : (
                <div className="bg-surface-container-low border border-surface-border rounded-2xl p-12 text-center">
                  <span className="material-symbols-outlined text-[48px] text-zinc-600 mb-2">bar_chart</span>
                  <p className="text-on-surface-variant text-sm">Failed to generate reports.</p>
                </div>
              )}
            </div>
          )}

          {/* Billing Tab */}
          {activeTab === 'billing' && (
            <div className="bg-surface-container-low border border-surface-border rounded-2xl overflow-hidden shadow-xl">
              <div className="px-6 py-4 border-b border-surface-border">
                <h3 className="font-heading-2 text-on-surface text-xl tracking-wider">MEMBERSHIP ACCOUNTS</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-surface-container/50 text-on-surface-variant font-label-caps text-[10px] uppercase tracking-widest border-b border-surface-border">
                    <tr>
                      <th className="px-6 py-4">Member</th>
                      <th className="px-6 py-4">Join Date</th>
                      <th className="px-6 py-4">Expiry Date</th>
                      <th className="px-6 py-4">Paid Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-border">
                    {members.map((member) => (
                      <tr key={member.id} className="hover:bg-surface-container-high/30 transition-colors">
                        <td className="px-6 py-4 font-bold text-sm text-on-surface">{member.profiles?.full_name}</td>
                        <td className="px-6 py-4 text-sm text-on-surface-variant">{member.join_date || 'N/A'}</td>
                        <td className="px-6 py-4 text-sm text-on-surface-variant">{member.membership_expirey || 'N/A'}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 text-[10px] font-bold rounded-full uppercase tracking-tighter border ${
                            isExpired(member)
                              ? 'bg-error-ruby/10 text-error-ruby border-error-ruby/20'
                              : 'bg-success-neon/10 text-success-neon border-success-neon/20'
                          }`}>
                            {isExpired(member) ? 'OVERDUE' : 'PAID'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Add Member Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-surface-container-low border border-surface-border rounded-2xl w-full max-w-lg shadow-2xl">
            <div className="flex justify-between items-center p-6 border-b border-surface-border bg-surface-container">
              <h3 className="font-heading-2 text-2xl text-white tracking-wider">REGISTER RECRUIT</h3>
              <button onClick={() => setShowAddForm(false)} className="text-zinc-400 hover:text-white cursor-pointer">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleAddMember} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-zinc-400 text-xs font-semibold block uppercase">Full Name</label>
                  <input
                    type="text"
                    value={newMember.full_name}
                    onChange={(e) => setNewMember({...newMember, full_name: e.target.value})}
                    className="w-full bg-surface-container border border-surface-border text-white px-4 py-2.5 rounded-xl focus:outline-none focus:border-primary-container text-sm"
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-zinc-400 text-xs font-semibold block uppercase">Phone</label>
                  <input
                    type="text"
                    value={newMember.phone}
                    onChange={(e) => setNewMember({...newMember, phone: e.target.value})}
                    className="w-full bg-surface-container border border-surface-border text-white px-4 py-2.5 rounded-xl focus:outline-none focus:border-primary-container text-sm"
                    placeholder="9876543210"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-zinc-400 text-xs font-semibold block uppercase">Email Address</label>
                <input
                  type="email"
                  value={newMember.email}
                  onChange={(e) => setNewMember({...newMember, email: e.target.value})}
                  className="w-full bg-surface-container border border-surface-border text-white px-4 py-2.5 rounded-xl focus:outline-none focus:border-primary-container text-sm"
                  placeholder="john@example.com"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-zinc-400 text-xs font-semibold block uppercase">Access Secret (Password)</label>
                <input
                  type="password"
                  value={newMember.password}
                  onChange={(e) => setNewMember({...newMember, password: e.target.value})}
                  className="w-full bg-surface-container border border-surface-border text-white px-4 py-2.5 rounded-xl focus:outline-none focus:border-primary-container text-sm"
                  placeholder="••••••••"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-zinc-400 text-xs font-semibold block uppercase">Weight (kg)</label>
                  <input
                    type="number"
                    value={newMember.weight_kg}
                    onChange={(e) => setNewMember({...newMember, weight_kg: e.target.value})}
                    className="w-full bg-surface-container border border-surface-border text-white px-4 py-2.5 rounded-xl focus:outline-none focus:border-primary-container text-sm"
                    placeholder="75"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-zinc-400 text-xs font-semibold block uppercase">Expiration Date</label>
                  <input
                    type="date"
                    value={newMember.membership_expirey}
                    onChange={(e) => setNewMember({...newMember, membership_expirey: e.target.value})}
                    className="w-full bg-surface-container border border-surface-border text-white px-4 py-2.5 rounded-xl focus:outline-none focus:border-primary-container text-sm cursor-pointer"
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-primary-container hover:brightness-110 text-white font-action-text font-bold py-3 rounded-xl transition-colors mt-4 cursor-pointer tracking-wider text-base"
              >
                INITIALIZE ACCOUNT
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Renew Membership Modal */}
      {showRenewForm && renewingMember && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-surface-container-low border border-surface-border rounded-2xl w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center p-6 border-b border-surface-border bg-surface-container">
              <h3 className="font-heading-2 text-2xl text-white tracking-wider">RENEW MEMBERSHIP</h3>
              <button onClick={() => setShowRenewForm(false)} className="text-zinc-400 hover:text-white cursor-pointer">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleRenew} className="p-6 space-y-4">
              <div>
                <p className="text-zinc-500 text-xs uppercase font-bold tracking-wider mb-0.5">Recruit Name</p>
                <p className="text-white font-bold text-base">{renewingMember.profiles?.full_name}</p>
              </div>
              <div>
                <p className="text-zinc-500 text-xs uppercase font-bold tracking-wider mb-0.5">Expired Expiry</p>
                <p className="text-error-ruby font-bold text-sm">{renewingMember.membership_expirey}</p>
              </div>
              <div className="space-y-1">
                <label className="text-zinc-400 text-xs font-semibold block uppercase">New Expiration Date</label>
                <input
                  type="date"
                  value={newExpiry}
                  onChange={(e) => setNewExpiry(e.target.value)}
                  className="w-full bg-surface-container border border-surface-border text-white px-4 py-2.5 rounded-xl focus:outline-none focus:border-primary-container text-sm cursor-pointer"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-primary-container hover:brightness-110 text-white font-action-text font-bold py-3.5 rounded-xl transition-colors mt-4 cursor-pointer tracking-wider text-base"
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