import { useEffect ,useMemo, useState } from 'react'
import {
  ArrowDownRight, ArrowRight, ArrowUpRight, CalendarDays, Check,
  CheckCircle2, ChevronDown, ClipboardCheck, Clock3, Droplets,
  House, LayoutDashboard, Leaf, LockKeyhole, Menu, MessageCircle,
  Plus, ShieldCheck, Sparkles, Wrench, X, Zap,LogOut
} from 'lucide-react'
import{supabase} from './lib/supabase'
const initialRequests = [
  { id: 'HC-1042', title: 'Bathroom tap leak', type: 'Plumbing', date: 'Oct 18, 2026', status: 'Awaiting approval', cost: '₹1,250', icon: Droplets },
  { id: 'HC-1038', title: 'Monthly property inspection', type: 'Inspection', date: 'Oct 21, 2026', status: 'Scheduled', cost: 'Included in plan', icon: ClipboardCheck },
  { id: 'HC-1029', title: 'Garden and exterior upkeep', type: 'General upkeep', date: 'Oct 10, 2026', status: 'Completed', cost: '₹850', icon: Leaf },
]
const services = [
  { icon: ClipboardCheck, title: 'Routine inspections', desc: 'Scheduled walk-throughs to spot small issues before they become costly repairs.', tag: 'MOST POPULAR' },
  { icon: Droplets, title: 'Leak & plumbing checks', desc: 'Look for damp patches, dripping taps, blocked drains and visible water damage.', tag: 'PREVENTIVE CARE' },
  { icon: Zap, title: 'Electrical safety checks', desc: 'Basic visual checks of switches, sockets and visible electrical concerns.', tag: 'SAFETY FIRST' },
  { icon: Sparkles, title: 'Cleaning & upkeep', desc: 'Get your property freshened up and ready for your next visit.', tag: 'HOME READY' },
]
const initialBookings = [
  { id: 'HC-1038', service: 'Monthly property inspection', date: '2026-10-21', notes: 'Check for dampness, windows and exterior condition.' }
]

function Logo({ light = false }) {
  return <div className={`flex items-center gap-2.5 ${light ? 'text-white' : 'text-forest'}`}>
    <div className={`grid h-10 w-10 place-items-center rounded-2xl ${light ? 'bg-white/10' : 'bg-forest'}`}>
      <House size={21} strokeWidth={1.8} className="text-white" />
    </div>
    <div className="leading-tight">
      <div className="font-serif text-[22px] font-semibold tracking-tight">HavenCare</div>
      <div className={`mt-0.5 text-[9px] font-semibold uppercase tracking-[0.22em] ${light ? 'text-white/60' : 'text-moss'}`}>Your home, cared for</div>
    </div>
  </div>
}

function Button({ children, onClick, variant = 'primary', className = '', type = 'button' }) {
  const style = variant === 'primary'
    ? 'bg-forest text-white hover:bg-[#245542]'
    : variant === 'outline'
      ? 'border border-[#d9ded6] bg-white text-forest hover:border-forest'
      : 'bg-[#edf1e9] text-forest hover:bg-[#e2e9dc]'
  return <button type={type} onClick={onClick} className={`inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition duration-200 ${style} ${className}`}>{children}</button>
}

