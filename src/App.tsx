import { useState, useMemo } from 'react'
import './App.css'
import {
  Search,
  FilePlus,
  ClipboardList,
  Ban,
  Users,
  Inbox,
} from 'lucide-react'

type SidebarSection =
  | 'search'
  | 'createClaim'
  | 'userWorklist'
  | 'stopPayment'
  | 'permissions'
  | 'workbasket'

interface Claim {
  id: string
  claimType: string
  workbasket: string
  subtype: string
  customer: string
  status: string
  date: string
  amount: string
}

const claimTypes = [
  'All',
  'Debt/ATM',
  'ACH',
  'Check',
  'OLB',
  'Rejected Transactions',
  'Credit Card',
  'IDT',
]

const workbaskets = [
  'Ready To Work',
  'Pending',
  'Recovery',
  'Manager Approvals',
]

const workbasketSubtypes: Record<string, string[]> = {
  'Ready To Work': ['Initial Review', 'Enhanced Review', 'Exception'],
  'Pending': [],
  'Recovery': ['Chargeback', 'Exception'],
  'Manager Approvals': [],
}

const statuses = ['Pending', 'Approved', 'Rejected', 'In Review', 'Escalated', 'Resolved']
const statusColors: Record<string, string> = {
  Pending: 'bg-yellow-100 text-yellow-800',
  Approved: 'bg-green-100 text-green-800',
  Rejected: 'bg-red-100 text-red-800',
  'In Review': 'bg-blue-100 text-blue-800',
  Escalated: 'bg-purple-100 text-purple-800',
  Resolved: 'bg-gray-100 text-gray-800',
}

const customerNames = [
  'John Smith', 'Jane Doe', 'Robert Wilson', 'Emily Davis', 'Michael Brown',
  'Sarah Johnson', 'David Lee', 'Lisa Anderson', 'James Taylor', 'Maria Garcia',
  'William Martinez', 'Jennifer Thomas', 'Richard Jackson', 'Patricia White',
  'Charles Harris', 'Linda Clark', 'Joseph Lewis', 'Barbara Robinson', 'Thomas Walker',
  'Margaret Hall', 'Daniel Allen', 'Susan Young', 'Matthew King', 'Dorothy Wright',
  'Anthony Lopez', 'Karen Hill', 'Mark Scott', 'Nancy Green', 'Steven Adams',
  'Betty Baker', 'Paul Nelson', 'Sandra Carter', 'Andrew Mitchell', 'Ashley Perez',
  'Joshua Roberts', 'Kimberly Turner', 'Kenneth Phillips', 'Donna Campbell',
  'Kevin Parker', 'Michelle Evans', 'Brian Edwards', 'Carol Collins', 'George Stewart',
  'Amanda Sanchez', 'Edward Morris', 'Melissa Rogers', 'Ronald Reed', 'Deborah Cook',
]

function generateClaims(): Claim[] {
  const claims: Claim[] = []
  const actualTypes = claimTypes.filter((t) => t !== 'All')
  let claimId = 1

  for (const type of actualTypes) {
    for (const basket of workbaskets) {
      const subtypes = workbasketSubtypes[basket]
      const subtypeList = subtypes.length > 0 ? subtypes : ['']

      for (const subtype of subtypeList) {
        const count = Math.floor(Math.random() * 12) + 4
        for (let i = 0; i < count; i++) {
          const dayOffset = Math.floor(Math.random() * 90)
          const date = new Date(2026, 2, 7)
          date.setDate(date.getDate() - dayOffset)
          const amount = (Math.random() * 9500 + 50).toFixed(2)
          claims.push({
            id: `CLM-${String(claimId).padStart(4, '0')}`,
            claimType: type,
            workbasket: basket,
            subtype,
            customer: customerNames[Math.floor(Math.random() * customerNames.length)],
            status: statuses[Math.floor(Math.random() * statuses.length)],
            date: date.toISOString().split('T')[0],
            amount: `$${amount}`,
          })
          claimId++
        }
      }
    }
  }
  return claims
}

const allClaims = generateClaims()

