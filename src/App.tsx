import { useState, useMemo } from 'react'
import './App.css'
import {
  Search,
  FilePlus,
  ClipboardList,
  Ban,
  Users,
  Inbox,
  Plus,
  Trash2,
  Shield,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  DollarSign,
  Calendar,
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
  claimSubtype: string
  customer: string
  status: string
  date: string
  amount: string
  regEDate: string
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

// ATM/Debit claim subtypes based on workbasket subtype
const atmDebitClaimSubtypes: Record<string, string[]> = {
  'Initial Review': ['Day 10 - ATM', 'Day 10 - Debit', 'Stop Payment'],
  'Enhanced Review': ['Second Review', 'Expedite', 'Cancel', 'Revoke Stop Pay'],
  'Exception': [],
}

const statuses = ['Pending', 'Approved', 'Rejected', 'In Review', 'Escalated', 'Resolved']
const statusColors: Record<string, string> = {
  Pending: 'bg-yellow-100 text-yellow-800',
  'Pending Under Review': 'bg-orange-100 text-orange-800',
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
          // Generate Reg E date (10 business days after claim date)
          const regEDateObj = new Date(date)
          regEDateObj.setDate(regEDateObj.getDate() + 14)
          // Assign claim subtype for ATM/Debit claims based on workbasket subtype
          let claimSubtype = ''
          if (type === 'Debt/ATM' && subtype && atmDebitClaimSubtypes[subtype]?.length > 0) {
            const subs = atmDebitClaimSubtypes[subtype]
            claimSubtype = subs[Math.floor(Math.random() * subs.length)]
          }
          // Set status to 'Pending Under Review' for Initial Review and Enhanced Review subtypes
          const claimStatus = (subtype === 'Initial Review' || subtype === 'Enhanced Review')
            ? 'Pending Under Review'
            : statuses[Math.floor(Math.random() * statuses.length)]
          claims.push({
            id: `CLM-${String(claimId).padStart(4, '0')}`,
            claimType: type,
            workbasket: basket,
            subtype,
            claimSubtype,
            customer: customerNames[Math.floor(Math.random() * customerNames.length)],
            status: claimStatus,
            date: date.toISOString().split('T')[0],
            amount: `$${amount}`,
            regEDate: regEDateObj.toISOString().split('T')[0],
          })
          claimId++
        }
      }
    }
  }

  // Add extra low-amount Debt/ATM claims (<$200)
  for (const basket of workbaskets) {
    const subtypes = workbasketSubtypes[basket]
    const subtypeList = subtypes.length > 0 ? subtypes : ['']
    for (const subtype of subtypeList) {
      const count = Math.floor(Math.random() * 8) + 5
      for (let i = 0; i < count; i++) {
        const dayOffset = Math.floor(Math.random() * 90)
        const date = new Date(2026, 2, 7)
        date.setDate(date.getDate() - dayOffset)
        const amount = (Math.random() * 150 + 5).toFixed(2)
        const regEDateObj2 = new Date(date)
        regEDateObj2.setDate(regEDateObj2.getDate() + 14)
        let claimSubtype2 = ''
        if (subtype && atmDebitClaimSubtypes[subtype]?.length > 0) {
          const subs = atmDebitClaimSubtypes[subtype]
          claimSubtype2 = subs[Math.floor(Math.random() * subs.length)]
        }
        const claimStatus2 = (subtype === 'Initial Review' || subtype === 'Enhanced Review')
          ? 'Pending Under Review'
          : statuses[Math.floor(Math.random() * statuses.length)]
        claims.push({
          id: `CLM-${String(claimId).padStart(4, '0')}`,
          claimType: 'Debt/ATM',
          workbasket: basket,
          subtype,
          claimSubtype: claimSubtype2,
          customer: customerNames[Math.floor(Math.random() * customerNames.length)],
          status: claimStatus2,
          date: date.toISOString().split('T')[0],
          amount: `$${amount}`,
          regEDate: regEDateObj2.toISOString().split('T')[0],
        })
        claimId++
      }
    }
  }

  return claims
}

const allClaims = generateClaims()

const roles = ['Processor', 'Reviewer', 'Manager', 'Admin', 'Read Only']