function Status({ status }) {
  const styles = {
    'Awaiting approval': 'bg-amber-50 text-amber-800 ring-amber-200',
    Scheduled: 'bg-blue-50 text-blue-800 ring-blue-200',
    Accepted: 'bg-blue-50 text-blue-800 ring-blue-200',
    'In progress': 'bg-violet-50 text-violet-800 ring-violet-200',
    Completed: 'bg-emerald-50 text-emerald-800 ring-emerald-200',
    Cancelled: 'bg-red-50 text-red-800 ring-red-200',
    'Request received': 'bg-violet-50 text-violet-800 ring-violet-200',
  }

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ring-inset ${
        styles[status] || styles['Request received']
      }`}
    >
      {status}
    </span>
  )
}

function Header({ page, setPage, onBook, user, onLogout }) {
  const isEmployee = user?.role === 'employee'

  return (
    <header className="sticky top-0 z-40 border-b border-[#e7eae3] bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:px-8">

        {/* LOGO */}
        <button
          onClick={() => {
            if (isEmployee) {
              setPage('dashboard')
            } else {
              setPage('home')
            }
          }}
          className="flex items-center gap-2"
        >
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-forest text-white">
            <ShieldCheck size={18} />
          </div>

          <div className="text-left">
            <div className="font-serif text-xl font-semibold tracking-tight text-forest">
              HavenCare
            </div>

            <div className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#89928b]">
              {isEmployee ? 'Employee Portal' : 'Home Care'}
            </div>
          </div>
        </button>

        {/* NAVIGATION */}
        <nav className="hidden items-center gap-1 md:flex">

          {/* HOMEOWNER NAVIGATION */}
          {!isEmployee && (
            <>
              <button
                onClick={() => setPage('home')}
                className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                  page === 'home'
                    ? 'bg-[#eaf0e4] text-forest'
                    : 'text-[#738078] hover:bg-[#f5f6f0] hover:text-forest'
                }`}
              >
                Home
              </button>

              <button
                onClick={() => setPage('services')}
                className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                  page === 'services'
                    ? 'bg-[#eaf0e4] text-forest'
                    : 'text-[#738078] hover:bg-[#f5f6f0] hover:text-forest'
                }`}
              >
                Services
              </button>
            </>
          )}

          {/* DASHBOARD / MY JOBS */}
          <button
            onClick={() => setPage('dashboard')}
            className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
              page === 'dashboard'
                ? 'bg-[#eaf0e4] text-forest'
                : 'text-[#738078] hover:bg-[#f5f6f0] hover:text-forest'
            }`}
          >
            {isEmployee ? 'My Jobs' : 'Dashboard'}
          </button>

        </nav>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-3">

          {/* HOMEOWNER REQUEST BUTTON */}
          {!isEmployee && (
            <Button
              onClick={() => onBook()}
              className="hidden sm:flex"
            >
              <Plus size={16} />
              Request service
            </Button>
          )}

          {/* USER */}
          <div className="hidden text-right sm:block">
            <div className="text-xs font-semibold text-forest">
              {user?.name}
            </div>

            <div className="text-[10px] text-[#89928b]">
              {isEmployee ? 'Maintenance Employee' : 'Homeowner'}
            </div>
          </div>

          {/* LOGOUT */}
          <button
            onClick={onLogout}
            className="grid h-9 w-9 place-items-center rounded-full border border-[#e1e5de] text-[#738078] transition hover:bg-[#f5f6f0] hover:text-forest"
            title="Log out"
          >
            <LogOut size={16} />
          </button>

        </div>

      </div>
    </header>
  )
}
function HomePage({ setPage, onBook }) {
  return <>
    <section className="relative overflow-hidden bg-cream">
      <div className="absolute -right-24 -top-28 h-96 w-96 rounded-full bg-[#e8eddf] blur-3xl" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 pb-16 pt-12 md:px-8 md:pb-24 md:pt-20 lg:grid-cols-[1.02fr_.98fr] lg:gap-16">
        <div className="animate-rise">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#dce3d5] bg-white/70 px-3.5 py-2 text-xs font-semibold text-moss"><span className="h-2 w-2 rounded-full bg-[#80a06c]" /> PROPERTY CARE, WITH PEACE OF MIND</div>
          <h1 className="max-w-2xl font-serif text-[3.25rem] leading-[1.04] tracking-[-0.045em] text-forest sm:text-6xl lg:text-[4.5rem]">Away from home.<br /><em className="font-normal text-[#78906d]">Never away</em> from its care.</h1>
          <p className="mt-6 max-w-lg text-base leading-7 text-[#69766e] sm:text-lg">Your home holds memories. We help you look after it with regular inspections, timely maintenance, and clear updates — wherever life takes you.</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button onClick={onBook} className="py-3.5">Arrange a home visit <ArrowRight size={17} /></Button>
            <Button variant="outline" onClick={() => setPage('services')} className="py-3.5">Explore our services <ArrowDownRight size={17} /></Button>
          </div>
          <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-[#e0e4da] pt-6 text-xs font-medium text-[#617065]">
            <span className="flex items-center gap-2"><ShieldCheck size={16} className="text-moss" /> Care you can trust</span>
            <span className="flex items-center gap-2"><ClipboardCheck size={16} className="text-moss" /> Clear visit reports</span>
            <span className="flex items-center gap-2"><LockKeyhole size={15} className="text-moss" /> Owner-approved repairs</span>
          </div>
        </div>
        <div className="relative mx-auto w-full max-w-xl animate-rise [animation-delay:120ms]">
          <div className="hero-photo relative overflow-hidden rounded-[2rem] shadow-soft">
            <img src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&q=85" alt="Warm, welcoming modern home surrounded by greenery" className="h-[390px] w-full object-cover sm:h-[510px]" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#10291f]/55 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between gap-4 text-white sm:bottom-8 sm:left-8 sm:right-8">
              <div><div className="text-xs font-medium uppercase tracking-[0.18em] text-white/75">The HavenCare promise</div><div className="mt-2 font-serif text-2xl sm:text-3xl">Come home to peace.</div></div>
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-white/40 bg-white/15 backdrop-blur"><ArrowUpRight size={22} /></div>
            </div>
          </div>
          <div className="absolute -left-4 top-8 flex items-center gap-3 rounded-2xl border border-white/70 bg-white/95 p-3.5 shadow-soft sm:-left-8 sm:top-14">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#edf2e8] text-forest"><CheckCircle2 size={21} /></div>
            <div><div className="text-sm font-bold text-ink">Your home, checked</div><div className="mt-0.5 text-xs text-[#7b867e]">Updates you can count on</div></div>
          </div>
          <div className="absolute -bottom-5 right-5 flex items-center gap-3 rounded-2xl border border-white/70 bg-white/95 p-3.5 shadow-soft sm:-right-4">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#f7edda] text-[#96703a]"><CalendarDays size={20} /></div>
            <div><div className="text-sm font-bold text-ink">Care, on schedule</div><div className="mt-0.5 text-xs text-[#7b867e]">Routine visits & upkeep</div></div>
          </div>
        </div>
      </div>
    </section>

    <section className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-24">
      <div className="mx-auto max-w-2xl text-center">
        <p className="eyebrow">A HOME IS MORE THAN A BUILDING</p>
        <h2 className="section-title">It deserves to be looked after.</h2>
        <p className="mt-4 leading-7 text-[#738078]">An empty home can hide small problems that grow over time. HavenCare helps you stay one step ahead — without having to be there yourself.</p>
      </div>
      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {[
          { n: '01', title: 'Catch issues early', text: 'Routine checks help identify visible leaks, dampness and maintenance needs before they escalate.', icon: Droplets },
          { n: '02', title: 'Know what is happening', text: 'Receive clear updates, photos and repair estimates, without chasing multiple people.', icon: MessageCircle },
          { n: '03', title: 'Stay in control', text: 'You remain the decision-maker. Additional repairs are proposed for your approval first.', icon: ShieldCheck },
        ].map(({ n, title, text, icon: Icon }) => <div key={n} className="rounded-3xl border border-[#e9ebe4] bg-white p-7 transition hover:-translate-y-1 hover:shadow-soft">
          <div className="flex items-center justify-between"><div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#edf2e8] text-forest"><Icon size={22} /></div><span className="font-serif text-3xl text-[#d9e0d3]">{n}</span></div>
          <h3 className="mt-7 font-serif text-2xl text-forest">{title}</h3><p className="mt-3 text-sm leading-6 text-[#758078]">{text}</p>
        </div>)}
      </div>
    </section>

    <section className="bg-[#edf0e7]">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-16 md:px-8 md:py-20 lg:grid-cols-2">
        <div className="overflow-hidden rounded-[1.75rem]"><img src="https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1200&q=85" alt="Peaceful home interior prepared for its owners" className="h-[300px] w-full object-cover sm:h-[410px]" /></div>
        <div className="lg:pl-8">
          <p className="eyebrow">SIMPLE, THOUGHTFUL, RELIABLE</p><h2 className="section-title max-w-lg">Three steps to a home that feels looked after.</h2>
          <div className="mt-8 space-y-6">
            {[['01', 'Tell us about your home', 'Share the property location and the kind of care you need.'], ['02', 'We check, document and update', 'Receive an inspection summary and photos after the visit.'], ['03', 'Approve the next steps', 'Review any recommended repairs and approve costs before work begins.']].map(([n, title, text]) => <div className="flex gap-4" key={n}><div className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-[#cdd7c6] font-serif text-sm text-forest">{n}</div><div><h3 className="font-semibold text-forest">{title}</h3><p className="mt-1 text-sm leading-6 text-[#758078]">{text}</p></div></div>)}
          </div>
          <Button onClick={onBook} className="mt-8">Request your first visit <ArrowRight size={16} /></Button>
        </div>
      </div>
    </section>

    <section className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-24">
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div><p className="eyebrow">HERE WHEN YOU NEED US</p><h2 className="section-title">Care for every corner.</h2></div>
        <button onClick={() => setPage('services')} className="inline-flex items-center gap-2 self-start text-sm font-semibold text-forest hover:gap-3 sm:self-auto">View all services <ArrowRight size={16} /></button>
      </div>
      <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {services.map(({ icon: Icon, title, desc, tag }) => <div key={title} className="rounded-3xl border border-[#e9ebe4] p-6 hover:border-[#c6d3c0]">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#edf2e8] text-forest"><Icon size={22} /></div>
          <div className="mt-5 text-[9px] font-bold tracking-[0.16em] text-moss">{tag}</div><h3 className="mt-2 font-serif text-xl text-forest">{title}</h3><p className="mt-2 text-sm leading-6 text-[#758078]">{desc}</p>
        </div>)}
      </div>
    </section>
    <section className="px-5 pb-16 md:px-8 md:pb-24">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-forest px-7 py-12 text-center text-white sm:px-12 sm:py-16">
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-white/10"><House size={23} /></div>
        <h2 className="mx-auto mt-5 max-w-2xl font-serif text-3xl leading-tight sm:text-5xl">Your home is waiting. Let us help it stay ready.</h2>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-white/65">Start with a conversation about your property and the care it needs.</p>
        <Button onClick={onBook} variant="secondary" className="mt-7 bg-white text-forest hover:bg-[#edf1e9]">Request a visit <ArrowRight size={16} /></Button>
      </div>
    </section>
  </>
}

function ServicesPage({ onBook }) {
  return <main className="mx-auto max-w-7xl px-5 py-12 md:px-8 md:py-20">
    <p className="eyebrow">OUR SERVICES</p><h1 className="section-title max-w-3xl">Consistent care. Clear communication. A home looked after.</h1>
    <p className="mt-4 max-w-2xl leading-7 text-[#738078]">Choose the support that suits your property. Every visit should leave you with a clearer picture of your home's condition and what needs attention.</p>
    <div className="mt-10 grid gap-5 sm:grid-cols-2">
      {services.map(({ icon: Icon, title, desc, tag }, i) => <article key={title} className="flex flex-col rounded-3xl border border-[#e6e9e1] bg-white p-7 sm:p-8">
        <div className="flex items-start justify-between"><div className="grid h-14 w-14 place-items-center rounded-2xl bg-[#edf2e8] text-forest"><Icon size={25} /></div><span className="rounded-full bg-[#f5f6f0] px-3 py-1.5 text-[9px] font-bold tracking-[0.14em] text-moss">{tag}</span></div>
        <h2 className="mt-6 font-serif text-2xl text-forest">{title}</h2><p className="mt-3 flex-1 text-sm leading-6 text-[#758078]">{desc}</p>
        <div className="mt-6 border-t border-[#edf0e9] pt-5"><p className="text-xs leading-5 text-[#758078]">{i === 0 ? 'Includes a documented checklist and photo summary.' : i === 1 ? 'Recommended work and estimated costs are shared before proceeding.' : i === 2 ? 'Specialist work should be handled by appropriately qualified professionals.' : 'Visit scope and preparation needs are confirmed before booking.'}</p><Button onClick={() => onBook(title)} variant="outline" className="mt-5 w-full">Request this service <ArrowRight size={16} /></Button></div>
      </article>)}
    </div>
    <div className="mt-10 rounded-3xl bg-[#edf0e7] p-7 sm:p-10"><div className="flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center"><div><h2 className="font-serif text-2xl text-forest">Not sure what your home needs?</h2><p className="mt-2 text-sm text-[#738078]">Start with an inspection request. We can discuss the right next steps.</p></div><Button onClick={() => onBook('Routine inspections')}>Request an inspection <ArrowRight size={16} /></Button></div></div>
  </main>
}

function DashboardPage({ requests, setRequests, bookings, setBookings, onBook, user }) {
  if (user?.role === 'employee') {
    return (
      <EmployeeDashboard
        requests={requests}
        setRequests={setRequests}
        user={user}
      />
    )
  }

  return (
    <HomeownerDashboard
      requests={requests}
      setRequests={setRequests}
      bookings={bookings}
      setBookings={setBookings}
      onBook={onBook}
      user={user}
    />
  )
}
function HomeownerDashboard({
  requests,
  setRequests,
  bookings,
  setBookings,
  onBook,
  user
}) {
  const [filter, setFilter] = useState('All')

  // Convert Supabase request data into the format
  // this original dashboard was designed to use.
  const displayRequests = useMemo(() => {
    return requests.map(request => ({
      ...request,

      title: request.title || request.service_type,

      type: request.service_type,

      date: request.preferred_date
        ? new Date(`${request.preferred_date}T12:00:00`)
            .toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric'
            })
        : 'Date not specified',

      cost: '—',

      icon: Wrench,

      displayStatus:
        request.status === 'pending'
          ? 'Awaiting approval'
          : request.status === 'assigned'
            ? 'Scheduled'
            : request.status === 'accepted'
              ? 'Scheduled'
              : request.status === 'in_progress'
                ? 'In progress'
                : request.status === 'completed'
                  ? 'Completed'
                  : request.status === 'cancelled'
                    ? 'Cancelled'
                    : request.status
    }))
  }, [requests])

  const filtered = useMemo(
    () =>
      filter === 'All'
        ? displayRequests
        : displayRequests.filter(
            r => r.displayStatus === filter
          ),
    [displayRequests, filter]
  )

  const approve = async (id) => {
    const { data, error } = await supabase
      .from('maintenance_requests')
      .update({
        status: 'accepted'
      })
      .eq('id', id)
      .eq('homeowner_id', user.id)
      .select()
      .single()

    if (error) {
      console.error('Error approving request:', error)
      alert(`Could not approve request: ${error.message}`)
      return
    }

    setRequests(prev =>
      prev.map(r =>
        r.id === id
          ? { ...r, status: data.status }
          : r
      )
    )
  }

  return (
    <main className="min-h-[75vh] bg-[#f7f8f4]">
      <div className="mx-auto max-w-7xl px-5 py-10 md:px-8 md:py-14">

        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="eyebrow">
              HOMEOWNER PORTAL
            </p>

            <h1 className="font-serif text-4xl tracking-tight text-forest sm:text-5xl">
              Hello, {user?.name || 'there'}.
            </h1>

            <p className="mt-3 text-sm text-[#738078]">
              Here's what's happening with your home.
            </p>
          </div>

          <Button onClick={() => onBook()}>
            <Plus size={17} />
            Request a service
          </Button>
        </div>

        <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          {[
            {
              label: 'Property status',
              value: 'Looking good',
              sub: 'Last checked Nov 7',
              icon: House,
              tint: 'bg-[#eaf0e4]'
            },
            {
             
               label: 'Next visit',
               value: (() => {
              const upcoming = requests
              .filter(
                        r =>
                        r.preferred_date &&
                        r.status !== 'completed' &&
                        r.status !== 'cancelled'
                       )
              .sort(
                        (a, b) =>
                       new Date(a.preferred_date) -
                       new Date(b.preferred_date)
                     )[0]

              return upcoming
                 ? new Date(`${upcoming.preferred_date}T12:00:00`)
               .toLocaleDateString('en-IN', {
                           day: 'numeric',
                             month: 'short'
                                             })
                  : '—'
  })(),
  sub: 'Upcoming maintenance visit',
  icon: CalendarDays,
  tint: 'bg-[#e9eef8]'
},
            },
            {
              label: 'Open requests',
              value: String(
                requests.filter(
                  r =>
                    r.status !== 'completed' &&
                    r.status !== 'cancelled'
                ).length
              ),
              sub: 'Active maintenance requests',
              icon: ClipboardCheck,
              tint: 'bg-[#f6ecda]'
            },
            {
              label: 'Care plan',
              value: 'Essential',
              sub: 'Monthly checks',
              icon: ShieldCheck,
              tint: 'bg-[#f0e9f6]'
            }
          ].map(({ label, value, sub, icon: Icon, tint }) => (

            <div
              key={label}
              className="rounded-2xl border border-[#e7eae3] bg-white p-5"
            >

              <div className="flex items-center justify-between">

                <span className="text-xs font-medium text-[#738078]">
                  {label}
                </span>

                <div
                  className={`grid h-9 w-9 place-items-center rounded-xl ${tint} text-forest`}
                >
                  <Icon size={18} />
                </div>

              </div>

              <div className="mt-4 font-serif text-2xl text-forest">
                {value}
              </div>

              <div className="mt-1 text-[11px] text-[#89928b]">
                {sub}
              </div>

            </div>

          ))}

        </div>

        <div className="mt-7 grid gap-6 lg:grid-cols-[1.55fr_.85fr]">

          <section className="rounded-2xl border border-[#e7eae3] bg-white p-5 sm:p-7">

            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

              <div>
                <h2 className="font-serif text-2xl text-forest">
                  Maintenance requests
                </h2>

                <p className="mt-1 text-xs text-[#89928b]">
                  Your submitted service requests
                </p>
              </div>

              <select
                value={filter}
                onChange={e => setFilter(e.target.value)}
                className="rounded-full border border-[#e0e5dc] bg-white px-3 py-2 text-xs text-forest outline-none"
              >
                <option>All</option>
                <option>Awaiting approval</option>
                <option>Scheduled</option>
                <option>Accepted</option>
                <option>In progress</option>
                <option>Completed</option>
                <option>Cancelled</option>
              </select>

            </div>

            <div className="mt-5 divide-y divide-[#edf0e9]">

              {filtered.map(
                ({
                  id,
                  title,
                  type,
                  date,
                  displayStatus,
                  cost,
                  icon: Icon
                }) => (

                  <div
                    key={id}
                    className="flex flex-col gap-3 py-5 sm:flex-row sm:items-center sm:justify-between"
                  >

                    <div className="flex gap-3">

                      <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#f0f3ec] text-forest">
                        <Icon size={19} />
                      </div>

                      <div>

                        <div className="font-semibold text-ink">
                          {title}
                        </div>

                        <div className="mt-1 text-xs text-[#89928b]">
                          {id} · {type} · {date}
                        </div>

                        <div className="mt-2">
                          <Status status={displayStatus} />
                        </div>

                      </div>

                    </div>

                    <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">

                      <span className="text-sm font-semibold text-forest">
                        {cost}
                      </span>

                      {displayStatus === 'Awaiting approval' && (
                        <button
                          onClick={() => approve(id)}
                          className="text-xs font-semibold text-moss underline underline-offset-4"
                        >
                          Approve estimate
                        </button>
                      )}

                    </div>

                  </div>

                )
              )}

              {filtered.length === 0 && (
                <p className="py-8 text-sm text-[#89928b]">
                  No requests in this category.
                </p>
              )}

            </div>

          </section>

          <div className="space-y-6">

            <section className="rounded-2xl border border-[#e7eae3] bg-white p-5 sm:p-6">

              <div className="flex items-center justify-between">

                <h2 className="font-serif text-xl text-forest">
                  Upcoming visits
                </h2>

                <CalendarDays size={19} className="text-moss" />

              </div>

              {bookings.length === 0 ? (

                <p className="mt-4 text-sm text-[#89928b]">
                  No upcoming visits yet.
                </p>

              ) : (

                bookings.map(b => (

                  <div
                    key={b.id}
                    className="mt-5 rounded-xl bg-[#f5f6f0] p-4"
                  >

                    <div className="flex items-center gap-2 text-xs font-semibold text-moss">

                      <Clock3 size={14} />

                      {new Date(
                        `${b.date}T12:00:00`
                      ).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}

                    </div>

                    <div className="mt-2 font-semibold text-forest">
                      {b.service}
                    </div>

                    <p className="mt-1 text-xs leading-5 text-[#758078]">
                      {b.notes ||
                        'Service request received. We will confirm details.'}
                    </p>

                  </div>

                ))

              )}

              <button
                onClick={onBook}
                className="mt-4 flex items-center gap-2 text-xs font-semibold text-forest"
              >
                Schedule another visit
                <ArrowRight size={14} />
              </button>

            </section>

            <section className="overflow-hidden rounded-2xl bg-forest p-6 text-white">

              <div className="flex items-center gap-2 text-white/65">

                <ShieldCheck size={17} />

                <span className="text-xs font-semibold uppercase tracking-[0.12em]">
                  Your control matters
                </span>

              </div>

              <h3 className="mt-4 font-serif text-2xl">
                No surprise repairs.
              </h3>

              <p className="mt-2 text-sm leading-6 text-white/65">
                Review recommended work and estimated costs before giving the go-ahead.
              </p>

              <div className="mt-5 flex items-center gap-2 text-xs font-medium text-[#dbe8d4]">
                <Check size={15} />
                Owner approval first
              </div>

            </section>

          </div>

        </div>

        <p className="mt-6 text-center text-[11px] text-[#9aa29b]">
          HavenCare homeowner portal
        </p>

      </div>
    </main>
  )
}
function EmployeeDashboard({ requests, setRequests, user }) {
  const [filter, setFilter] = useState('All')

  const filtered = useMemo(() => {
    if (filter === 'All') return requests

    return requests.filter(
      request => request.status === filter
    )
  }, [requests, filter])

  const updateStatus = async (id, status) => {
    const { data, error } = await supabase
      .from('maintenance_requests')
      .update({
        status: status
      })
      .eq('id', id)
      .eq('employee_id', user.id)
      .select()
      .single()

    if (error) {
      console.error('Error updating request:', error)
      alert(`Could not update job: ${error.message}`)
      return
    }

    setRequests(prev =>
      prev.map(request =>
        request.id === id
          ? { ...request, status: data.status }
          : request
      )
    )
  }

  const assignedCount = requests.length

  const activeCount = requests.filter(
    r =>
      r.status === 'accepted' ||
      r.status === 'in_progress'
  ).length

  const completedCount = requests.filter(
    r => r.status === 'completed'
  ).length

  return (
    <main className="min-h-[75vh] bg-[#f7f8f4]">
      <div className="mx-auto max-w-7xl px-5 py-10 md:px-8 md:py-14">

        {/* HEADER */}
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow">
              MAINTENANCE WORKER PORTAL
            </p>

            <h1 className="mt-2 font-serif text-4xl text-forest">
              My Jobs
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-[#738078]">
              Manage your assigned maintenance requests and
              keep homeowners updated on their service.
            </p>
          </div>

          {/* FILTER */}
          <div>
            <label className="mb-2 block text-[10px] font-semibold uppercase tracking-wider text-[#89928b]">
              Filter jobs
            </label>

            <select
              value={filter}
              onChange={e => setFilter(e.target.value)}
              className="rounded-xl border border-[#dfe4dc] bg-white px-4 py-2.5 text-sm text-forest outline-none focus:border-forest"
            >
              <option value="All">All</option>
              <option value="assigned">Assigned</option>
              <option value="accepted">Accepted</option>
              <option value="in_progress">
                In progress
              </option>
              <option value="completed">
                Completed
              </option>
            </select>
          </div>
        </div>

        {/* STATS */}
        <div className="mt-8 grid gap-4 sm:grid-cols-3">

          <div className="rounded-2xl border border-[#e7eae3] bg-white p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-[#89928b]">
                  Assigned jobs
                </p>

                <p className="mt-2 text-3xl font-semibold text-forest">
                  {assignedCount}
                </p>
              </div>

              <div className="grid h-11 w-11 place-items-center rounded-xl bg-[#eaf0e4] text-forest">
                <ClipboardCheck size={20} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[#e7eae3] bg-white p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-[#89928b]">
                  Active jobs
                </p>

                <p className="mt-2 text-3xl font-semibold text-forest">
                  {activeCount}
                </p>
              </div>

              <div className="grid h-11 w-11 place-items-center rounded-xl bg-[#e9eef8] text-forest">
                <Clock3 size={20} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[#e7eae3] bg-white p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-[#89928b]">
                  Completed
                </p>

                <p className="mt-2 text-3xl font-semibold text-forest">
                  {completedCount}
                </p>
              </div>

              <div className="grid h-11 w-11 place-items-center rounded-xl bg-[#eaf4ed] text-forest">
                <CheckCircle2 size={20} />
              </div>
            </div>
          </div>

        </div>

        {/* JOB LIST */}
        <div className="mt-8">

          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="font-serif text-2xl text-forest">
                Assigned maintenance requests
              </h2>

              <p className="mt-1 text-xs text-[#89928b]">
                Requests assigned to your employee account.
              </p>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="rounded-2xl border border-[#e7eae3] bg-white p-10 text-center">

              <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[#f0f2ed] text-[#89928b]">
                <ClipboardCheck size={24} />
              </div>

              <h3 className="mt-4 font-serif text-xl text-forest">
                No jobs found
              </h3>

              <p className="mt-2 text-sm text-[#89928b]">
                There are currently no maintenance requests
                matching this filter.
              </p>

            </div>
          ) : (
            <div className="grid gap-5">

              {filtered.map(request => (

                <div
                  key={request.id}
                  className="rounded-2xl border border-[#e7eae3] bg-white p-6 shadow-sm"
                >

                  {/* TOP */}
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">

                    <div>
                      <div className="flex flex-wrap items-center gap-2">

                        <h3 className="font-serif text-xl text-forest">
                          {request.title}
                        </h3>

                        <span
                          className={`rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-wide ${
                            request.status === 'assigned'
                              ? 'bg-[#fff4df] text-[#9a6b16]'
                              : request.status === 'accepted'
                              ? 'bg-[#e9eef8] text-[#536b94]'
                              : request.status === 'in_progress'
                              ? 'bg-[#eaf0e4] text-forest'
                              : request.status === 'completed'
                              ? 'bg-[#e7f3eb] text-[#3f7653]'
                              : 'bg-[#f0f2ed] text-[#738078]'
                          }`}
                        >
                          {request.status === 'in_progress'
                            ? 'In progress'
                            : request.status}
                        </span>

                      </div>

                      <p className="mt-2 text-sm text-[#738078]">
                        {request.description || 'No description provided.'}
                      </p>
                    </div>

                  </div>

                  {/* DETAILS */}
                  <div className="mt-6 grid gap-3 sm:grid-cols-3">

                    <div className="rounded-xl bg-[#f5f6f0] p-4">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-[#89928b]">
                        Service
                      </p>

                      <p className="mt-1 text-sm font-semibold text-forest">
                        {request.service_type}
                      </p>
                    </div>

                    <div className="rounded-xl bg-[#f5f6f0] p-4">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-[#89928b]">
                        Preferred date
                      </p>

                      <p className="mt-1 text-sm font-semibold text-forest">
                        {request.preferred_date || 'Not specified'}
                      </p>
                    </div>

                    <div className="rounded-xl bg-[#f5f6f0] p-4">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-[#89928b]">
                        Location
                      </p>

                      <p className="mt-1 text-sm font-semibold text-forest">
                        {request.location || 'Not specified'}
                      </p>
                    </div>

                  </div>

                  {/* ACTIONS */}
                  <div className="mt-6 flex flex-wrap items-center gap-3">

                    {request.status === 'assigned' && (
                      <button
                        onClick={() =>
                          updateStatus(
                            request.id,
                            'accepted'
                          )
                        }
                        className="rounded-xl bg-forest px-5 py-2.5 text-xs font-semibold text-white transition hover:opacity-90"
                      >
                        Accept job
                      </button>
                    )}

                    {request.status === 'accepted' && (
                      <button
                        onClick={() =>
                          updateStatus(
                            request.id,
                            'in_progress'
                          )
                        }
                        className="rounded-xl bg-forest px-5 py-2.5 text-xs font-semibold text-white transition hover:opacity-90"
                      >
                        Start work
                      </button>
                    )}

                    {request.status === 'in_progress' && (
                      <button
                        onClick={() =>
                          updateStatus(
                            request.id,
                            'completed'
                          )
                        }
                        className="rounded-xl bg-forest px-5 py-2.5 text-xs font-semibold text-white transition hover:opacity-90"
                      >
                        Mark completed
                      </button>
                    )}

                    {request.status === 'completed' && (
                      <span className="flex items-center gap-2 text-xs font-semibold text-[#4f795e]">
                        <CheckCircle2 size={16} />
                        Job completed
                      </span>
                    )}

                  </div>

                </div>

              ))}

            </div>
          )}

        </div>

      </div>
    </main>
  )
}
function BookingModal({ open, onClose, preselected, onSubmit }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', location: '', service: preselected || 'Routine inspections', date: '', notes: '' })
  const [sent, setSent] = useState(false)
  if (!open) return null
  const update = (key, value) => setForm(prev => ({ ...prev, [key]: value }))
  const submit = (e) => {
    e.preventDefault()
    onSubmit(form)
    setSent(true)
  }
  const close = () => { onClose(); setTimeout(() => setSent(false), 200) }
  return <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#0d2119]/55 p-4 backdrop-blur-sm" onMouseDown={e => { if (e.target === e.currentTarget) close() }}>
    <div className="my-auto w-full max-w-xl rounded-3xl bg-[#fbfaf6] p-6 shadow-2xl sm:p-8">
      <div className="flex items-start justify-between"><div><p className="eyebrow">LET'S LOOK AFTER YOUR HOME</p><h2 className="font-serif text-3xl text-forest">{sent ? 'Request received!' : 'Request a home visit'}</h2><p className="mt-2 text-sm text-[#738078]">{sent ? 'Your demo request has been added to the owner dashboard.' : 'Tell us a little about your property. This is a prototype form, not a live booking.'}</p></div><button onClick={close} className="rounded-full p-2 text-[#738078] hover:bg-[#edf0e7]" aria-label="Close"><X size={20} /></button></div>
      {sent ? <div className="py-8 text-center"><div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#e8f1e3] text-forest"><CheckCircle2 size={32} /></div><p className="mt-5 font-semibold text-forest">Thanks, {form.name}.</p><p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#738078]">Your {form.service.toLowerCase()} request is saved in this session. No email or real-world booking has been sent.</p><Button onClick={close} className="mt-6">Done <Check size={16} /></Button></div> : <form onSubmit={submit} className="mt-6 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2"><label className="field-label">Your name<input required value={form.name} onChange={e => update('name', e.target.value)} placeholder="e.g. Ananya Menon" className="field-input" /></label><label className="field-label">Email address<input required type="email" value={form.email} onChange={e => update('email', e.target.value)} placeholder="you@example.com" className="field-input" /></label></div>
        <div className="grid gap-4 sm:grid-cols-2"><label className="field-label">Phone number<input value={form.phone} onChange={e => update('phone', e.target.value)} placeholder="+91" className="field-input" /></label><label className="field-label">Property location<input required value={form.location} onChange={e => update('location', e.target.value)} placeholder="City / locality" className="field-input" /></label></div>
        <div className="grid gap-4 sm:grid-cols-2"><label className="field-label">Service needed<select value={form.service} onChange={e => update('service', e.target.value)} className="field-input">{services.map(s => <option key={s.title}>{s.title}</option>)}</select></label><label className="field-label">Preferred date<input type="date" min="2026-10-14" value={form.date} onChange={e => update('date', e.target.value)} className="field-input" /></label></div>
        <label className="field-label">Anything we should know? <span className="font-normal text-[#98a098]">(optional)</span><textarea rows="3" value={form.notes} onChange={e => update('notes', e.target.value)} placeholder="Tell us about the property or any concerns..." className="field-input resize-none" /></label>
        <div className="rounded-xl bg-[#edf0e7] p-3 text-xs leading-5 text-[#68776b]"><LockKeyhole size={14} className="mr-1 inline" /> Demo only: don't enter sensitive access details, passwords or keys. This form doesn't transmit your information.</div>
        <Button type="submit" className="w-full py-3.5">Submit demo request <ArrowRight size={16} /></Button>
      </form>}
    </div>
  </div>
}

function Footer({ setPage }) {
  return <footer className="border-t border-[#e9ebe4] bg-[#fbfaf6]">
    <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-8 md:flex-row md:items-center md:justify-between md:px-8"><button onClick={() => setPage('home')}><Logo /></button><p className="max-w-sm text-xs leading-5 text-[#89928b]">Thoughtful property care for the homes you hold close. A concept prototype by HavenCare.</p><div className="flex gap-5 text-xs font-medium text-[#69766e]"><button onClick={() => setPage('services')}>Services</button><button onClick={() => setPage('dashboard')}>Demo dashboard</button></div></div>
    <div className="border-t border-[#e9ebe4] px-5 py-4 text-center text-[10px] text-[#9aa29b]">© 2026 HavenCare · Prototype concept · Not a live property management service</div>
  </footer>
}

function AuthPage({ onLogin }) {
  const [mode, setMode] = useState('signup')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('homeowner')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const normalizedEmail = email.trim().toLowerCase()

    if (mode === 'signup') {
      const { data, error } = await supabase.auth.signUp({
        email: normalizedEmail,
        password,
      })

      if (error) {
        setError(error.message)
        setLoading(false)
        return
      }

      if (!data.user) {
        setError('Account could not be created.')
        setLoading(false)
        return
      }

      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: data.user.id,
          name: name.trim(),
          email: normalizedEmail,
          role,
        })

      if (profileError) {
        setError(profileError.message)
        setLoading(false)
        return
      }

      onLogin({
        id: data.user.id,
        name: name.trim(),
        email: normalizedEmail,
        role,
      })
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password,
      })

      if (error) {
        setError('Email or password is incorrect.')
        setLoading(false)
        return
      }

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id, name, email, role')
        .eq('id', data.user.id)
        .single()

      if (profileError) {
        setError('Account profile could not be loaded.')
        setLoading(false)
        return
      }

      onLogin(profile)
    }

    setLoading(false)
  }

  return <main className="flex min-h-screen items-center justify-center bg-[#f5f6f0] px-4 py-10">
    <div className="grid w-full max-w-5xl overflow-hidden rounded-[2rem] border border-[#e6e9e1] bg-white shadow-soft md:grid-cols-2">
      <div className="flex flex-col justify-between bg-forest p-8 text-white sm:p-12">
        <Logo light />

        <div className="py-12">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c6d6bd]">
            Your home, cared for
          </p>

          <h1 className="mt-4 font-serif text-4xl leading-tight sm:text-5xl">
            Good care begins with a little peace of mind.
          </h1>

          <p className="mt-5 max-w-sm text-sm leading-6 text-white/65">
            Create a HavenCare account to explore the homeowner or maintenance worker experience.
          </p>
        </div>

        <p className="text-xs text-white/45">
          HavenCare · Cloud-connected prototype
        </p>
      </div>

      <div className="p-7 sm:p-12">
        <p className="eyebrow">HAVENCARE ACCOUNT</p>

        <h2 className="mt-2 font-serif text-3xl text-forest">
          {mode === 'signup' ? 'Create your account' : 'Welcome back'}
        </h2>

        <p className="mt-2 text-sm leading-6 text-[#738078]">
          {mode === 'signup'
            ? 'Choose how you want to use HavenCare.'
            : 'Log in to your HavenCare account.'}
        </p>

        <form onSubmit={submit} className="mt-7 space-y-4">

          {mode === 'signup' && (
            <>
              <label className="field-label">
                Full name
                <input
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Your name"
                  className="field-input"
                />
              </label>

              <label className="field-label">
                I am a
                <select
                  value={role}
                  onChange={e => setRole(e.target.value)}
                  className="field-input"
                >
                  <option value="homeowner">Homeowner</option>
                  <option value="employee">Maintenance employee</option>
                </select>
              </label>
            </>
          )}

          <label className="field-label">
            Email address
            <input
              required
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="field-input"
            />
          </label>

          <label className="field-label">
            Password
            <input
              required
              minLength={6}
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              className="field-input"
            />
          </label>

          {error && (
            <p
              role="alert"
              className="rounded-xl bg-red-50 p-3 text-sm text-red-700"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-forest px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[#245542] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading
              ? 'Please wait...'
              : mode === 'signup'
                ? 'Create account'
                : 'Log in'}

            {!loading && <ArrowRight size={16} />}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[#738078]">
          {mode === 'signup'
            ? 'Already have an account?'
            : 'New to HavenCare?'}

          {' '}

          <button
            onClick={() => {
              setMode(mode === 'signup' ? 'login' : 'signup')
              setError('')
            }}
            className="font-semibold text-forest underline underline-offset-4"
          >
            {mode === 'signup' ? 'Log in' : 'Create an account'}
          </button>
        </p>

        <div className="mt-6 rounded-xl bg-[#f5f6f0] p-3 text-xs leading-5 text-[#738078]">
          <LockKeyhole size={14} className="mr-1 inline" />
          Your account is securely handled by Supabase Authentication.
        </div>
      </div>
    </div>
  </main>
}

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const [page, setPage] = useState('home')

  const [bookingOpen, setBookingOpen] = useState(false)

  const [preselected, setPreselected] = useState(
    'Routine inspections'
  )

  const [requests, setRequests] = useState(initialRequests)

  const [bookings, setBookings] = useState(initialBookings)

  // --------------------------------------------------
  // GET CURRENT SUPABASE SESSION
  // --------------------------------------------------

  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session }
      } = await supabase.auth.getSession()

      if (session?.user) {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('id, name, email, role')
          .eq('id', session.user.id)
          .single()

        if (error) {
          console.error('Could not load profile:', error)
        }

        if (profile) {
          setUser(profile)

          // Employees always enter their work dashboard
          if (profile.role === 'employee') {
            setPage('dashboard')
          } else {
            setPage('home')
          }
        }
      }

      setLoading(false)
    }

    getSession()

    // ------------------------------------------------
    // LISTEN FOR AUTH CHANGES
    // ------------------------------------------------

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange(
      async (_event, session) => {

        if (session?.user) {

          const { data: profile, error } = await supabase
            .from('profiles')
            .select('id, name, email, role')
            .eq('id', session.user.id)
            .single()

          if (error) {
            console.error('Could not load profile:', error)
          }

          if (profile) {
            setUser(profile)

            // Role-based landing page
            if (profile.role === 'employee') {
              setPage('dashboard')
            } else {
              setPage('home')
            }
          }

        } else {

          setUser(null)
          setPage('home')

        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

    // --------------------------------------------------
  // LOAD MAINTENANCE REQUESTS
  // --------------------------------------------------

  useEffect(() => {
    if (!user) return

    const loadRequests = async () => {
      let query = supabase
        .from('maintenance_requests')
        .select('*')
        .order('created_at', { ascending: false })

      // Homeowners see their own requests
      if (user.role === 'homeowner') {
        query = query.eq('homeowner_id', user.id)
      }

      // Employees see requests assigned to them
      if (user.role === 'employee') {
        query = query.eq('employee_id', user.id)
      }

      const { data, error } = await query

      if (error) {
        console.error(
          'Could not load maintenance requests:',
          error
        )
        return
      }

      setRequests(data || [])
    }

    loadRequests()
  }, [user])

  
  // --------------------------------------------------
  // LOGIN
  // --------------------------------------------------

  const onLogin = (account) => {
    setUser(account)

    if (account.role === 'employee') {
      setPage('dashboard')
    } else {
      setPage('home')
    }
  }

  // --------------------------------------------------
  // LOGOUT
  // --------------------------------------------------

  const onLogout = async () => {
    await supabase.auth.signOut()

    setUser(null)
    setPage('home')
    setBookingOpen(false)
  }

  // --------------------------------------------------
  // OPEN BOOKING MODAL
  // --------------------------------------------------

  const onBook = (service) => {

    // Employees should never create homeowner
    // service requests.
    if (user?.role === 'employee') {
      return
    }

    setPreselected(
      service || 'Routine inspections'
    )

    setBookingOpen(true)
  }

  // --------------------------------------------------
  // SUBMIT MAINTENANCE REQUEST
  // --------------------------------------------------

  const submitBooking = async (form) => {

    if (!user) {
      return
    }

    // Only homeowners can create requests
    if (user.role !== 'homeowner') {
      return
    }

   const { data, error } = await supabase
  .from('maintenance_requests')
  .insert({
    homeowner_id: user.id,
    employee_id: '30135b4a-00f5-4346-b26a-4949ebda8df3',
    title: form.service,
    description: form.notes || '',
    service_type: form.service,
    location: form.location,
    preferred_date: form.date || null,
    status: 'assigned'
  
      })
      .select()
      .single()

    if (error) {
      console.error(
        'Error creating maintenance request:',
        error
      )

      alert(
        `Could not submit request: ${error.message}`
      )

      return
    }

    console.log(
      'Maintenance request created:',
      data
    )

    setBookingOpen(false)

    alert(
      'Maintenance request submitted successfully!'
    )
  }

  // --------------------------------------------------
  // LOADING SCREEN
  // --------------------------------------------------

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f5f6f0]">

        <div className="text-center">

          <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-forest text-white">
            <ShieldCheck size={22} />
          </div>

          <p className="mt-4 text-sm text-[#738078]">
            Loading HavenCare...
          </p>

        </div>

      </div>
    )
  }

  // --------------------------------------------------
  // NOT LOGGED IN
  // --------------------------------------------------

  if (!user) {
    return (
      <AuthPage onLogin={onLogin} />
    )
  }

  // --------------------------------------------------
  // LOGGED IN APPLICATION
  // --------------------------------------------------

  const isEmployee = user.role === 'employee'

  return (
    <div className="min-h-screen bg-white text-ink">

      <Header
        page={page}
        setPage={setPage}
        onBook={() => onBook()}
        user={user}
        onLogout={onLogout}
      />

      {/* ==============================================
          HOMEOWNER ONLY
          ============================================== */}

      {!isEmployee && page === 'home' && (
        <HomePage
          setPage={setPage}
          onBook={onBook}
        />
      )}

      {!isEmployee && page === 'services' && (
        <ServicesPage
          onBook={onBook}
        />
      )}

      {/* ==============================================
          DASHBOARD
          BOTH ROLES
          ============================================== */}

      {page === 'dashboard' && (
        <DashboardPage
          requests={requests}
          setRequests={setRequests}
          bookings={bookings}
          setBookings={setBookings}
          onBook={onBook}
          user={user}
        />
      )}

      {/* ==============================================
          EMPLOYEE SCHEDULE
          ============================================== */}

      {isEmployee && page === 'schedule' && (
        <main className="min-h-[75vh] bg-[#f7f8f4]">

          <div className="mx-auto max-w-7xl px-5 py-10 md:px-8 md:py-14">

            <p className="eyebrow">
              MAINTENANCE WORKER PORTAL
            </p>

            <h1 className="mt-2 font-serif text-4xl text-forest">
              Schedule
            </h1>

            <p className="mt-3 text-sm text-[#738078]">
              View your upcoming maintenance visits.
            </p>

            <div className="mt-8 rounded-2xl border border-[#e7eae3] bg-white p-7">

              <div className="flex items-center gap-3">

                <div className="grid h-11 w-11 place-items-center rounded-xl bg-[#e9eef8] text-forest">
                  <CalendarDays size={20} />
                </div>

                <div>
                  <h2 className="font-serif text-xl text-forest">
                    Upcoming schedule
                  </h2>

                  <p className="mt-1 text-xs text-[#89928b]">
                    Your assigned visits will appear here.
                  </p>
                </div>

              </div>

              <div className="mt-6 rounded-xl bg-[#f5f6f0] p-6 text-center">

                <CalendarDays
                  size={30}
                  className="mx-auto text-[#9aa29b]"
                />

                <p className="mt-3 text-sm text-[#89928b]">
                  Schedule management will be connected to your
                  assigned jobs.
                </p>

              </div>

            </div>

          </div>

        </main>
      )}

      {/* ==============================================
          EMPLOYEE PROFILE
          ============================================== */}

      {isEmployee && page === 'profile' && (
        <main className="min-h-[75vh] bg-[#f7f8f4]">

          <div className="mx-auto max-w-3xl px-5 py-10 md:px-8 md:py-14">

            <p className="eyebrow">
              EMPLOYEE PROFILE
            </p>

            <h1 className="mt-2 font-serif text-4xl text-forest">
              Your profile
            </h1>

            <div className="mt-8 rounded-2xl border border-[#e7eae3] bg-white p-7">

              <div className="flex items-center gap-4">

                <div className="grid h-14 w-14 place-items-center rounded-full bg-[#eaf0e4] text-lg font-semibold text-forest">
                  {user.name?.charAt(0)?.toUpperCase()}
                </div>

                <div>
                  <h2 className="font-serif text-2xl text-forest">
                    {user.name}
                  </h2>

                  <p className="mt-1 text-sm text-[#89928b]">
                    Maintenance Employee
                  </p>
                </div>

              </div>

              <div className="mt-7 grid gap-4 sm:grid-cols-2">

                <div className="rounded-xl bg-[#f5f6f0] p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-[#89928b]">
                    Name
                  </p>

                  <p className="mt-2 text-sm font-semibold text-forest">
                    {user.name}
                  </p>
                </div>

                <div className="rounded-xl bg-[#f5f6f0] p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-[#89928b]">
                    Email
                  </p>

                  <p className="mt-2 text-sm font-semibold text-forest">
                    {user.email}
                  </p>
                </div>

                <div className="rounded-xl bg-[#f5f6f0] p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-[#89928b]">
                    Role
                  </p>

                  <p className="mt-2 text-sm font-semibold text-forest">
                    Maintenance Employee
                  </p>
                </div>

              </div>

            </div>

          </div>

        </main>
      )}

      {/* ==============================================
          FOOTER
          ============================================== */}

      <Footer
        setPage={setPage}
      />

      {/* ==============================================
          BOOKING MODAL
          HOMEOWNER ONLY
          ============================================== */}

      {!isEmployee && (
        <BookingModal
          key={preselected}
          open={bookingOpen}
          onClose={() => setBookingOpen(false)}
          preselected={preselected}
          onSubmit={submitBooking}
        />
      )}

    </div>
  )
}
export default App