function App() {
  const [activeSection, setActiveSection] = useState<SidebarSection>('workbasket')
  const [selectedClaimType, setSelectedClaimType] = useState('All')
  const [selectedWorkbasket, setSelectedWorkbasket] = useState('Ready To Work')
  const [selectedSubtype, setSelectedSubtype] = useState('Initial Review')

  const claimCountByType = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const type of claimTypes) {
      if (type === 'All') {
        counts[type] = allClaims.length
      } else {
        counts[type] = allClaims.filter((c) => c.claimType === type).length
      }
    }
    return counts
  }, [])

  const filteredClaims = useMemo(() => {
    return allClaims.filter((c) => {
      if (selectedClaimType !== 'All' && c.claimType !== selectedClaimType) return false
      if (c.workbasket !== selectedWorkbasket) return false
      const subtypes = workbasketSubtypes[selectedWorkbasket]
      if (subtypes.length > 0 && c.subtype !== selectedSubtype) return false
      return true
    })
  }, [selectedClaimType, selectedWorkbasket, selectedSubtype])

  const sidebarItems: {
    id: SidebarSection
    label: string
    icon: React.ReactNode
  }[] = [
    { id: 'search', label: 'Search for Customer', icon: <Search size={20} /> },
    { id: 'createClaim', label: 'Create Claim', icon: <FilePlus size={20} /> },
    { id: 'userWorklist', label: 'User Worklist', icon: <ClipboardList size={20} /> },
    { id: 'stopPayment', label: 'Stop Payment', icon: <Ban size={20} /> },
    { id: 'permissions', label: 'Set Colleague Permissions', icon: <Users size={20} /> },
    { id: 'workbasket', label: 'Workbasket', icon: <Inbox size={20} /> },
  ]

  const handleSectionClick = (id: SidebarSection) => {
    setActiveSection(id)
  }

  const renderContent = () => {
    switch (activeSection) {
      case 'search':
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-800">Search for Customer</h2>
            <p className="text-gray-500">Search and find customer records.</p>
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Enter customer name or ID..."
                className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
              <button className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors">
                Search
              </button>
            </div>
          </div>
        )
      case 'createClaim':
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-800">Create Claim</h2>
            <p className="text-gray-500">Start a new claim for a customer.</p>
            <button className="rounded-lg bg-green-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-green-700 transition-colors">
              + New Claim
            </button>
          </div>
        )
      case 'userWorklist':
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-800">User Worklist</h2>
            <p className="text-gray-500">View and manage your assigned tasks.</p>
            <div className="rounded-lg border border-gray-200 bg-white p-6 text-center text-gray-400">
              No items in your worklist
            </div>
          </div>
        )
      case 'stopPayment':
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-800">Stop Payment</h2>
            <p className="text-gray-500">Initiate a stop payment request.</p>
            <button className="rounded-lg bg-red-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-red-700 transition-colors">
              Stop Payment
            </button>
          </div>
        )
      case 'permissions':
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-800">Set Colleague Permissions</h2>
            <p className="text-gray-500">Manage access and permissions for colleagues.</p>
            <div className="rounded-lg border border-gray-200 bg-white p-6 text-center text-gray-400">
              No colleagues configured
            </div>
          </div>
        )
      case 'workbasket':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-gray-800">Workbasket</h2>
              <div className="flex items-center gap-3">
                <label className="text-sm font-medium text-gray-600">Claim Type:</label>
                <select
                  value={selectedClaimType}
                  onChange={(e) => setSelectedClaimType(e.target.value)}
                  className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                >
                  {claimTypes.map((type) => (
                    <option key={type} value={type}>
                      {type} ({claimCountByType[type]})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Workbasket selection tabs */}
            <div className="flex gap-3">
              {workbaskets.map((basket) => (
                <button
                  key={basket}
                  onClick={() => {
                    setSelectedWorkbasket(basket)
                    const subtypes = workbasketSubtypes[basket]
                    setSelectedSubtype(subtypes.length > 0 ? subtypes[0] : '')
                  }}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                    selectedWorkbasket === basket
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {basket}
                </button>
              ))}
            </div>

            {/* Subtype selection */}
            {workbasketSubtypes[selectedWorkbasket].length > 0 && (
              <div className="flex gap-2">
                {workbasketSubtypes[selectedWorkbasket].map((subtype) => (
                  <button
                    key={subtype}
                    onClick={() => setSelectedSubtype(subtype)}
                    className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                      selectedSubtype === subtype
                        ? 'bg-blue-100 text-blue-700 border border-blue-300'
                        : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'
                    }`}
                  >
                    {subtype}
                  </button>
                ))}
              </div>
            )}

            <p className="text-gray-500">
              Viewing <span className="font-semibold text-blue-600">{selectedClaimType}</span>
              {' '}&mdash;{' '}
              <span className="font-semibold text-blue-600">{selectedWorkbasket}</span>
              {selectedSubtype && (
                <>
                  {' '}&rsaquo;{' '}
                  <span className="font-semibold text-blue-600">{selectedSubtype}</span>
                </>
              )}
            </p>
            <p className="text-xs text-gray-400">
              Showing {filteredClaims.length} claim{filteredClaims.length !== 1 ? 's' : ''}
            </p>
            <div className="overflow-hidden rounded-lg border border-gray-200">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 font-medium text-gray-600">Claim ID</th>
                    <th className="px-4 py-3 font-medium text-gray-600">Type</th>
                    <th className="px-4 py-3 font-medium text-gray-600">Customer</th>
                    <th className="px-4 py-3 font-medium text-gray-600">Amount</th>
                    <th className="px-4 py-3 font-medium text-gray-600">Status</th>
                    <th className="px-4 py-3 font-medium text-gray-600">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredClaims.map((claim) => (
                    <tr key={claim.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-mono text-blue-600">{claim.id}</td>
                      <td className="px-4 py-3">{claim.claimType}</td>
                      <td className="px-4 py-3">{claim.customer}</td>
                      <td className="px-4 py-3 font-medium">{claim.amount}</td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[claim.status]}`}>
                          {claim.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-500">{claim.date}</td>
                    </tr>
                  ))}
                  {filteredClaims.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
                        No claims found for this selection
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Left Sidebar */}
      <aside className="w-72 flex-shrink-0 bg-white border-r border-gray-200 shadow-sm flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-200">
          <h1 className="text-lg font-bold text-blue-700 tracking-tight">Workbasket</h1>
          <p className="text-xs text-gray-400 mt-0.5">Claims Management System</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-3">
          <ul className="space-y-0.5 px-2">
            {sidebarItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => handleSectionClick(item.id)}
                  className={`w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    activeSection === item.id
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <span
                    className={
                      activeSection === item.id ? 'text-blue-600' : 'text-gray-400'
                    }
                  >
                    {item.icon}
                  </span>
                  <span className="flex-1 text-left">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer */}
        <div className="border-t border-gray-200 px-5 py-3">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
              WB
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Agent User</p>
              <p className="text-xs text-gray-400">Claims Processor</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">
            {sidebarItems.find((i) => i.id === activeSection)?.label}
          </h2>
          <div className="flex items-center gap-4">
            <span className="text-xs text-gray-400">
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-8">{renderContent()}</div>
      </main>
    </div>
  )
}

export default App