interface TestUser {
  id: string
  name: string
  email: string
  department: string
}

interface RoleAssignment {
  id: string
  userId: string
  role: string
  claimType: string
  workbasket: string
  subtype: string
}

const testUsers: TestUser[] = [
  { id: 'U001', name: 'Alice Johnson', email: 'alice.johnson@company.com', department: 'Claims Processing' },
  { id: 'U002', name: 'Bob Martinez', email: 'bob.martinez@company.com', department: 'Claims Processing' },
  { id: 'U003', name: 'Carol Williams', email: 'carol.williams@company.com', department: 'Recovery' },
  { id: 'U004', name: 'David Chen', email: 'david.chen@company.com', department: 'Management' },
  { id: 'U005', name: 'Eva Thompson', email: 'eva.thompson@company.com', department: 'Claims Processing' },
  { id: 'U006', name: 'Frank Garcia', email: 'frank.garcia@company.com', department: 'Recovery' },
  { id: 'U007', name: 'Grace Kim', email: 'grace.kim@company.com', department: 'Management' },
  { id: 'U008', name: 'Henry Patel', email: 'henry.patel@company.com', department: 'Claims Processing' },
  { id: 'U009', name: 'Irene Davis', email: 'irene.davis@company.com', department: 'IT Support' },
  { id: 'U010', name: 'Jack Robinson', email: 'jack.robinson@company.com', department: 'Claims Processing' },
  { id: 'U011', name: 'Kate Wilson', email: 'kate.wilson@company.com', department: 'Management' },
  { id: 'U012', name: 'Leo Nguyen', email: 'leo.nguyen@company.com', department: 'Recovery' },
  { id: 'U013', name: 'Bikshma R Thatikonda', email: 'bikshma.thatikonda@company.com', department: 'Management' },
]

const initialAssignments: RoleAssignment[] = [
  { id: 'RA001', userId: 'U001', role: 'Processor', claimType: 'Debt/ATM', workbasket: 'Ready To Work', subtype: 'Initial Review' },
  { id: 'RA003', userId: 'U002', role: 'Reviewer', claimType: 'Check', workbasket: 'Ready To Work', subtype: 'Initial Review' },
  { id: 'RA004', userId: 'U002', role: 'Processor', claimType: 'Credit Card', workbasket: 'Pending', subtype: '' },
  { id: 'RA005', userId: 'U003', role: 'Processor', claimType: 'Debt/ATM', workbasket: 'Recovery', subtype: 'Chargeback' },
  { id: 'RA006', userId: 'U003', role: 'Processor', claimType: 'ACH', workbasket: 'Recovery', subtype: 'Exception' },
  { id: 'RA007', userId: 'U004', role: 'Manager', claimType: 'All', workbasket: 'Manager Approvals', subtype: '' },
  { id: 'RA008', userId: 'U005', role: 'Processor', claimType: 'OLB', workbasket: 'Ready To Work', subtype: 'Initial Review' },
  { id: 'RA009', userId: 'U005', role: 'Processor', claimType: 'IDT', workbasket: 'Ready To Work', subtype: 'Exception' },
  { id: 'RA010', userId: 'U006', role: 'Reviewer', claimType: 'Rejected Transactions', workbasket: 'Recovery', subtype: 'Chargeback' },
  { id: 'RA011', userId: 'U007', role: 'Manager', claimType: 'Credit Card', workbasket: 'Manager Approvals', subtype: '' },
  { id: 'RA012', userId: 'U007', role: 'Admin', claimType: 'All', workbasket: 'Ready To Work', subtype: '' },
  { id: 'RA013', userId: 'U008', role: 'Processor', claimType: 'Check', workbasket: 'Pending', subtype: '' },
  { id: 'RA014', userId: 'U008', role: 'Processor', claimType: 'Debt/ATM', workbasket: 'Ready To Work', subtype: 'Enhanced Review' },
  { id: 'RA015', userId: 'U009', role: 'Read Only', claimType: 'All', workbasket: 'Ready To Work', subtype: '' },
  { id: 'RA016', userId: 'U010', role: 'Processor', claimType: 'ACH', workbasket: 'Ready To Work', subtype: 'Initial Review' },
  { id: 'RA017', userId: 'U010', role: 'Reviewer', claimType: 'ACH', workbasket: 'Recovery', subtype: 'Chargeback' },
  { id: 'RA018', userId: 'U011', role: 'Manager', claimType: 'Debt/ATM', workbasket: 'Manager Approvals', subtype: '' },
  { id: 'RA019', userId: 'U011', role: 'Manager', claimType: 'Check', workbasket: 'Manager Approvals', subtype: '' },
  { id: 'RA020', userId: 'U012', role: 'Processor', claimType: 'Credit Card', workbasket: 'Recovery', subtype: 'Exception' },
  { id: 'RA021', userId: 'U012', role: 'Processor', claimType: 'IDT', workbasket: 'Recovery', subtype: 'Chargeback' },
  { id: 'RA022', userId: 'U013', role: 'Admin', claimType: 'All', workbasket: 'Ready To Work', subtype: '' },
  { id: 'RA023', userId: 'U013', role: 'Admin', claimType: 'All', workbasket: 'Pending', subtype: '' },
  { id: 'RA024', userId: 'U013', role: 'Admin', claimType: 'All', workbasket: 'Recovery', subtype: '' },
  { id: 'RA025', userId: 'U013', role: 'Admin', claimType: 'All', workbasket: 'Manager Approvals', subtype: '' },
]

