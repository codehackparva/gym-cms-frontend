import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { Dumbbell, TrendingUp, ClipboardList, LogOut, CheckCircle, XCircle } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import API from '../../api/axios'

export default function MemberView() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [plans, setPlans] = useState([])
  const [progress, setProgress] = useState([])
  const [activeTab, setActiveTab] = useState('plans')
  const [logForm, setLogForm] = useState({ weight_kg: '', workout_done: false, notes: '' })
  const [message, setMessage] = useState('')

  useEffect(() => { fetchPlans(); fetchProgress() }, [])

  const fetchPlans = async () => {
    try { const res = await API.get('/member/my-plans'); setPlans(res.data) }
    catch (err) { console.error(err) }
  }

  const fetchProgress = async () => {
    try { const res = await API.get('/member/my-progress'); setProgress(res.data) }
    catch (err) { console.error(err) }
  }

  const handleLogProgress = async (e) => {
    e.preventDefault()
    try {
      await API.post('/member/log-progress', {
        weight_kg: parseFloat(logForm.weight_kg),
        workout_done: logForm.workout_done,
        notes: logForm.notes
      })
      setMessage('Progress logged successfully!')
      setLogForm({ weight_kg: '', workout_done: false, notes: '' })
      fetchProgress()
      setTimeout(() => setMessage(''), 3000)
    } catch (err) { setMessage('Error logging progress') }
  }

  const handleLogout = () => { logout(); navigate('/login') }

  // Chart data
  const chartData = [...progress].reverse().map((log, i) => ({
    week: `Week ${i + 1}`,
    weight: log.weight_kg
  }))

  const workoutsDone = progress.filter(p => p.workout_done).length

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex">
      {/* Sidebar */}
      <div className="w-64 bg-black border-r border-zinc-800 flex flex-col">
        <div className="p-6 border-b border-zinc-800">
          <h1 className="font-display text-3xl text-orange-400 tracking-wider">GYM CMS</h1>
          <p className="text-zinc-500 text-xs mt-1">Member Portal</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {[
            { id: 'plans', label: 'My Plans', icon: Dumbbell },
            { id: 'log', label: 'Log Progress', icon: ClipboardList },
            { id: 'progress', label: 'My Progress', icon: TrendingUp },
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
              <p className="text-zinc-500 text-xs">Member</p>
            </div>
          </div>
          <button onClick={handleLogout} className="w-full flex items-center gap-2 text-zinc-400 hover:text-red-400 transition-colors text-sm px-2">
            <LogOut size={16} /> Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="bg-black border-b border-zinc-800 px-8 py-5">
          <h2 className="font-display text-3xl tracking-wider text-white">
            {activeTab === 'plans' ? 'MY PLANS' : activeTab === 'log' ? 'LOG PROGRESS' : 'MY PROGRESS'}
          </h2>
          <p className="text-zinc-500 text-sm">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>

        <div className="p-8">
          {message && (
            <div className="bg-orange-500/10 border border-orange-500/30 text-orange-400 px-4 py-3 rounded-xl mb-6">
              {message}
            </div>
          )}

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-6 mb-8">
            {[
              { label: 'Assigned Plans', value: plans.length, color: 'orange' },
              { label: 'Workouts Done', value: workoutsDone, color: 'blue' },
              { label: 'Progress Logs', value: progress.length, color: 'purple' },
            ].map((stat) => (
              <div key={stat.label} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                <p className="text-zinc-400 text-sm mb-2">{stat.label}</p>
                <p className={`font-display text-5xl ${
                  stat.color === 'orange' ? 'text-orange-400' :
                  stat.color === 'blue' ? 'text-blue-400' : 'text-purple-400'
                }`}>{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Plans Tab */}
          {activeTab === 'plans' && (
            <div className="grid gap-4">
              {plans.length === 0 ? (
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-12 text-center">
                  <Dumbbell size={48} className="text-zinc-600 mx-auto mb-4" />
                  <p className="text-zinc-400">No plans assigned yet. Ask your trainer!</p>
                </div>
              ) : (
                plans.map(assignment => (
                  <div key={assignment.id} className="bg-zinc-900 border border-zinc-800 hover:border-orange-500/30 rounded-2xl p-6 transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-xl text-white mb-2">{assignment.plans?.title}</h3>
                        <p className="text-zinc-400">{assignment.plans?.description}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        assignment.plans?.type === 'workout'
                          ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                          : 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                      }`}>
                        {assignment.plans?.type?.toUpperCase()}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Log Progress Tab */}
          {activeTab === 'log' && (
            <div className="max-w-lg">
              <form onSubmit={handleLogProgress} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-5">
                <div>
                  <label className="text-zinc-400 text-sm block mb-2">Current Weight (kg)</label>
                  <input
                    type="number"
                    value={logForm.weight_kg}
                    onChange={(e) => setLogForm({...logForm, weight_kg: e.target.value})}
                    className="w-full bg-zinc-800 border border-zinc-700 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-orange-500 text-2xl font-bold"
                    placeholder="75"
                  />
                </div>
                <div
                  onClick={() => setLogForm({...logForm, workout_done: !logForm.workout_done})}
                  className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                    logForm.workout_done
                      ? 'bg-orange-500/10 border-orange-500/30'
                      : 'bg-zinc-800 border-zinc-700'
                  }`}
                >
                  {logForm.workout_done
                    ? <CheckCircle size={24} className="text-orange-400" />
                    : <XCircle size={24} className="text-zinc-500" />
                  }
                  <div>
                    <p className="font-medium text-white">Workout Completed</p>
                    <p className="text-zinc-400 text-sm">Did you complete your workout this week?</p>
                  </div>
                </div>
                <div>
                  <label className="text-zinc-400 text-sm block mb-2">Notes</label>
                  <textarea
                    value={logForm.notes}
                    onChange={(e) => setLogForm({...logForm, notes: e.target.value})}
                    className="w-full bg-zinc-800 border border-zinc-700 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-orange-500"
                    rows="3"
                    placeholder="How did it go this week?"
                  />
                </div>
                <button type="submit" className="w-full bg-orange-500 hover:bg-orange-400 text-black font-bold py-3 rounded-xl transition-colors">
                  LOG PROGRESS
                </button>
              </form>
            </div>
          )}

          {/* Progress Tab */}
          {activeTab === 'progress' && (
            <div className="space-y-6">
              {/* Weight Chart */}
              {chartData.length > 0 && (
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                  <h3 className="font-bold text-white mb-6">Weight Progress</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                      <XAxis dataKey="week" stroke="#71717a" />
                      <YAxis stroke="#71717a" />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#18181b', border: '1px solid #3f3f46', borderRadius: '8px' }}
                        labelStyle={{ color: '#fff' }}
                      />
                      <Line type="monotone" dataKey="weight" stroke="#f97316" strokeWidth={3} dot={{ fill: '#f97316', r: 5 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}

              {/* Progress Logs */}
              <div className="grid gap-4">
                {progress.length === 0 ? (
                  <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-12 text-center">
                    <TrendingUp size={48} className="text-zinc-600 mx-auto mb-4" />
                    <p className="text-zinc-400">No progress logged yet. Start tracking!</p>
                  </div>
                ) : (
                  progress.map(log => (
                    <div key={log.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-display text-3xl text-orange-400">{log.weight_kg} KG</span>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          log.workout_done
                            ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                            : 'bg-red-500/20 text-red-400 border border-red-500/30'
                        }`}>
                          {log.workout_done ? '✓ WORKOUT DONE' : '✗ MISSED'}
                        </span>
                      </div>
                      {log.notes && <p className="text-zinc-400 text-sm mb-2">{log.notes}</p>}
                      <p className="text-zinc-600 text-xs">{new Date(log.logged_at).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}