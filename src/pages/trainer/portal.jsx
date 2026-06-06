import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { Users, Dumbbell, ClipboardList, LogOut, Plus, X } from 'lucide-react'
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

  useEffect(() => { fetchMembers(); fetchPlans() }, [])

  const fetchMembers = async () => {
    try { const res = await API.get('/trainer/members'); setMembers(res.data) }
    catch (err) { console.error(err) }
  }

  const fetchPlans = async () => {
    try { const res = await API.get('/trainer/plans'); setPlans(res.data) }
    catch (err) { console.error(err) }
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
    } catch (err) { setMessage('Error creating plan') }
  }

  const handleAssign = async (e) => {
    e.preventDefault()
    try {
      await API.post('/trainer/assign', assignForm)
      setMessage('Plan assigned successfully!')
      setAssignForm({ member_id: '', plan_id: '' })
      setTimeout(() => setMessage(''), 3000)
    } catch (err) { setMessage('Error assigning plan') }
  }

  const handleLogout = () => { logout(); navigate('/login') }

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex">
      {/* Sidebar */}
      <div className="w-64 bg-black border-r border-zinc-800 flex flex-col">
        <div className="p-6 border-b border-zinc-800">
          <h1 className="font-display text-3xl text-orange-400 tracking-wider">GYM CMS</h1>
          <p className="text-zinc-500 text-xs mt-1">Trainer Portal</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {[
            { id: 'members', label: 'Members', icon: Users },
            { id: 'plans', label: 'Plans', icon: Dumbbell },
            { id: 'assign', label: 'Assign Plans', icon: ClipboardList },
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
              <p className="text-zinc-500 text-xs">Trainer</p>
            </div>
          </div>
          <button onClick={handleLogout} className="w-full flex items-center gap-2 text-zinc-400 hover:text-red-400 transition-colors text-sm px-2">
            <LogOut size={16} /> Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="bg-black border-b border-zinc-800 px-8 py-5 flex justify-between items-center">
          <div>
            <h2 className="font-display text-3xl tracking-wider text-white">
              {activeTab === 'members' ? 'MEMBERS' : activeTab === 'plans' ? 'PLANS' : 'ASSIGN PLANS'}
            </h2>
            <p className="text-zinc-500 text-sm">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
          {activeTab === 'plans' && (
            <button
              onClick={() => setShowPlanForm(true)}
              className="flex items-center gap-2 bg-green-500 hover:bg-green-400 text-black font-bold px-5 py-2.5 rounded-xl transition-colors"
            >
              <Plus size={18} /> New Plan
            </button>
          )}
        </div>

        <div className="p-8">
          {message && (
            <div className="bg-green-500/10 border border-green-500/30 text-green-400 px-4 py-3 rounded-xl mb-6">
              {message}
            </div>
          )}

          {/* Members Tab */}
          {activeTab === 'members' && (
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-zinc-800">
                    <th className="px-6 py-4 text-left text-zinc-400 text-sm font-medium">Name</th>
                    <th className="px-6 py-4 text-left text-zinc-400 text-sm font-medium">Phone</th>
                    <th className="px-6 py-4 text-left text-zinc-400 text-sm font-medium">Weight</th>
                    <th className="px-6 py-4 text-left text-zinc-400 text-sm font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {members.map((member) => (
                    <tr key={member.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-orange-500/20 border border-orange-500/30 rounded-full flex items-center justify-center text-orange-400 text-sm font-bold">
                            {member.profiles?.full_name?.charAt(0)}
                          </div>
                          <span className="font-medium">{member.profiles?.full_name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-zinc-400">{member.profiles?.phone}</td>
                      <td className="px-6 py-4 font-bold">{member.weight_kg} kg</td>
                      <td className="px-6 py-4">
                        <span className="bg-orange-500/20 text-orange-400 border border-orange-500/30 px-3 py-1 rounded-full text-xs font-bold">
                          {member.status?.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Plans Tab */}
          {activeTab === 'plans' && (
            <div className="grid gap-4">
              {plans.map(plan => (
                <div key={plan.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 hover:border-orange-500/30 transition-colors">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-xl text-white mb-1">{plan.title}</h3>
                      <p className="text-zinc-400">{plan.description}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      plan.type === 'workout'
                        ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                        : 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                    }`}>
                      {plan.type?.toUpperCase()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Assign Tab */}
          {activeTab === 'assign' && (
            <div className="max-w-lg">
              <form onSubmit={handleAssign} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
                <div>
                  <label className="text-zinc-400 text-sm block mb-2">Select Member</label>
                  <select
                    value={assignForm.member_id}
                    onChange={(e) => setAssignForm({...assignForm, member_id: e.target.value})}
                    className="w-full bg-zinc-800 border border-zinc-700 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-orange-500"
                  >
                    <option value="">Choose a member...</option>
                    {members.map(member => (
                      <option key={member.id} value={member.id}>
                        {member.profiles?.full_name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-zinc-400 text-sm block mb-2">Select Plan</label>
                  <select
                    value={assignForm.plan_id}
                    onChange={(e) => setAssignForm({...assignForm, plan_id: e.target.value})}
                    className="w-full bg-zinc-800 border border-zinc-700 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-orange-500"
                  >
                    <option value="">Choose a plan...</option>
                    {plans.map(plan => (
                      <option key={plan.id} value={plan.id}>
                        {plan.title} ({plan.type})
                      </option>
                    ))}
                  </select>
                </div>
                <button type="submit" className="w-full bg-orange-500 hover:bg-orange-400 text-black font-bold py-3 rounded-xl transition-colors">
                  ASSIGN PLAN
                </button>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Create Plan Modal */}
      {showPlanForm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-lg">
            <div className="flex justify-between items-center p-6 border-b border-zinc-800">
              <h3 className="font-display text-2xl text-white tracking-wider">CREATE PLAN</h3>
              <button onClick={() => setShowPlanForm(false)} className="text-zinc-400 hover:text-white">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleCreatePlan} className="p-6 space-y-4">
              <div>
                <label className="text-zinc-400 text-sm block mb-2">Plan Title</label>
                <input
                  type="text"
                  value={newPlan.title}
                  onChange={(e) => setNewPlan({...newPlan, title: e.target.value})}
                  className="w-full bg-zinc-800 border border-zinc-700 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-orange-500"
                  placeholder="Hybrid Warrior Protocol"
                />
              </div>
              <div>
                <label className="text-zinc-400 text-sm block mb-2">Type</label>
                <select
                  value={newPlan.type}
                  onChange={(e) => setNewPlan({...newPlan, type: e.target.value})}
                  className="w-full bg-zinc-800 border border-zinc-700 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-orange-500"
                >
                  <option value="workout">Workout</option>
                  <option value="nutrition">Nutrition</option>
                </select>
              </div>
              <div>
                <label className="text-zinc-400 text-sm block mb-2">Description</label>
                <textarea
                  value={newPlan.description}
                  onChange={(e) => setNewPlan({...newPlan, description: e.target.value})}
                  className="w-full bg-zinc-800 border border-zinc-700 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-orange-500"
                  rows="4"
                  placeholder="Describe the plan..."
                />
              </div>
              <button type="submit" className="w-full bg-orange-500 hover:bg-orange-400 text-black font-bold py-3 rounded-xl transition-colors">
                CREATE PLAN
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}