function App() {
  const [activeSection, setActiveSection] = useState<SidebarSection>('workbasket')
  const [selectedClaimType, setSelectedClaimType] = useState('All')
  const [selectedWorkbasket, setSelectedWorkbasket] = useState('Ready To Work')
  const [selectedSubtype, setSelectedSubtype] = useState('Initial Review')
  const [selectedUserId, setSelectedUserId] = useState('')
  const [selectedClaimSubtype, setSelectedClaimSubtype] = useState('')

  // Permissions state
  const [assignments, setAssignments] = useState<RoleAssignment[]>(initialAssignments)
  const [permFilterUser, setPermFilterUser] = useState('')
  const [permFilterClaimType, setPermFilterClaimType] = useState('All')
  const [showAddForm, setShowAddForm] = useState(false)
  const [newAssignment, setNewAssignment] = useState({
    userId: testUsers[0].id,
    role: roles[0],
    claimType: claimTypes[1],
    workbasket: workbaskets[0],
    subtype: '',
  })

  const filteredAssignments = useMemo(() => {
    return assignments.filter((a) => {
      if (permFilterUser && a.userId !== permFilterUser) return false
      if (permFilterClaimType !== 'All' && a.claimType !== 'All' && a.claimType !== permFilterClaimType) return false
      return true
    })
  }, [assignments, permFilterUser, permFilterClaimType])

  const handleAddAssignment = () => {
    const subtypes = workbasketSubtypes[newAssignment.workbasket]
    const sub = subtypes.length > 0 ? (newAssignment.subtype || subtypes[0]) : ''
    const newId = `RA${String(assignments.length + 1).padStart(3, '0')}`
    setAssignments([...assignments, { ...newAssignment, subtype: sub, id: newId }])
    setShowAddForm(false)
  }

  const handleDeleteAssignment = (id: string) => {
    setAssignments(assignments.filter((a) => a.id !== id))
  }

  // Compute allowed claim types, workbaskets, subtypes based on selected user's permissions
  const userPermissions = useMemo(() => {
    if (!selectedUserId) {
      return {
        claimTypes: claimTypes,
        workbaskets: workbaskets,
        getSubtypes: (wb: string) => workbasketSubtypes[wb],
        hasAll: true,
      }
    }
    const userAssigns = assignments.filter((a) => a.userId === selectedUserId)
    const hasAllClaimType = userAssigns.some((a) => a.claimType === 'All')
    const allowedTypes = new Set<string>()
    if (hasAllClaimType) {
      claimTypes.forEach((t) => allowedTypes.add(t))
    } else {
      userAssigns.forEach((a) => allowedTypes.add(a.claimType))
    }
    const allowedWorkbaskets = new Set<string>()
    userAssigns.forEach((a) => allowedWorkbaskets.add(a.workbasket))
    const getSubtypes = (wb: string) => {
      const allSubs = workbasketSubtypes[wb]
      if (allSubs.length === 0) return []
      const userSubs = userAssigns
        .filter((a) => a.workbasket === wb && a.subtype)
        .map((a) => a.subtype)
      // If user has 'All' claim type for this workbasket with no specific subtype, show all
      const hasWbAll = userAssigns.some((a) => a.workbasket === wb && a.claimType === 'All' && !a.subtype)
      if (hasWbAll) return allSubs
      return allSubs.filter((s) => userSubs.includes(s))
    }
    return {
      claimTypes: claimTypes.filter((t) => allowedTypes.has(t)),
      workbaskets: workbaskets.filter((w) => allowedWorkbaskets.has(w)),
      getSubtypes,
      hasAll: hasAllClaimType,
    }
  }, [selectedUserId, assignments])

  const handleUserChange = (userId: string) => {
    setSelectedUserId(userId)
    // Reset selections when user changes
    if (!userId) {
      setSelectedClaimType('All')
      setSelectedWorkbasket('Ready To Work')
      setSelectedSubtype('Initial Review')
    } else {
      const userAssigns = assignments.filter((a) => a.userId === userId)
      const hasAllClaimType = userAssigns.some((a) => a.claimType === 'All')
      if (hasAllClaimType) {
        setSelectedClaimType('All')
      } else {
        const firstType = userAssigns.map((a) => a.claimType).find((t) => t !== 'All') || userAssigns[0]?.claimType || 'All'
        setSelectedClaimType(firstType)
      }
      const firstWb = workbaskets.find((w) => userAssigns.some((a) => a.workbasket === w)) || workbaskets[0]
      setSelectedWorkbasket(firstWb)
      const subs = workbasketSubtypes[firstWb]
      if (subs.length > 0) {
        const userSubs = userAssigns.filter((a) => a.workbasket === firstWb && a.subtype).map((a) => a.subtype)
        const hasWbAll = userAssigns.some((a) => a.workbasket === firstWb && a.claimType === 'All' && !a.subtype)
        const firstSub = hasWbAll ? subs[0] : (subs.find((s) => userSubs.includes(s)) || '')
        setSelectedSubtype(firstSub)
      } else {
        setSelectedSubtype('')
      }
    }
  }

  // User Worklist state
  const [worklistIndex, setWorklistIndex] = useState(0)
  const [worklistUserId, setWorklistUserId] = useState('')

  const prioritizedClaims = useMemo(() => {
    let pool = allClaims
    // Filter by user's assigned claim types if a user is selected
    if (worklistUserId) {
      const userAssigns = assignments.filter((a) => a.userId === worklistUserId)
      const hasAllClaimType = userAssigns.some((a) => a.claimType === 'All')
      if (!hasAllClaimType) {
        const allowedTypes = new Set(userAssigns.map((a) => a.claimType))
        pool = pool.filter((c) => allowedTypes.has(c.claimType))
      }
      // Also filter by allowed workbaskets
      const allowedWbs = new Set(userAssigns.map((a) => a.workbasket))
      pool = pool.filter((c) => allowedWbs.has(c.workbasket))
      // Also filter by allowed subtypes within each workbasket
      pool = pool.filter((c) => {
        const subs = workbasketSubtypes[c.workbasket]
        if (subs.length === 0) return true
        const userSubs = userAssigns
          .filter((a) => a.workbasket === c.workbasket && a.subtype)
          .map((a) => a.subtype)
        const hasWbAll = userAssigns.some((a) => a.workbasket === c.workbasket && a.claimType === 'All' && !a.subtype)
        if (hasWbAll) return true
        return userSubs.includes(c.subtype)
      })
    }
    const sorted = [...pool].sort((a, b) => {
      const amountA = parseFloat(a.amount.replace('$', ''))
      const amountB = parseFloat(b.amount.replace('$', ''))
      const isHighA = amountA > 5000
      const isHighB = amountB > 5000
      // High dollar claims first
      if (isHighA && !isHighB) return -1
      if (!isHighA && isHighB) return 1
      // Within same priority group, oldest first
      if (a.date < b.date) return -1
      if (a.date > b.date) return 1
      // If same date, higher amount first
      return amountB - amountA
    })
    return sorted
  }, [worklistUserId, assignments])

  const handleWorklistUserChange = (userId: string) => {
    setWorklistUserId(userId)
    setWorklistIndex(0)
  }

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
      if (selectedClaimSubtype && c.claimSubtype !== selectedClaimSubtype) return false
      return true
    })
  }, [selectedClaimType, selectedWorkbasket, selectedSubtype, selectedClaimSubtype])

  // Get available claim subtypes for current selection (ATM/Debit only)
  const availableClaimSubtypes = useMemo(() => {
    if (selectedClaimType === 'Debt/ATM' || selectedClaimType === 'All') {
      const subs = atmDebitClaimSubtypes[selectedSubtype]
      return subs || []
    }
    return []
  }, [selectedClaimType, selectedSubtype])

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
      case 'userWorklist': {
        const currentClaim = prioritizedClaims[worklistIndex]
        const totalClaims = prioritizedClaims.length
        const highPriorityCount = prioritizedClaims.filter((c) => parseFloat(c.amount.replace('$', '')) > 5000).length
        const currentAmount = currentClaim ? parseFloat(currentClaim.amount.replace('$', '')) : 0
        const isHighPriority = currentAmount > 5000
        return (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-gray-800">User Worklist</h2>
                <p className="text-gray-500">Priority queue: high dollar (&gt;$5,000) and oldest claims first.</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-gray-600">User:</label>
                  <select
                    value={worklistUserId}
                    onChange={(e) => handleWorklistUserChange(e.target.value)}
                    className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  >
                    <option value="">All Users</option>
                    {testUsers.map((u) => (
                      <option key={u.id} value={u.id}>{u.name}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <span className="flex items-center gap-1 rounded-full bg-red-100 px-3 py-1 text-red-800 font-medium">
                    <AlertTriangle size={14} /> {highPriorityCount} High Priority
                  </span>
                  <span className="text-gray-400">{totalClaims} total claims</span>
                </div>
              </div>
            </div>

            {worklistUserId && (
              <div className="rounded-md bg-amber-50 border border-amber-200 px-4 py-2 text-sm text-amber-800">
                Showing claims for <span className="font-semibold">{testUsers.find((u) => u.id === worklistUserId)?.name}</span> based on their assigned claim types, workbaskets, and subtypes.
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between rounded-lg bg-white border border-gray-200 px-5 py-3">
              <button
                onClick={() => setWorklistIndex(Math.max(0, worklistIndex - 1))}
                disabled={worklistIndex === 0}
                className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  worklistIndex === 0
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <ChevronLeft size={16} /> Previous Claim
              </button>
              <span className="text-sm font-medium text-gray-600">
                Claim {worklistIndex + 1} of {totalClaims}
              </span>
              <button
                onClick={() => setWorklistIndex(Math.min(totalClaims - 1, worklistIndex + 1))}
                disabled={worklistIndex >= totalClaims - 1}
                className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  worklistIndex >= totalClaims - 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                Next Claim <ChevronRight size={16} />
              </button>
            </div>

            {/* Current Claim Detail */}
            {currentClaim && (
              <div className={`rounded-lg border-2 ${
                isHighPriority ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white'
              } p-6 space-y-5`}>
                {isHighPriority && (
                  <div className="flex items-center gap-2 rounded-md bg-red-100 px-3 py-2 text-sm font-semibold text-red-800">
                    <AlertTriangle size={16} /> HIGH PRIORITY &mdash; Amount exceeds $5,000
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold font-mono text-blue-600">{currentClaim.id}</span>
                    <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusColors[currentClaim.status]}`}>
                      {currentClaim.status}
                    </span>
                  </div>
                  <span className="text-sm text-gray-400">Priority #{worklistIndex + 1}</span>
                </div>

                <div className="grid grid-cols-4 gap-6">
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wide flex items-center gap-1"><Calendar size={12} /> Claim Date</p>
                    <p className="text-sm font-semibold text-gray-800">{currentClaim.date}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Claim Status</p>
                    <p className="text-sm font-semibold text-gray-800">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[currentClaim.status]}`}>{currentClaim.status}</span>
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wide flex items-center gap-1"><DollarSign size={12} /> Dollar Amount</p>
                    <p className={`text-lg font-bold ${isHighPriority ? 'text-red-700' : 'text-gray-800'}`}>{currentClaim.amount}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Reg E Date</p>
                    <p className="text-sm font-semibold text-gray-800">{currentClaim.regEDate}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Sub Type</p>
                    <p className="text-sm font-semibold text-gray-800">{currentClaim.claimSubtype || '\u2014'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Claim Type</p>
                    <p className="text-sm font-semibold text-gray-800">{currentClaim.claimType}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Workbasket</p>
                    <p className="text-sm font-semibold text-gray-800">{currentClaim.workbasket}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Customer</p>
                    <p className="text-sm font-semibold text-gray-800">{currentClaim.customer}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Upcoming claims preview */}
            <div>
              <h3 className="text-sm font-semibold text-gray-600 mb-2">Upcoming Claims</h3>
              <div className="overflow-hidden rounded-lg border border-gray-200">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2.5 font-medium text-gray-600">#</th>
                      <th className="px-4 py-2.5 font-medium text-gray-600">Claim Date</th>
                      <th className="px-4 py-2.5 font-medium text-gray-600">Claim Status</th>
                      <th className="px-4 py-2.5 font-medium text-gray-600">Claim Number</th>
                      <th className="px-4 py-2.5 font-medium text-gray-600">Dollar Amount</th>
                      <th className="px-4 py-2.5 font-medium text-gray-600">Reg E Date</th>
                      <th className="px-4 py-2.5 font-medium text-gray-600">Sub Type</th>
                      <th className="px-4 py-2.5 font-medium text-gray-600">Priority</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {prioritizedClaims.slice(worklistIndex, worklistIndex + 10).map((claim, idx) => {
                      const amt = parseFloat(claim.amount.replace('$', ''))
                      const isHigh = amt > 5000
                      return (
                        <tr
                          key={claim.id}
                          className={`transition-colors cursor-pointer ${
                            idx === 0 ? 'bg-blue-50 font-medium' : 'hover:bg-gray-50'
                          }`}
                          onClick={() => setWorklistIndex(worklistIndex + idx)}
                        >
                          <td className="px-4 py-2.5 text-gray-400">{worklistIndex + idx + 1}</td>
                          <td className="px-4 py-2.5 text-gray-700">{claim.date}</td>
                          <td className="px-4 py-2.5">
                            <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[claim.status]}`}>{claim.status}</span>
                          </td>
                          <td className="px-4 py-2.5 font-mono text-blue-600">{claim.id}</td>
                          <td className={`px-4 py-2.5 font-medium ${isHigh ? 'text-red-700' : ''}`}>{claim.amount}</td>
                          <td className="px-4 py-2.5 text-gray-500">{claim.regEDate}</td>
                          <td className="px-4 py-2.5">{claim.claimSubtype || '\u2014'}</td>
                          <td className="px-4 py-2.5">
                            {isHigh ? (
                              <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800">High</span>
                            ) : (
                              <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">Normal</span>
                            )}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )
      }
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
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-gray-800">Set Colleague Permissions</h2>
                <p className="text-gray-500">Assign roles to users at claim type, workbasket, and subtype level.</p>
              </div>
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
              >
                <Plus size={16} />
                Assign Role
              </button>
            </div>

            {/* Add Assignment Form */}
            {showAddForm && (
              <div className="rounded-lg border border-blue-200 bg-blue-50 p-5 space-y-4">
                <h3 className="text-sm font-semibold text-blue-800 flex items-center gap-2">
                  <Shield size={16} /> New Role Assignment
                </h3>
                <div className="grid grid-cols-5 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">User</label>
                    <select
                      value={newAssignment.userId}
                      onChange={(e) => setNewAssignment({ ...newAssignment, userId: e.target.value })}
                      className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                    >
                      {testUsers.map((u) => (
                        <option key={u.id} value={u.id}>{u.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Role</label>
                    <select
                      value={newAssignment.role}
                      onChange={(e) => setNewAssignment({ ...newAssignment, role: e.target.value })}
                      className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                    >
                      {roles.map((r) => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Claim Type</label>
                    <select
                      value={newAssignment.claimType}
                      onChange={(e) => setNewAssignment({ ...newAssignment, claimType: e.target.value })}
                      className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                    >
                      {claimTypes.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Workbasket</label>
                    <select
                      value={newAssignment.workbasket}
                      onChange={(e) => {
                        const wb = e.target.value
                        const subs = workbasketSubtypes[wb]
                        setNewAssignment({ ...newAssignment, workbasket: wb, subtype: subs.length > 0 ? subs[0] : '' })
                      }}
                      className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                    >
                      {workbaskets.map((w) => (
                        <option key={w} value={w}>{w}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Subtype</label>
                    {workbasketSubtypes[newAssignment.workbasket].length > 0 ? (
                      <select
                        value={newAssignment.subtype}
                        onChange={(e) => setNewAssignment({ ...newAssignment, subtype: e.target.value })}
                        className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                      >
                        {workbasketSubtypes[newAssignment.workbasket].map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    ) : (
                      <div className="rounded-md border border-gray-200 bg-gray-100 px-3 py-2 text-sm text-gray-400">N/A</div>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 pt-1">
                  <button
                    onClick={handleAddAssignment}
                    className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
                  >
                    Save Assignment
                  </button>
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="rounded-md bg-white border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Filters */}
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-600">Filter by User:</label>
                <select
                  value={permFilterUser}
                  onChange={(e) => setPermFilterUser(e.target.value)}
                  className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                >
                  <option value="">All Users</option>
                  {testUsers.map((u) => (
                    <option key={u.id} value={u.id}>{u.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-600">Filter by Claim Type:</label>
                <select
                  value={permFilterClaimType}
                  onChange={(e) => setPermFilterClaimType(e.target.value)}
                  className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                >
                  {claimTypes.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>

            <p className="text-xs text-gray-400">
              Showing {filteredAssignments.length} assignment{filteredAssignments.length !== 1 ? 's' : ''}
            </p>

            {/* Assignments Table */}
            <div className="overflow-hidden rounded-lg border border-gray-200">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 font-medium text-gray-600">User</th>
                    <th className="px-4 py-3 font-medium text-gray-600">Department</th>
                    <th className="px-4 py-3 font-medium text-gray-600">Role</th>
                    <th className="px-4 py-3 font-medium text-gray-600">Claim Type</th>
                    <th className="px-4 py-3 font-medium text-gray-600">Workbasket</th>
                    <th className="px-4 py-3 font-medium text-gray-600">Subtype</th>
                    <th className="px-4 py-3 font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredAssignments.map((a) => {
                    const user = testUsers.find((u) => u.id === a.userId)
                    const roleColor =
                      a.role === 'Admin' ? 'bg-red-100 text-red-800' :
                      a.role === 'Manager' ? 'bg-purple-100 text-purple-800' :
                      a.role === 'Reviewer' ? 'bg-blue-100 text-blue-800' :
                      a.role === 'Read Only' ? 'bg-gray-100 text-gray-800' :
                      'bg-green-100 text-green-800'
                    return (
                      <tr key={a.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3">
                          <div>
                            <p className="font-medium text-gray-800">{user?.name}</p>
                            <p className="text-xs text-gray-400">{user?.email}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-600">{user?.department}</td>
                        <td className="px-4 py-3">
                          <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${roleColor}`}>
                            {a.role}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-700">{a.claimType}</td>
                        <td className="px-4 py-3 text-gray-700">{a.workbasket}</td>
                        <td className="px-4 py-3 text-gray-500">{a.subtype || '—'}</td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => handleDeleteAssignment(a.id)}
                            className="rounded-md p-1.5 text-red-500 hover:bg-red-50 transition-colors"
                            title="Remove assignment"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                  {filteredAssignments.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-4 py-8 text-center text-gray-400">
                        No assignments found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* User Summary Cards */}
            <h3 className="text-lg font-semibold text-gray-800 pt-2">User Summary</h3>
            <div className="grid grid-cols-3 gap-4">
              {testUsers.map((user) => {
                const userAssignments = assignments.filter((a) => a.userId === user.id)
                if (userAssignments.length === 0) return null
                return (
                  <div key={user.id} className="rounded-lg border border-gray-200 bg-white p-4 space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
                        {user.name.split(' ').map((n) => n[0]).join('')}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">{user.name}</p>
                        <p className="text-xs text-gray-400">{user.department}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {userAssignments.map((a) => (
                        <span
                          key={a.id}
                          className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600"
                          title={`${a.role} - ${a.claimType} / ${a.workbasket}${a.subtype ? ' / ' + a.subtype : ''}`}
                        >
                          {a.claimType} &middot; {a.workbasket}{a.subtype ? ` &rsaquo; ${a.subtype}` : ''}
                        </span>
                      ))}
                    </div>
                    <p className="text-xs text-gray-400">{userAssignments.length} assignment{userAssignments.length !== 1 ? 's' : ''}</p>
                  </div>
                )
              })}
            </div>
          </div>
        )
      case 'workbasket': {
        const visibleClaimTypes = userPermissions.claimTypes
        const visibleWorkbaskets = userPermissions.workbaskets
        const visibleSubtypes = userPermissions.getSubtypes(selectedWorkbasket)
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-gray-800">Workbasket</h2>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-gray-600">Claim Type:</label>
                  <select
                    value={selectedClaimType}
                    onChange={(e) => setSelectedClaimType(e.target.value)}
                    className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  >
                    {visibleClaimTypes.map((type) => (
                      <option key={type} value={type}>
                        {type} ({claimCountByType[type]})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-gray-600">User:</label>
                  <select
                    value={selectedUserId}
                    onChange={(e) => handleUserChange(e.target.value)}
                    className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  >
                    <option value="">All Users (No Filter)</option>
                    {testUsers.map((u) => (
                      <option key={u.id} value={u.id}>{u.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {selectedUserId && (
              <div className="rounded-md bg-amber-50 border border-amber-200 px-4 py-2 text-sm text-amber-800">
                Viewing as <span className="font-semibold">{testUsers.find((u) => u.id === selectedUserId)?.name}</span> &mdash; only permitted claim types, workbaskets, and subtypes are shown.
              </div>
            )}

            {/* Workbasket selection tabs */}
            <div className="flex gap-3">
              {visibleWorkbaskets.map((basket) => (
                <button
                  key={basket}
                  onClick={() => {
                    setSelectedWorkbasket(basket)
                    const subs = userPermissions.getSubtypes(basket)
                    setSelectedSubtype(subs.length > 0 ? subs[0] : '')
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
            {visibleSubtypes.length > 0 && (
              <div className="flex gap-2">
                {visibleSubtypes.map((subtype) => (
                  <button
                    key={subtype}
                    onClick={() => { setSelectedSubtype(subtype); setSelectedClaimSubtype('') }}
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

            {/* Claim Subtype filter (ATM/Debit specific) */}
            {availableClaimSubtypes.length > 0 && (
              <div className="flex items-center gap-2">
                <label className="text-xs font-medium text-gray-500">Sub Type Filter:</label>
                <select
                  value={selectedClaimSubtype}
                  onChange={(e) => setSelectedClaimSubtype(e.target.value)}
                  className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs text-gray-700 focus:border-blue-500 focus:outline-none"
                >
                  <option value="">All Sub Types</option>
                  {availableClaimSubtypes.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
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
                    <th className="px-4 py-3 font-medium text-gray-600">Claim Date</th>
                    <th className="px-4 py-3 font-medium text-gray-600">Claim Status</th>
                    <th className="px-4 py-3 font-medium text-gray-600">Claim Number</th>
                    <th className="px-4 py-3 font-medium text-gray-600">Dollar Amount</th>
                    <th className="px-4 py-3 font-medium text-gray-600">Reg E Date</th>
                    <th className="px-4 py-3 font-medium text-gray-600">Sub Type</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredClaims.map((claim) => (
                    <tr key={claim.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-gray-700">{claim.date}</td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[claim.status]}`}>
                          {claim.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-mono text-blue-600">{claim.id}</td>
                      <td className="px-4 py-3 font-medium">{claim.amount}</td>
                      <td className="px-4 py-3 text-gray-500">{claim.regEDate}</td>
                      <td className="px-4 py-3">{claim.claimSubtype || '\u2014'}</td>
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
      }
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
