import { useState } from 'react'
import './App.css'
import {
  Search,
  FilePlus,
  ClipboardList,
  Ban,
  Users,
  Inbox,
  ChevronRight,
  ChevronDown,
} from 'lucide-react'

type SidebarSection =
  | 'search'
  | 'createClaim'
  | 'userWorklist'
  | 'stopPayment'
  | 'permissions'
  | 'workbasket'

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

function App() {
  const [activeSection, setActiveSection] = useState<SidebarSection>('workbasket')
  const [workbasketOpen, setWorkbasketOpen] = useState(true)
  const [selectedClaimType, setSelectedClaimType] = useState('All')

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
    if (id === 'workbasket') {
      setWorkbasketOpen(!workbasketOpen)
    } else {
      setWorkbasketOpen(false)
    }
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
            <h2 className="text-2xl font-semibold text-gray-800">Workbasket</h2>
            <p className="text-gray-500">
              Viewing claims for: <span className="font-semibold text-blue-600">{selectedClaimType}</span>
            </p>
            <div className="overflow-hidden rounded-lg border border-gray-200">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 font-medium text-gray-600">Claim ID</th>
                    <th className="px-4 py-3 font-medium text-gray-600">Type</th>
                    <th className="px-4 py-3 font-medium text-gray-600">Customer</th>
                    <th className="px-4 py-3 font-medium text-gray-600">Status</th>
                    <th className="px-4 py-3 font-medium text-gray-600">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-mono text-blue-600">CLM-001</td>
                    <td className="px-4 py-3">Debt/ATM</td>
                    <td className="px-4 py-3">John Smith</td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                        Pending
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500">2026-03-05</td>
                  </tr>
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-mono text-blue-600">CLM-002</td>
                    <td className="px-4 py-3">ACH</td>
                    <td className="px-4 py-3">Jane Doe</td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                        Approved
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500">2026-03-04</td>
                  </tr>
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-mono text-blue-600">CLM-003</td>
                    <td className="px-4 py-3">Check</td>
                    <td className="px-4 py-3">Robert Wilson</td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                        Rejected
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500">2026-03-03</td>
                  </tr>
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-mono text-blue-600">CLM-004</td>
                    <td className="px-4 py-3">Credit Card</td>
                    <td className="px-4 py-3">Emily Davis</td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                        In Review
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500">2026-03-02</td>
                  </tr>
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
                  {item.id === 'workbasket' && (
                    <span className="text-gray-400">
                      {workbasketOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    </span>
                  )}
                </button>

                {/* Workbasket dropdown */}
                {item.id === 'workbasket' && workbasketOpen && (
                  <div className="mt-1 ml-4 border-l-2 border-blue-100 pl-3 pb-1">
                    <label className="block text-xs font-medium text-gray-500 mb-1.5 px-2">
                      Claim Type
                    </label>
                    <select
                      value={selectedClaimType}
                      onChange={(e) => setSelectedClaimType(e.target.value)}
                      className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-200"
                    >
                      {claimTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
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
