import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import API from '../../api/axios'

export default function TrainerPortal() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [members, setMembers] = useState([])
  const [plans, setPlans] = useState([])
  const [activeTab, setActiveTab] = useState('members')
  const [newPlan, setNewPlan] = useState({ title: '', type: 'workout', description: '' })
  const [assignForm, setAssignForm] = useState({ member_id: '', plan_id: '' })
  const [message, setMessage] = useState('')
  const [showPlanForm, setShowPlanForm] = useState(false)

  // Member detail modal state
  const [selectedMember, setSelectedMember] = useState(null)
  const [memberProgress, setMemberProgress] = useState(null)
  const [progressLoading, setProgressLoading] = useState(false)

  useEffect(() => {
    fetchMembers()
    fetchPlans()
  }, [])

  const fetchMembers = async () => {
    try {
      const res = await API.get('/trainer/members')
      setMembers(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  const fetchPlans = async () => {
    try {
      const res = await API.get('/trainer/plans')
      setPlans(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  const handleCreatePlan = async (e) => {
    e.preventDefault()
    try {
      await API.post('/trainer/plans', newPlan)
      setMessage('Plan created!')
      setNewPlan({ title: '', type: 'workout', description: '' })
      setShowPlanForm(false)
      fetchPlans()
      setTimeout(() => setMessage(''), 3000)
    } catch (err) {
      setMessage('Error creating plan')
    }
  }

  const handleAssign = async (e) => {
    e.preventDefault()
    try {
      await API.post('/trainer/assign', assignForm)
      setMessage('Plan assigned successfully!')
      setAssignForm({ member_id: '', plan_id: '' })
      setTimeout(() => setMessage(''), 3000)
    } catch (err) {
      setMessage('Error assigning plan')
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const openMemberDetail = async (member) => {
    setSelectedMember(member)
    setProgressLoading(true)
    setMemberProgress(null)
    try {
      const res = await API.get(`/trainer/members/${member.id}/progress`)
      setMemberProgress(res.data)
    } catch (err) {
      console.error(err)
    }
    setProgressLoading(false)
  }

  const closeMemberDetail = () => {
    setSelectedMember(null)
    setMemberProgress(null)
  }

  // Build chart data from progress logs
  const chartData = memberProgress?.logs
    ? [...memberProgress.logs].reverse().map((log, i) => ({
        entry: `WK ${i + 1}`,
        weight: log.weight_kg,
        date: new Date(log.logged_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      }))
    : []

  // Random unsplash photo mappings for elite feel
  const avatars = [
    "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=150&h=150&fit=crop&q=80",
    "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=150&h=150&fit=crop&q=80",
    "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=150&h=150&fit=crop&q=80",
    "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=150&h=150&fit=crop&q=80"
  ]

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
              { id: 'plans', label: 'Plans', icon: 'fitness_center' },
              { id: 'assign', label: 'Assign Plans', icon: 'clipboard_list' },
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
          
          <button 
            onClick={() => setShowPlanForm(true)}
            className="w-full mt-10 bg-primary-container text-white font-action-text py-3 rounded-xl orange-glow hover:brightness-110 transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
            <span className="tracking-wider">NEW PLAN</span>
          </button>
        </div>

        <div className="px-6 border-t border-surface-border pt-6">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-9 h-9 bg-primary-container rounded-full flex items-center justify-center text-white font-bold text-sm">
              {user?.name?.charAt(0)}
            </div>
            <div>
              <p className="text-white text-xs font-semibold">{user?.name}</p>
              <p className="text-zinc-500 text-[10px] uppercase tracking-wider">Trainer</p>
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
              {activeTab === 'members' ? 'MEMBERS DIRECTORY' : activeTab === 'plans' ? 'TACTICAL PLANS' : 'PLAN ASSIGNMENT'}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative group">
              <input 
                className="bg-surface-container-low border border-surface-border rounded-full px-5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-container/30 transition-all w-64 text-white pl-10" 
                placeholder="Search athletes..." 
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

          {/* Dashboard Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-surface-container-low border border-surface-border rounded-2xl p-6 hover:border-primary-container/50 transition-colors group">
              <p className="font-label-caps text-on-surface-variant mb-2 text-[10px] tracking-widest uppercase">ACTIVE CLIENTS</p>
              <div className="flex items-end justify-between">
                <h3 className="font-display-lg text-primary text-4xl leading-none">{members.length}</h3>
                <span className="text-success-neon flex items-center text-xs font-bold gap-1">
                  <span className="material-symbols-outlined text-[16px]">trending_up</span> +12%
                </span>
              </div>
            </div>
            <div className="bg-surface-container-low border border-surface-border rounded-2xl p-6 hover:border-primary-container/50 transition-colors group">
              <p className="font-label-caps text-on-surface-variant mb-2 text-[10px] tracking-widest uppercase">TOTAL PLANS</p>
              <div className="flex items-end justify-between">
                <h3 className="font-display-lg text-on-surface text-4xl leading-none">{plans.length}</h3>
                <span className="text-on-surface-variant/40 text-xs">Target: 200</span>
              </div>
            </div>
            <div className="bg-surface-container-low border border-surface-border rounded-2xl p-6 hover:border-primary-container/50 transition-colors group">
              <p className="font-label-caps text-on-surface-variant mb-2 text-[10px] tracking-widest uppercase">AVG. PROGRESS</p>
              <div className="flex items-end justify-between">
                <h3 className="font-display-lg text-on-surface text-4xl leading-none">8.2%</h3>
                <span className="text-success-neon flex items-center text-xs font-bold gap-1">
                  <span className="material-symbols-outlined text-[16px]">arrow_upward</span> 0.5
                </span>
              </div>
            </div>
            <div className="bg-surface-container-low border border-surface-border rounded-2xl p-6 hover:border-primary-container/50 transition-colors group">
              <p className="font-label-caps text-on-surface-variant mb-2 text-[10px] tracking-widest uppercase">TACTICAL STATUS</p>
              <div className="flex items-end justify-between">
                <h3 className="font-display-lg text-warning-gold text-4xl leading-none">APEX</h3>
                <span className="text-on-surface-variant/40 text-xs">Active</span>
              </div>
            </div>
          </div>

          {/* Tab Contents */}
          {activeTab === 'members' && (
            <section className="bg-surface-container-low border border-surface-border rounded-2xl overflow-hidden shadow-xl">
              <div className="p-6 border-b border-surface-border flex justify-between items-center">
                <h4 className="font-heading-2 text-on-surface text-xl tracking-wider">MANAGED ATHLETES</h4>
                <button className="bg-primary-container/10 border border-primary-container/30 text-primary-container font-action-text px-4 py-2 rounded-lg hover:bg-primary-container/20 transition-all flex items-center gap-2 cursor-pointer text-sm">
                  <span className="material-symbols-outlined text-[18px]">filter_list</span>
                  FILTER
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-surface-container/50 text-on-surface-variant font-label-caps text-[10px] uppercase tracking-widest border-b border-surface-border">
                    <tr>
                      <th className="px-6 py-4">Athlete</th>
                      <th className="px-6 py-4">Phone</th>
                      <th className="px-6 py-4">Current Weight</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-border">
                    {members.map((member, i) => (
                      <tr key={member.id} className="hover:bg-surface-container-high/30 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-surface-container-highest overflow-hidden border border-surface-border">
                              <img 
                                className="w-full h-full object-cover" 
                                src={avatars[i % avatars.length]} 
                                alt={member.profiles?.full_name} 
                              />
                            </div>
                            <div>
                              <p className="font-bold text-on-surface text-sm">{member.profiles?.full_name}</p>
                              <p className="text-[10px] text-on-surface-variant uppercase tracking-wider">Elite Tier</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-on-surface-variant">
                          {member.profiles?.phone || 'No phone record'}
                        </td>
                        <td className="px-6 py-4 text-sm font-bold text-white">
                          {member.weight_kg ? `${member.weight_kg} kg` : 'N/A'}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 text-[10px] font-bold rounded-full uppercase tracking-tighter border ${
                            member.status === 'active' 
                              ? 'bg-success-neon/10 text-success-neon border-success-neon/20' 
                              : member.status === 'expired' 
                                ? 'bg-error-ruby/10 text-error-ruby border-error-ruby/20'
                                : 'bg-warning-gold/10 text-warning-gold border-warning-gold/20'
                          }`}>
                            {member.status || 'inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button 
                            onClick={() => openMemberDetail(member)}
                            className="bg-surface-container-highest text-on-surface px-4 py-2 rounded-lg text-xs font-bold hover:bg-primary-container hover:text-on-primary transition-all active:scale-95 cursor-pointer uppercase tracking-wider"
                          >
                            VIEW LOGS
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {activeTab === 'plans' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {plans.map(plan => (
                <div key={plan.id} className="bg-surface-container-low border border-surface-border rounded-2xl p-6 hover:border-primary-container/30 transition-colors">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-lg text-white mb-2">{plan.title}</h3>
                      <p className="text-on-surface-variant text-sm leading-relaxed">{plan.description}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wider ${
                      plan.type === 'workout'
                        ? 'bg-info-blue/10 text-info-blue border-info-blue/20'
                        : 'bg-primary-container/10 text-primary-container border-primary-container/20'
                    }`}>
                      {plan.type}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'assign' && (
            <div className="max-w-lg bg-surface-container-low border border-surface-border rounded-2xl p-6">
              <h3 className="font-heading-2 text-xl mb-6 uppercase tracking-wider">Assign Training Protocol</h3>
              <form onSubmit={handleAssign} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-label-caps text-xs text-on-surface-variant font-semibold uppercase tracking-wider ml-1">Select Athlete</label>
                  <select
                    value={assignForm.member_id}
                    onChange={(e) => setAssignForm({...assignForm, member_id: e.target.value})}
                    className="w-full bg-surface-container-low border border-surface-border text-white px-4 py-3 rounded-xl focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container/20 transition-all text-sm cursor-pointer"
                    required
                  >
                    <option value="" disabled>Choose a member...</option>
                    {members.map(member => (
                      <option key={member.id} value={member.id}>
                        {member.profiles?.full_name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-label-caps text-xs text-on-surface-variant font-semibold uppercase tracking-wider ml-1">Select Plan</label>
                  <select
                    value={assignForm.plan_id}
                    onChange={(e) => setAssignForm({...assignForm, plan_id: e.target.value})}
                    className="w-full bg-surface-container-low border border-surface-border text-white px-4 py-3 rounded-xl focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container/20 transition-all text-sm cursor-pointer"
                    required
                  >
                    <option value="" disabled>Choose a plan...</option>
                    {plans.map(plan => (
                      <option key={plan.id} value={plan.id}>
                        {plan.title} ({plan.type})
                      </option>
                    ))}
                  </select>
                </div>
                <button 
                  type="submit" 
                  className="w-full bg-primary-container hover:brightness-110 text-white font-action-text py-3.5 rounded-xl transition-all font-bold tracking-wider cursor-pointer"
                >
                  ASSIGN PROTOCOL
                </button>
              </form>
            </div>
          )}
        </div>
      </main>

      {/* Plan Form Modal */}
      {showPlanForm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-surface-container-low border border-surface-border rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="flex justify-between items-center p-6 border-b border-surface-border bg-surface-container">
              <h3 className="font-heading-2 text-2xl text-white tracking-wider">CREATE PROTOCOL</h3>
              <button 
                onClick={() => setShowPlanForm(false)} 
                className="text-zinc-400 hover:text-white cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleCreatePlan} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-label-caps text-xs text-on-surface-variant font-semibold uppercase tracking-wider">Plan Title</label>
                <input
                  type="text"
                  value={newPlan.title}
                  onChange={(e) => setNewPlan({...newPlan, title: e.target.value})}
                  className="w-full bg-surface-container border border-surface-border text-white px-4 py-3 rounded-xl focus:outline-none focus:border-primary-container transition-all text-sm"
                  placeholder="e.g. Strength Training Phase 1"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-label-caps text-xs text-on-surface-variant font-semibold uppercase tracking-wider">Type</label>
                <select
                  value={newPlan.type}
                  onChange={(e) => setNewPlan({...newPlan, type: e.target.value})}
                  className="w-full bg-surface-container border border-surface-border text-white px-4 py-3 rounded-xl focus:outline-none focus:border-primary-container transition-all text-sm cursor-pointer"
                >
                  <option value="workout">Workout</option>
                  <option value="nutrition">Nutrition</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-label-caps text-xs text-on-surface-variant font-semibold uppercase tracking-wider">Description</label>
                <textarea
                  value={newPlan.description}
                  onChange={(e) => setNewPlan({...newPlan, description: e.target.value})}
                  className="w-full bg-surface-container border border-surface-border text-white px-4 py-3 rounded-xl focus:outline-none focus:border-primary-container transition-all text-sm"
                  rows="4"
                  placeholder="Specify routines, reps, diets..."
                  required
                />
              </div>
              <button 
                type="submit" 
                className="w-full bg-primary-container text-white py-3.5 rounded-xl font-action-text text-lg tracking-wider hover:brightness-110 transition-all cursor-pointer"
              >
                CONFIRM CREATION
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Member Details Modal (Dual-Panel layout) */}
      {selectedMember && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-6 animate-in fade-in duration-300">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-background/90 backdrop-blur-sm" onClick={closeMemberDetail}></div>
          {/* Modal Content */}
          <div className="relative w-full max-w-5xl glass-panel rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row h-[80vh] md:h-[650px] animate-in zoom-in duration-300">
            {/* Left Panel: Profile & Activity */}
            <div className="w-full md:w-80 border-r border-surface-border p-8 bg-surface-container-low/50 flex flex-col justify-between overflow-y-auto custom-scrollbar">
              <div>
                <div className="text-center mb-8">
                  <div className="h-24 w-24 rounded-2xl mx-auto mb-4 border border-primary-container p-1 bg-surface-container overflow-hidden">
                    <img 
                      className="w-full h-full object-cover rounded-xl" 
                      src={avatars[members.indexOf(selectedMember) % avatars.length]} 
                      alt={selectedMember.profiles?.full_name} 
                    />
                  </div>
                  <h3 className="font-heading-2 text-2xl text-on-surface uppercase tracking-wider">{selectedMember.profiles?.full_name}</h3>
                  <p className="font-label-caps text-primary-container text-[10px] tracking-widest uppercase">ELITE TIER MEMBER</p>
                </div>

                <div className="space-y-6">
                  <div>
                    <p className="font-label-caps text-[10px] text-on-surface-variant uppercase tracking-[0.2em] mb-3 font-semibold">RECENT ACTIVITY</p>
                    <ul className="space-y-4 max-h-[160px] overflow-y-auto custom-scrollbar pr-1">
                      {memberProgress?.logs && memberProgress.logs.length > 0 ? (
                        memberProgress.logs.slice(0, 3).map((log, index) => (
                          <li key={log.id || index} className="flex gap-3 text-xs">
                            <span className={`material-symbols-outlined text-sm ${log.workout_done ? 'text-success-neon' : 'text-error-ruby'}`}>
                              {log.workout_done ? 'check_circle' : 'error'}
                            </span>
                            <div>
                              <p className="text-on-surface font-semibold">
                                {log.workout_done ? 'Workout Completed' : 'Workout Missed'}
                              </p>
                              <p className="text-on-surface-variant opacity-60 text-[10px]">
                                {new Date(log.logged_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                              </p>
                            </div>
                          </li>
                        ))
                      ) : (
                        <li className="text-zinc-500 text-xs">No recent logs recorded.</li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-surface-border mt-4">
                <p className="font-label-caps text-[10px] text-on-surface-variant uppercase tracking-[0.2em] mb-3 font-semibold">BIO-METRICS</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-surface-container p-3 rounded-xl border border-surface-border">
                    <p className="text-[9px] text-on-surface-variant uppercase font-bold tracking-wider">BMI</p>
                    <p className="text-base font-bold text-primary">24.2</p>
                  </div>
                  <div className="bg-surface-container p-3 rounded-xl border border-surface-border">
                    <p className="text-[9px] text-on-surface-variant uppercase font-bold tracking-wider">BF %</p>
                    <p className="text-base font-bold text-primary">12.5%</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Panel: Data Visualization */}
            <div className="flex-grow p-8 overflow-y-auto custom-scrollbar bg-surface-container-lowest/40 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h4 className="font-heading-2 text-2xl uppercase tracking-widest text-primary-container">PERFORMANCE OVERVIEW</h4>
                  <button className="text-on-surface-variant hover:text-on-surface cursor-pointer" onClick={closeMemberDetail}>
                    <span className="material-symbols-outlined">close</span>
                  </button>
                </div>

                {progressLoading ? (
                  <div className="text-center py-16">
                    <div className="w-10 h-10 border-2 border-primary-container border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-on-surface-variant text-sm">Synchronizing telemetry data...</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Weight Progress Chart */}
                    <div className="bg-surface-container border border-surface-border rounded-2xl p-5 shadow-inner">
                      <div className="flex justify-between items-center mb-4">
                        <p className="font-label-caps text-[10px] tracking-widest text-on-surface-variant uppercase font-bold">Weight Progress (LBS)</p>
                        <div className="flex gap-4">
                          <span className="text-[9px] flex items-center gap-1 font-bold text-primary-container uppercase">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary-container"></span> Actual
                          </span>
                        </div>
                      </div>
                      <div className="h-44 w-full">
                        {chartData.length > 0 ? (
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                              <XAxis dataKey="date" stroke="#a78b7d" fontSize={9} opacity={0.6} tickLine={false} />
                              <YAxis stroke="#a78b7d" fontSize={9} opacity={0.6} tickLine={false} />
                              <Tooltip
                                contentStyle={{ backgroundColor: '#12131a', borderColor: '#27272a', borderRadius: '12px' }}
                                labelStyle={{ color: '#ffb690', fontWeight: 'bold' }}
                                itemStyle={{ color: '#fff' }}
                              />
                              <Line 
                                type="monotone" 
                                dataKey="weight" 
                                stroke="#f97316" 
                                strokeWidth={3} 
                                dot={{ fill: '#f97316', strokeWidth: 1, r: 4 }} 
                                activeDot={{ r: 6 }}
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        ) : (
                          <div className="h-full flex items-center justify-center border border-dashed border-surface-border rounded-xl">
                            <p className="text-zinc-500 text-xs">No progression records available.</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Assigned Plans Grid */}
                    <div>
                      <p className="font-label-caps text-[10px] tracking-widest text-on-surface-variant uppercase font-bold mb-3">ACTIVE ASSIGNED PLANS</p>
                      {memberProgress?.assignments && memberProgress.assignments.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[140px] overflow-y-auto custom-scrollbar pr-1">
                          {memberProgress.assignments.map(assign => (
                            <div key={assign.id} className="bg-surface-container/60 border border-surface-border rounded-xl p-4 flex justify-between items-center hover:bg-surface-container transition-colors">
                              <div className="flex items-center gap-3">
                                <div className="p-2 bg-primary-container/20 rounded-lg">
                                  <span className="material-symbols-outlined text-primary-container text-sm">fitness_center</span>
                                </div>
                                <div>
                                  <p className="font-bold text-xs text-white">{assign.plans?.title}</p>
                                  <p className="text-[9px] text-on-surface-variant tracking-wider uppercase font-semibold">{assign.plans?.type}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-zinc-500 text-xs">No active assignments found.</p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-6 border-t border-surface-border flex gap-4 mt-6">
                <button 
                  onClick={closeMemberDetail}
                  className="flex-grow bg-primary-container text-white font-action-text py-3 rounded-xl transition-all hover:brightness-110 active:scale-95 cursor-pointer text-base uppercase tracking-wider"
                >
                  DISMISS METRICS
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}