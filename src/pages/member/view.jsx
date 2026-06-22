import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
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
  const [checkedInToday, setCheckedInToday] = useState(false)
  const [checkinMessage, setCheckinMessage] = useState('')

  useEffect(() => {
    fetchPlans()
    fetchProgress()
  }, [])

  const fetchPlans = async () => {
    try {
      const res = await API.get('/member/my-plans')
      setPlans(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  const fetchProgress = async () => {
    try {
      const res = await API.get('/member/my-progress')
      setProgress(res.data)
    } catch (err) {
      console.error(err)
    }
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
    } catch (err) {
      setMessage('Error logging progress')
    }
  }

  const handleCheckIn = async () => {
    try {
      await API.post('/checkin/check-in')
      setCheckedInToday(true)
      setCheckinMessage('Checked in successfully! 💪')
      setTimeout(() => setCheckinMessage(''), 3000)
    } catch (err) {
      if (err.response?.data?.message === 'Already checked in today') {
        setCheckedInToday(true)
        setCheckinMessage('You already checked in today')
      } else {
        setCheckinMessage('Error checking in')
      }
      setTimeout(() => setCheckinMessage(''), 3000)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  // Chart data
  const chartData = [...progress].reverse().map((log, i) => ({
    week: `WK ${i + 1}`,
    weight: log.weight_kg
  }))

  const workoutsDone = progress.filter(p => p.workout_done).length

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
              { id: 'plans', label: 'My Plans', icon: 'fitness_center' },
              { id: 'log', label: 'Log Progress', icon: 'assignment' },
              { id: 'progress', label: 'My Progress', icon: 'bar_chart' },
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
        </div>

        <div className="px-6 border-t border-surface-border pt-6">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-9 h-9 bg-primary-container rounded-full flex items-center justify-center text-white font-bold text-sm">
              {user?.name?.charAt(0)}
            </div>
            <div>
              <p className="text-white text-xs font-semibold">{user?.name}</p>
              <p className="text-zinc-500 text-[10px] uppercase tracking-wider">Member</p>
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
              {activeTab === 'plans' ? 'MY WORKOUTS' : activeTab === 'log' ? 'LOG ANTRY' : 'PROGRESS METRICS'}
            </h2>
          </div>
        </header>

        {/* Page Canvas */}
        <div className="p-8 flex-grow custom-scrollbar overflow-y-auto">
          
          {/* Today's Check-In Card */}
          <div className="glass-card rounded-2xl p-6 mb-6 flex items-center justify-between glow-accent">
            <div>
              <h3 className="text-white font-bold text-lg">Today's Check-In</h3>
              <p className="text-on-surface-variant text-sm">Tap in when you arrive at the gym</p>
            </div>
            <button
              onClick={handleCheckIn}
              disabled={checkedInToday}
              className={`px-6 py-3 rounded-xl font-action-text tracking-widest text-sm transition-all cursor-pointer ${
                checkedInToday
                  ? 'bg-surface-container-high text-on-surface-variant/40 border border-surface-border cursor-not-allowed'
                  : 'bg-primary-container hover:brightness-110 text-white shadow-lg shadow-primary-container/20'
              }`}
            >
              {checkedInToday ? '✓ CHECKED IN' : 'CHECK IN'}
            </button>
          </div>

          {checkinMessage && (
            <div className="bg-primary-container/10 border border-primary-container/20 text-primary-container px-4 py-3 rounded-xl mb-6 text-sm">
              {checkinMessage}
            </div>
          )}

          {message && (
            <div className="bg-success-neon/10 border border-success-neon/20 text-success-neon px-4 py-3 rounded-xl mb-6 text-sm">
              {message}
            </div>
          )}

          {/* Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[
              { label: 'Assigned Plans', value: plans.length, color: 'primary-container' },
              { label: 'Workouts Completed', value: workoutsDone, color: 'info-blue' },
              { label: 'Logged Entries', value: progress.length, color: 'success-neon' },
            ].map((stat) => (
              <div key={stat.label} className="bg-surface-container-low border border-surface-border rounded-2xl p-6 hover:border-primary-container/50 transition-colors group">
                <p className="font-label-caps text-on-surface-variant mb-2 text-[10px] tracking-widest uppercase">{stat.label}</p>
                <p className={`font-display-lg text-4xl leading-none text-${stat.color}`}>{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Tab Contents */}
          {activeTab === 'plans' && (
            <div className="grid grid-cols-1 gap-6">
              {plans.length === 0 ? (
                <div className="bg-surface-container-low border border-surface-border rounded-2xl p-12 text-center">
                  <span className="material-symbols-outlined text-[48px] text-on-surface-variant opacity-30 mb-2">fitness_center</span>
                  <p className="text-on-surface-variant text-sm">No plans assigned yet. Consult your supervisor/trainer.</p>
                </div>
              ) : (
                plans.map(assignment => (
                  <div key={assignment.id} className="bg-surface-container-low border border-surface-border hover:border-primary-container/30 rounded-2xl p-6 transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-lg text-white mb-2">{assignment.plans?.title}</h3>
                        <p className="text-on-surface-variant text-sm leading-relaxed">{assignment.plans?.description}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wider ${
                        assignment.plans?.type === 'workout'
                          ? 'bg-info-blue/10 text-info-blue border-info-blue/20'
                          : 'bg-primary-container/10 text-primary-container border-primary-container/20'
                      }`}>
                        {assignment.plans?.type}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'log' && (
            <div className="max-w-lg bg-surface-container-low border border-surface-border rounded-2xl p-6">
              <h3 className="font-heading-2 text-xl mb-6 uppercase tracking-wider">Log Metrics Entry</h3>
              <form onSubmit={handleLogProgress} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-label-caps text-xs text-on-surface-variant font-semibold uppercase tracking-wider ml-1">Current Weight (kg)</label>
                  <input
                    type="number"
                    value={logForm.weight_kg}
                    onChange={(e) => setLogForm({...logForm, weight_kg: e.target.value})}
                    className="w-full bg-surface-container border border-surface-border text-white px-4 py-3 rounded-xl focus:outline-none focus:border-primary-container text-2xl font-bold"
                    placeholder="75"
                    required
                  />
                </div>
                
                <div
                  onClick={() => setLogForm({...logForm, workout_done: !logForm.workout_done})}
                  className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                    logForm.workout_done
                      ? 'bg-primary-container/10 border-primary-container/30'
                      : 'bg-surface-container border-surface-border'
                  }`}
                >
                  <span className={`material-symbols-outlined text-[24px] ${logForm.workout_done ? 'text-primary-container' : 'text-on-surface-variant/40'}`}>
                    {logForm.workout_done ? 'check_box' : 'check_box_outline_blank'}
                  </span>
                  <div>
                    <p className="font-semibold text-sm text-white">Workout Completed</p>
                    <p className="text-on-surface-variant text-xs">Did you complete your workout this week?</p>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-label-caps text-xs text-on-surface-variant font-semibold uppercase tracking-wider ml-1">Notes / Feedback</label>
                  <textarea
                    value={logForm.notes}
                    onChange={(e) => setLogForm({...logForm, notes: e.target.value})}
                    className="w-full bg-surface-container border border-surface-border text-white px-4 py-3 rounded-xl focus:outline-none focus:border-primary-container text-sm"
                    rows="3"
                    placeholder="How was the intensity, duration, fatigue?"
                  />
                </div>
                <button 
                  type="submit" 
                  className="w-full bg-primary-container hover:brightness-110 text-white font-action-text py-3.5 rounded-xl transition-all font-bold tracking-wider cursor-pointer"
                >
                  SUBMIT METRICS
                </button>
              </form>
            </div>
          )}

          {activeTab === 'progress' && (
            <div className="space-y-6">
              {/* Weight Chart */}
              {chartData.length > 0 && (
                <div className="bg-surface-container-low border border-surface-border rounded-2xl p-6 shadow-xl">
                  <h3 className="font-heading-2 text-on-surface text-xl mb-1 tracking-wider">WEIGHT LOG</h3>
                  <p className="text-on-surface-variant text-xs mb-6">Tracking weight progression across logged metrics</p>
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData} margin={{ left: -20 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                        <XAxis dataKey="week" stroke="#a78b7d" fontSize={10} opacity={0.6} tickLine={false} />
                        <YAxis stroke="#a78b7d" fontSize={10} opacity={0.6} tickLine={false} />
                        <Tooltip
                          contentStyle={{ backgroundColor: '#12131a', border: '1px solid #27272a', borderRadius: '12px' }}
                          labelStyle={{ color: '#ffb690', fontWeight: 'bold' }}
                          itemStyle={{ color: '#fff' }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="weight" 
                          stroke="#f97316" 
                          strokeWidth={3} 
                          dot={{ fill: '#f97316', r: 4 }} 
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {/* Progress Logs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {progress.length === 0 ? (
                  <div className="bg-surface-container-low border border-surface-border rounded-2xl p-12 text-center col-span-2">
                    <span className="material-symbols-outlined text-[48px] text-zinc-600 mb-2">bar_chart</span>
                    <p className="text-on-surface-variant text-sm">No progression records registered yet.</p>
                  </div>
                ) : (
                  progress.map(log => (
                    <div key={log.id} className="bg-surface-container-low border border-surface-border rounded-2xl p-5 hover:border-primary-container/30 transition-colors flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-center mb-3">
                          <span className="font-display-lg text-3xl text-primary">{log.weight_kg} KG</span>
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-widest ${
                            log.workout_done
                              ? 'bg-success-neon/10 text-success-neon border-success-neon/20'
                              : 'bg-error-ruby/10 text-error-ruby border-error-ruby/20'
                          }`}>
                            {log.workout_done ? '✓ WORKOUT' : '✗ MISSED'}
                          </span>
                        </div>
                        {log.notes && <p className="text-on-surface-variant text-sm leading-relaxed mb-4">{log.notes}</p>}
                      </div>
                      <p className="text-zinc-500 text-[10px] font-semibold uppercase tracking-wider">
                        {new Date(log.logged_at).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}