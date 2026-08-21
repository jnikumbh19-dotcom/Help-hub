import React, { useState } from 'react';
import {
  ServiceProvider,
  AuditLogEntry,
  EmergencyCategory,
  User,
  CityData,
  ComplaintTicket,
  UserRole,
} from '../types';
import { CITIES_DATA, INITIAL_USERS } from '../data/mockData';

interface AdminDashboardViewProps {
  currentUser: User | null;
  providers: ServiceProvider[];
  auditLogs: AuditLogEntry[];
  users?: User[];
  cities?: CityData[];
  complaints?: ComplaintTicket[];
  onToggleVerify: (id: string) => void;
  onToggleActive: (id: string) => void;
  onApproveProvider: (id: string) => void;
  onRejectProvider: (id: string, reason: string) => void;
  onAddProvider: (provider: ServiceProvider) => void;
  onDeleteProvider: (id: string) => void;
  onUpdateUserRole: (userId: string, newRole: UserRole) => void;
  onUpdateComplaintStatus: (ticketId: string, status: ComplaintTicket['status'], response?: string) => void;
  onAddCity: (city: CityData) => void;
  onToggleCityActive: (cityId: string) => void;
  onQuickLoginAsAdmin?: () => void;
  onNavigateToUserDashboard?: () => void;
  onNavigateToBusinessPanel?: () => void;
  onNavigateToHome?: () => void;
  onNavigateToAuth?: () => void;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({
  currentUser,
  providers,
  auditLogs,
  users = INITIAL_USERS,
  cities = CITIES_DATA,
  complaints = [],
  onToggleVerify,
  onToggleActive,
  onApproveProvider,
  onRejectProvider,
  onAddProvider,
  onDeleteProvider,
  onUpdateUserRole,
  onUpdateComplaintStatus,
  onAddCity,
  onToggleCityActive,
  onQuickLoginAsAdmin,
  onNavigateToUserDashboard,
  onNavigateToBusinessPanel,
  onNavigateToHome,
}) => {
  const [activeAdminTab, setActiveAdminTab] = useState<
    'overview' | 'queue' | 'providers' | 'cities' | 'users' | 'complaints' | 'audit'
  >('overview');

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [rejectModalProvider, setRejectModalProvider] = useState<ServiceProvider | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  // Complaint response state
  const [respondingTicket, setRespondingTicket] = useState<ComplaintTicket | null>(null);
  const [adminReplyText, setAdminReplyText] = useState('');

  // New Provider Form State
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState<EmergencyCategory>('breakdown');
  const [newSubcategory, setNewSubcategory] = useState('Roadside Assistance');
  const [newPhone, setNewPhone] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [newCity, setNewCity] = useState('Nashik');
  const [newIs24x7, setNewIs24x7] = useState(true);

  // New City Form State
  const [showAddCityModal, setShowAddCityModal] = useState(false);
  const [newCityName, setNewCityName] = useState('');
  const [newCityState, setNewCityState] = useState('Maharashtra');
  const [newCityTagline, setNewCityTagline] = useState('');
  const [newCityPolice, setNewCityPolice] = useState('100');
  const [newCityAmbulance, setNewCityAmbulance] = useState('108');
  const [newCityFire, setNewCityFire] = useState('101');

  // ACCESS CONTROL CHECK - STRICT SINGLE-OWNER ADMIN
  const isAdmin = currentUser?.role === 'admin';

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 max-w-xl mx-auto text-center space-y-6 animate-in fade-in">
        <div className="w-20 h-20 rounded-3xl bg-red-100 border-2 border-red-300 text-[#b6171e] flex items-center justify-center shadow-lg">
          <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>
            gpp_bad
          </span>
        </div>

        <div className="space-y-3">
          <span className="px-3 py-1 bg-red-100 text-red-900 border border-red-300 rounded-full text-xs font-black uppercase tracking-wider">
            403 • Access Denied
          </span>
          <h2 className="text-2xl md:text-3xl font-black text-[#041627]">
            Single-Owner Admin Portal
          </h2>
          <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
            The HELP HUB Main Admin Portal is strictly restricted to the predefined{' '}
            <strong className="text-[#041627]">Platform Owner (Dr. Vikram Adhikari)</strong>. Normal users and business owners are not permitted to view or modify platform-wide dispatch settings.
          </p>
        </div>

        {/* Current User Role Notice */}
        <div className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 text-xs text-left space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-gray-500 font-semibold">Your Current Session:</span>
            <span className="font-bold px-2 py-0.5 rounded uppercase bg-sky-100 text-sky-800 text-[10px]">
              {currentUser ? currentUser.role : 'Unauthenticated Guest'}
            </span>
          </div>
          <div className="flex items-center justify-between text-gray-700">
            <span>Account Name:</span>
            <strong className="text-[#041627]">{currentUser?.name || 'Guest Visitor'}</strong>
          </div>
          <div className="flex items-center justify-between text-gray-700">
            <span>Email:</span>
            <span className="font-mono text-gray-600">{currentUser?.email || 'N/A'}</span>
          </div>
        </div>

        {/* Action & Redirect Buttons */}
        <div className="w-full space-y-2.5 pt-2">
          {currentUser?.role === 'user' && onNavigateToUserDashboard && (
            <button
              onClick={onNavigateToUserDashboard}
              className="w-full py-3 px-4 bg-[#041627] hover:bg-[#1a2b3c] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-base">person</span>
              <span>Redirect to My Citizen Dashboard & ICE Profile</span>
            </button>
          )}

          {currentUser?.role === 'business' && onNavigateToBusinessPanel && (
            <button
              onClick={onNavigateToBusinessPanel}
              className="w-full py-3 px-4 bg-[#041627] hover:bg-[#1a2b3c] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-base">storefront</span>
              <span>Redirect to My Business / Garage Management Panel</span>
            </button>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {onNavigateToHome && (
              <button
                onClick={onNavigateToHome}
                className="py-2.5 px-4 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
              >
                <span className="material-symbols-outlined text-base">home</span>
                <span>Return to Home</span>
              </button>
            )}

            {onQuickLoginAsAdmin && (
              <button
                onClick={onQuickLoginAsAdmin}
                className="py-2.5 px-4 bg-[#b6171e] hover:bg-[#930010] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all"
              >
                <span className="material-symbols-outlined text-base">admin_panel_settings</span>
                <span>Sign In as Platform Owner</span>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Pending queue items
  const pendingQueue = providers.filter((p) => p.verificationStatus === 'pending' || !p.isVerified);
  const verifiedCount = providers.filter((p) => p.isVerified).length;
  const activeCount = providers.filter((p) => p.isActive).length;
  const openComplaintsCount = complaints.filter((c) => c.status === 'open' || c.status === 'investigating').length;

  const filteredProviders = providers.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.phone.includes(searchQuery);
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesCity = selectedCity === 'all' || p.city.toLowerCase() === selectedCity.toLowerCase();
    return matchesSearch && matchesCategory && matchesCity;
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newPhone.trim() || !newAddress.trim()) return;

    const created: ServiceProvider = {
      id: `prov-custom-${Date.now()}`,
      name: newName.trim(),
      category: newCategory,
      subcategory: newSubcategory.trim(),
      phone: newPhone.trim(),
      address: newAddress.trim(),
      city: newCity.trim(),
      coordinates: { lat: 19.9975, lng: 73.7898 },
      distanceKm: 1.5,
      rating: 5.0,
      reviewCount: 1,
      isVerified: true,
      verificationStatus: 'verified',
      isOpen24x7: newIs24x7,
      operatingHours: newIs24x7 ? '24 Hours / 7 Days Non-Stop' : '08:00 AM - 08:00 PM',
      services: ['Emergency Assistance', 'Verified Dispatch Unit'],
      lastVerifiedDate: new Date().toISOString().split('T')[0],
      isActive: true,
    };

    onAddProvider(created);
    setShowAddModal(false);
    setNewName('');
    setNewPhone('');
    setNewAddress('');
  };

  const handleCreateCity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCityName.trim()) return;

    const newCityObj: CityData = {
      id: `city-${Date.now()}`,
      name: newCityName.trim(),
      state: newCityState.trim(),
      tagline: newCityTagline.trim() || 'Regional Emergency Zone',
      coordinates: { lat: 19.9975, lng: 73.7898 },
      emergencyHotlines: {
        police: newCityPolice.trim(),
        ambulance: newCityAmbulance.trim(),
        fire: newCityFire.trim(),
        traffic: '1073',
        disaster: '1077',
      },
      isActive: true,
    };

    onAddCity(newCityObj);
    setShowAddCityModal(false);
    setNewCityName('');
    setNewCityTagline('');
  };

  const handleConfirmReject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectModalProvider) return;
    onRejectProvider(rejectModalProvider.id, rejectionReason.trim() || 'Incomplete registration documents.');
    setRejectModalProvider(null);
    setRejectionReason('');
  };

  const handleSendTicketReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!respondingTicket) return;
    onUpdateComplaintStatus(respondingTicket.id, 'resolved', adminReplyText.trim() || 'Resolved by Admin Desk.');
    setRespondingTicket(null);
    setAdminReplyText('');
  };

  return (
    <div className="flex flex-col flex-1 max-w-7xl mx-auto w-full pb-16 space-y-6 animate-in fade-in">
      {/* Admin Top Header */}
      <div className="bg-[#041627] text-white rounded-2xl p-5 md:p-6 shadow-md border border-gray-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-red-500/20 text-red-400 text-xs font-bold uppercase tracking-wider flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">security</span>
              Single Platform Owner
            </span>
            <span className="text-xs text-gray-400">• Dr. Vikram Adhikari</span>
          </div>
          <h1 className="text-xl md:text-2xl font-extrabold text-white">
            HELP HUB Platform Governance & Master Dispatch
          </h1>
          <p className="text-xs text-gray-300">
            Exclusive single-owner administrative control for provider verification, city hotlines, and user management.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddCityModal(true)}
            className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-1.5 border border-white/20 transition-all active:scale-95"
          >
            <span className="material-symbols-outlined text-sm">location_city</span>
            <span>Add City</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 rounded-xl bg-[#b6171e] hover:bg-[#930010] text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all active:scale-95"
          >
            <span className="material-symbols-outlined text-sm">add_business</span>
            <span>Add Service Provider</span>
          </button>
        </div>
      </div>

      {/* Admin Tabs */}
      <div className="flex border-b border-gray-200 bg-white rounded-t-xl px-4 overflow-x-auto">
        <button
          onClick={() => setActiveAdminTab('overview')}
          className={`py-3 px-4 text-xs font-bold border-b-2 whitespace-nowrap transition-all flex items-center gap-1.5 ${
            activeAdminTab === 'overview'
              ? 'border-[#b6171e] text-[#b6171e]'
              : 'border-transparent text-gray-500 hover:text-[#041627]'
          }`}
        >
          <span className="material-symbols-outlined text-base">dashboard</span>
          <span>System Overview</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('queue')}
          className={`py-3 px-4 text-xs font-bold border-b-2 whitespace-nowrap transition-all flex items-center gap-1.5 ${
            activeAdminTab === 'queue'
              ? 'border-[#b6171e] text-[#b6171e]'
              : 'border-transparent text-gray-500 hover:text-[#041627]'
          }`}
        >
          <span className="material-symbols-outlined text-base">pending_actions</span>
          <span>Verification Queue</span>
          {pendingQueue.length > 0 && (
            <span className="px-1.5 py-0.2 bg-red-600 text-white text-[10px] rounded-full font-mono">
              {pendingQueue.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveAdminTab('providers')}
          className={`py-3 px-4 text-xs font-bold border-b-2 whitespace-nowrap transition-all flex items-center gap-1.5 ${
            activeAdminTab === 'providers'
              ? 'border-[#b6171e] text-[#b6171e]'
              : 'border-transparent text-gray-500 hover:text-[#041627]'
          }`}
        >
          <span className="material-symbols-outlined text-base">storefront</span>
          <span>All Providers ({providers.length})</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('cities')}
          className={`py-3 px-4 text-xs font-bold border-b-2 whitespace-nowrap transition-all flex items-center gap-1.5 ${
            activeAdminTab === 'cities'
              ? 'border-[#b6171e] text-[#b6171e]'
              : 'border-transparent text-gray-500 hover:text-[#041627]'
          }`}
        >
          <span className="material-symbols-outlined text-base">location_on</span>
          <span>Cities & Hotlines ({cities.length})</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('users')}
          className={`py-3 px-4 text-xs font-bold border-b-2 whitespace-nowrap transition-all flex items-center gap-1.5 ${
            activeAdminTab === 'users'
              ? 'border-[#b6171e] text-[#b6171e]'
              : 'border-transparent text-gray-500 hover:text-[#041627]'
          }`}
        >
          <span className="material-symbols-outlined text-base">group</span>
          <span>Users & Roles ({users.length})</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('complaints')}
          className={`py-3 px-4 text-xs font-bold border-b-2 whitespace-nowrap transition-all flex items-center gap-1.5 ${
            activeAdminTab === 'complaints'
              ? 'border-[#b6171e] text-[#b6171e]'
              : 'border-transparent text-gray-500 hover:text-[#041627]'
          }`}
        >
          <span className="material-symbols-outlined text-base">report_problem</span>
          <span>Citizen Complaints</span>
          {openComplaintsCount > 0 && (
            <span className="px-1.5 py-0.2 bg-amber-500 text-white text-[10px] rounded-full font-mono">
              {openComplaintsCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveAdminTab('audit')}
          className={`py-3 px-4 text-xs font-bold border-b-2 whitespace-nowrap transition-all flex items-center gap-1.5 ${
            activeAdminTab === 'audit'
              ? 'border-[#b6171e] text-[#b6171e]'
              : 'border-transparent text-gray-500 hover:text-[#041627]'
          }`}
        >
          <span className="material-symbols-outlined text-base">history</span>
          <span>Audit Logs ({auditLogs.length})</span>
        </button>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeAdminTab === 'overview' && (
        <div className="bg-white p-6 rounded-b-xl border border-t-0 border-gray-200 space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 bg-sky-50 border border-sky-200 rounded-xl space-y-1">
              <span className="text-sky-700 font-bold text-xs">Total Registered Providers</span>
              <p className="text-2xl font-black text-[#041627]">{providers.length}</p>
              <span className="text-[10px] text-gray-500">Across {cities.length} operational cities</span>
            </div>

            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1">
              <span className="text-emerald-700 font-bold text-xs">Verified Active Units</span>
              <p className="text-2xl font-black text-emerald-900">{verifiedCount}</p>
              <span className="text-[10px] text-emerald-700">{activeCount} online & dispatch ready</span>
            </div>

            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl space-y-1">
              <span className="text-amber-700 font-bold text-xs">Pending Reviews</span>
              <p className="text-2xl font-black text-amber-900">{pendingQueue.length}</p>
              <span className="text-[10px] text-amber-700">Awaiting municipal verification</span>
            </div>

            <div className="p-4 bg-red-50 border border-red-200 rounded-xl space-y-1">
              <span className="text-red-700 font-bold text-xs">Citizen Grievances</span>
              <p className="text-2xl font-black text-red-900">{openComplaintsCount}</p>
              <span className="text-[10px] text-red-700">Requiring vigilance desk reply</span>
            </div>
          </div>

          {/* Quick Action Matrix */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 border border-gray-200 rounded-2xl bg-gray-50/50 space-y-3">
              <h3 className="font-bold text-sm text-[#041627] flex items-center gap-2">
                <span className="material-symbols-outlined text-sky-700">speed</span>
                Platform Health & Coverage
              </h3>
              <ul className="text-xs text-gray-600 space-y-2">
                <li className="flex items-center justify-between">
                  <span>Nashik Emergency Coverage:</span>
                  <strong className="text-emerald-700">100% Operational (108/112 Active)</strong>
                </li>
                <li className="flex items-center justify-between">
                  <span>Pune Auto & Expressway Corridor:</span>
                  <strong className="text-emerald-700">Active (5 Verified Units)</strong>
                </li>
                <li className="flex items-center justify-between">
                  <span>Mumbai Metropolitan Gateway:</span>
                  <strong className="text-emerald-700">Active (6 Verified Units)</strong>
                </li>
                <li className="flex items-center justify-between">
                  <span>Average Dispatch Dispatch Time:</span>
                  <strong className="text-[#041627]">8.4 Minutes</strong>
                </li>
              </ul>
            </div>

            <div className="p-5 border border-gray-200 rounded-2xl bg-gray-50/50 space-y-3">
              <h3 className="font-bold text-sm text-[#041627] flex items-center gap-2">
                <span className="material-symbols-outlined text-[#b6171e]">admin_panel_settings</span>
                Single-Owner Governance Status
              </h3>
              <p className="text-xs text-gray-600">
                HELP HUB is locked to <strong>1 dedicated Platform Owner account</strong>. Public registration for administrative privileges is locked at the core architectural layer.
              </p>
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 bg-emerald-100 p-2.5 rounded-xl">
                <span className="material-symbols-outlined text-sm">lock</span>
                <span>Master Admin: Dr. Vikram Adhikari (admin@helphub.org)</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: VERIFICATION QUEUE */}
      {activeAdminTab === 'queue' && (
        <div className="bg-white p-6 rounded-b-xl border border-t-0 border-gray-200 space-y-4">
          <div>
            <h3 className="font-bold text-sm text-[#041627]">Pending Service Provider Registrations</h3>
            <p className="text-xs text-gray-500">
              Verify workshop addresses, commercial licenses, and hotline availability before publishing to public citizen feeds.
            </p>
          </div>

          {pendingQueue.length === 0 ? (
            <div className="p-8 text-center border-2 border-dashed border-gray-200 rounded-2xl text-gray-400 text-xs">
              <span className="material-symbols-outlined text-3xl mb-1 text-emerald-600">task_alt</span>
              <p className="font-bold text-gray-700">Verification Queue is Clear!</p>
              <p>All emergency service providers and garages have been reviewed.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingQueue.map((prov) => (
                <div
                  key={prov.id}
                  className="p-4 rounded-xl border border-amber-200 bg-amber-50/30 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-extrabold text-sm text-[#041627]">{prov.name}</h4>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-100 text-amber-800">
                        {prov.category}
                      </span>
                      <span className="text-[11px] text-gray-500">{prov.city}</span>
                    </div>
                    <p className="text-xs text-gray-600">{prov.address}</p>
                    <p className="text-xs text-gray-700 font-mono">
                      Hotline: <strong>{prov.phone}</strong> • Operating: {prov.operatingHours || '24x7'}
                    </p>
                    {prov.rejectionReason && (
                      <p className="text-xs text-red-600 bg-red-50 p-1.5 rounded">
                        <strong>Previous Note:</strong> {prov.rejectionReason}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => onApproveProvider(prov.id)}
                      className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-xs active:scale-95"
                    >
                      <span className="material-symbols-outlined text-sm">verified</span>
                      <span>Approve & Verify</span>
                    </button>

                    <button
                      onClick={() => setRejectModalProvider(prov)}
                      className="px-3.5 py-2 bg-red-700 hover:bg-red-800 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-xs active:scale-95"
                    >
                      <span className="material-symbols-outlined text-sm">cancel</span>
                      <span>Reject Application</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: ALL PROVIDERS */}
      {activeAdminTab === 'providers' && (
        <div className="bg-white p-6 rounded-b-xl border border-t-0 border-gray-200 space-y-4">
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search provider by name, phone or address..."
                className="w-full pl-9 pr-3 py-2 text-xs border border-gray-300 rounded-xl"
              />
              <span className="material-symbols-outlined absolute left-2.5 top-2 text-gray-400 text-base">
                search
              </span>
            </div>

            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="p-2 text-xs border border-gray-300 rounded-xl bg-white"
            >
              <option value="all">All Cities</option>
              {cities.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="p-2 text-xs border border-gray-300 rounded-xl bg-white"
            >
              <option value="all">All Categories</option>
              <option value="medical">Medical</option>
              <option value="police">Police</option>
              <option value="fire">Fire</option>
              <option value="breakdown">Breakdown / Garage</option>
              <option value="towing">Towing</option>
              <option value="fuel">Fuel / EV</option>
              <option value="pharmacy">Pharmacy</option>
              <option value="locksmith">Locksmith</option>
            </select>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-gray-100 text-gray-700 border-b border-gray-300">
                  <th className="p-3 font-bold">Service / Business</th>
                  <th className="p-3 font-bold">Category & City</th>
                  <th className="p-3 font-bold">Phone Number</th>
                  <th className="p-3 font-bold">Status</th>
                  <th className="p-3 font-bold text-right">Admin Controls</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredProviders.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="p-3">
                      <div className="font-bold text-[#041627] flex items-center gap-1.5">
                        <span>{p.name}</span>
                        {p.isDemoData && (
                          <span className="text-[9px] bg-gray-100 text-gray-600 px-1.5 py-0.2 rounded border">
                            DEMO
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-gray-500 truncate max-w-xs">{p.address}</p>
                    </td>

                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-gray-100 text-gray-700">
                        {p.category}
                      </span>
                      <span className="block text-[11px] text-gray-600 font-medium">{p.city}</span>
                    </td>

                    <td className="p-3 font-mono text-gray-800 font-bold">{p.phone}</td>

                    <td className="p-3">
                      <div className="flex flex-col gap-1">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold w-fit uppercase ${
                            p.isVerified
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {p.verificationStatus || (p.isVerified ? 'Verified' : 'Unverified')}
                        </span>
                        <span
                          className={`text-[10px] font-semibold ${
                            p.isActive ? 'text-emerald-700' : 'text-gray-400'
                          }`}
                        >
                          {p.isActive ? '• Dispatch Ready' : '• Paused'}
                        </span>
                      </div>
                    </td>

                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onToggleVerify(p.id)}
                          title={p.isVerified ? 'Revoke Verification' : 'Verify'}
                          className={`p-1.5 rounded-lg text-xs font-bold border transition-colors ${
                            p.isVerified
                              ? 'bg-emerald-50 border-emerald-300 text-emerald-800 hover:bg-emerald-100'
                              : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          <span className="material-symbols-outlined text-sm">
                            {p.isVerified ? 'verified' : 'new_releases'}
                          </span>
                        </button>

                        <button
                          onClick={() => onToggleActive(p.id)}
                          title={p.isActive ? 'Deactivate Dispatch' : 'Activate Dispatch'}
                          className={`p-1.5 rounded-lg text-xs font-bold border transition-colors ${
                            p.isActive
                              ? 'bg-sky-50 border-sky-300 text-sky-800 hover:bg-sky-100'
                              : 'bg-gray-100 border-gray-300 text-gray-400 hover:bg-gray-200'
                          }`}
                        >
                          <span className="material-symbols-outlined text-sm">
                            {p.isActive ? 'toggle_on' : 'toggle_off'}
                          </span>
                        </button>

                        <button
                          onClick={() => onDeleteProvider(p.id)}
                          title="Delete Provider"
                          className="p-1.5 rounded-lg text-xs font-bold bg-red-50 border border-red-200 text-red-700 hover:bg-red-100"
                        >
                          <span className="material-symbols-outlined text-sm">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: CITIES & HOTLINES */}
      {activeAdminTab === 'cities' && (
        <div className="bg-white p-6 rounded-b-xl border border-t-0 border-gray-200 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-[#041627]">Operational Cities & Municipal Hotlines</h3>
              <p className="text-xs text-gray-500">
                Configure regional emergency dispatch hotlines for Police, Ambulance (108), Fire, and Traffic control.
              </p>
            </div>

            <button
              onClick={() => setShowAddCityModal(true)}
              className="px-3 py-1.5 bg-[#041627] text-white rounded-lg text-xs font-bold flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-sm">add</span>
              <span>New City</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {cities.map((c) => (
              <div
                key={c.id}
                className="p-4 rounded-2xl border border-gray-200 bg-gray-50/50 space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-extrabold text-sm text-[#041627]">
                      {c.name}, {c.state}
                    </h4>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        c.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {c.isActive ? 'ACTIVE' : 'INACTIVE'}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500 italic mb-2">{c.tagline}</p>

                  <div className="space-y-1.5 text-xs text-gray-700 bg-white p-3 rounded-xl border border-gray-200">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Police PCR:</span>
                      <strong className="font-mono">{c.emergencyHotlines.police}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Ambulance ER:</span>
                      <strong className="font-mono text-red-600">{c.emergencyHotlines.ambulance}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Fire Brigade:</span>
                      <strong className="font-mono">{c.emergencyHotlines.fire}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Traffic Desk:</span>
                      <strong className="font-mono">{c.emergencyHotlines.traffic}</strong>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => onToggleCityActive(c.id)}
                    className="text-xs font-bold text-sky-700 hover:underline"
                  >
                    {c.isActive ? 'Disable City' : 'Enable City'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: USERS & ACCESS CONTROL GOVERNANCE */}
      {activeAdminTab === 'users' && (
        <div className="bg-white p-6 rounded-b-xl border border-t-0 border-gray-200 space-y-4">
          <div>
            <h3 className="font-bold text-sm text-[#041627]">User & Access Control Governance</h3>
            <p className="text-xs text-gray-500">
              Manage citizen and business accounts. Note: In accordance with the Single-Owner architecture, the Platform Owner is permanently designated and non-transferable.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-gray-100 text-gray-700 border-b border-gray-300">
                  <th className="p-3 font-bold">User Name</th>
                  <th className="p-3 font-bold">Contact Email / Phone</th>
                  <th className="p-3 font-bold">City</th>
                  <th className="p-3 font-bold">Role Status</th>
                  <th className="p-3 font-bold text-right">Role Management</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.map((u) => {
                  const isPermanentAdmin = u.role === 'admin' || u.id === 'user-admin-vikram';
                  return (
                    <tr key={u.id} className="hover:bg-gray-50">
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-[#041627]">{u.name}</p>
                          {isPermanentAdmin && (
                            <span className="text-[9px] bg-red-100 text-red-800 font-bold px-1.5 py-0.2 rounded border border-red-300">
                              OWNER
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-gray-400">ID: {u.id}</span>
                      </td>
                      <td className="p-3">
                        <p className="text-gray-800">{u.email}</p>
                        <p className="text-[10px] text-gray-500 font-mono">{u.phone}</p>
                      </td>
                      <td className="p-3 text-gray-700">{u.city}</td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            u.role === 'admin'
                              ? 'bg-red-100 text-red-800'
                              : u.role === 'business'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-sky-100 text-sky-800'
                          }`}
                        >
                          {u.role === 'admin' ? 'Single Platform Owner' : u.role}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        {isPermanentAdmin ? (
                          <span className="text-[11px] font-bold text-gray-400 italic">
                            Permanent Platform Owner
                          </span>
                        ) : (
                          <select
                            value={u.role}
                            onChange={(e) => onUpdateUserRole(u.id, e.target.value as UserRole)}
                            className="p-1.5 border border-gray-300 rounded text-xs bg-white focus:ring-1 focus:ring-[#041627]"
                          >
                            <option value="user">Citizen (User)</option>
                            <option value="business">Business / Service Provider</option>
                          </select>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 6: GRIEVANCE DESK */}
      {activeAdminTab === 'complaints' && (
        <div className="bg-white p-6 rounded-b-xl border border-t-0 border-gray-200 space-y-4">
          <div>
            <h3 className="font-bold text-sm text-[#041627]">Citizen Grievance & Vigilance Queue</h3>
            <p className="text-xs text-gray-500">
              Review and act upon citizen complaints regarding overcharging, delays, or emergency misbehavior.
            </p>
          </div>

          <div className="space-y-3">
            {complaints.map((ticket) => (
              <div key={ticket.id} className="p-4 rounded-xl border border-gray-200 bg-gray-50/40 space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-[#041627]">{ticket.subject}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                        ticket.status === 'resolved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : ticket.status === 'investigating'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {ticket.status}
                    </span>
                  </div>

                  <span className="text-[11px] text-gray-400">{ticket.createdAt}</span>
                </div>

                <p className="text-xs text-gray-700">{ticket.description}</p>
                <p className="text-[11px] text-gray-500">
                  Reported by: <strong>{ticket.userName}</strong> ({ticket.userPhone}) in {ticket.city}
                  {ticket.providerName && ` • Concerning: ${ticket.providerName}`}
                </p>

                {ticket.adminResponse && (
                  <div className="p-2.5 bg-blue-50/70 border border-blue-200 rounded-lg text-xs text-blue-950">
                    <strong>Admin Response:</strong> {ticket.adminResponse}
                  </div>
                )}

                <div className="flex items-center gap-2 pt-2 border-t border-gray-200/60">
                  <button
                    onClick={() => setRespondingTicket(ticket)}
                    className="px-3 py-1.5 bg-[#041627] text-white rounded-lg text-xs font-bold hover:bg-[#1a2b3c]"
                  >
                    Reply & Resolve
                  </button>
                  <button
                    onClick={() => onUpdateComplaintStatus(ticket.id, 'investigating')}
                    className="px-3 py-1.5 bg-amber-100 text-amber-900 rounded-lg text-xs font-bold hover:bg-amber-200"
                  >
                    Mark Investigating
                  </button>
                  <button
                    onClick={() => onUpdateComplaintStatus(ticket.id, 'dismissed')}
                    className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-xs font-bold hover:bg-gray-200"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 7: AUDIT TRAIL */}
      {activeAdminTab === 'audit' && (
        <div className="bg-white p-6 rounded-b-xl border border-t-0 border-gray-200 space-y-4">
          <div>
            <h3 className="font-bold text-sm text-[#041627]">System Telemetry & Audit Logs</h3>
            <p className="text-xs text-gray-500">
              Immutable trail of all admin, business, and dispatch actions for safety accountability.
            </p>
          </div>

          <div className="space-y-2">
            {auditLogs.map((log) => (
              <div key={log.id} className="p-3 rounded-lg border border-gray-200 bg-gray-50 font-mono text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <div>
                  <span className="text-[#b6171e] font-bold">[{log.action}]</span>{' '}
                  <span className="text-gray-800">{log.details}</span>
                  <span className="block text-[11px] text-gray-500 font-sans mt-0.5">By: {log.user} • Target: {log.target}</span>
                </div>
                <span className="text-[10px] text-gray-400 shrink-0">{log.timestamp}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ADD PROVIDER MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl border border-gray-300">
            <div className="p-4 bg-[#041627] text-white flex items-center justify-between">
              <h3 className="font-bold text-sm">Add New Emergency Service Provider</h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-300 hover:text-white">
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-5 space-y-3 text-xs">
              <div>
                <label className="font-bold text-gray-700 block mb-1">Provider / Business Name *</label>
                <input
                  required
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Apollo Hospital or City Towing"
                  className="w-full p-2.5 border border-gray-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Category *</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as EmergencyCategory)}
                    className="w-full p-2.5 border border-gray-300 rounded-lg bg-white"
                  >
                    <option value="medical">Medical Emergency</option>
                    <option value="police">Police & Security</option>
                    <option value="fire">Fire & Rescue</option>
                    <option value="breakdown">Vehicle Breakdown</option>
                    <option value="towing">Towing & Recovery</option>
                    <option value="fuel">EV Charging & Fuel</option>
                    <option value="pharmacy">24/7 Pharmacy</option>
                    <option value="locksmith">Locksmith</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">City *</label>
                  <select
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value)}
                    className="w-full p-2.5 border border-gray-300 rounded-lg bg-white"
                  >
                    {cities.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Emergency Hotline Phone *</label>
                  <input
                    required
                    type="text"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    placeholder="e.g. 0253-2305200"
                    className="w-full p-2.5 border border-gray-300 rounded-lg font-mono"
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Subcategory / Speciality</label>
                  <input
                    type="text"
                    value={newSubcategory}
                    onChange={(e) => setNewSubcategory(e.target.value)}
                    placeholder="e.g. Multi-Brand Garage"
                    className="w-full p-2.5 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Physical Address / Highway Landmark *</label>
                <input
                  required
                  type="text"
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                  placeholder="e.g. Opp. Bytco Point, Nashik-Pune Highway"
                  className="w-full p-2.5 border border-gray-300 rounded-lg"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="is24x7"
                  checked={newIs24x7}
                  onChange={(e) => setNewIs24x7(e.target.checked)}
                  className="rounded text-[#041627]"
                />
                <label htmlFor="is24x7" className="font-bold text-gray-700">
                  Open 24x7 Non-Stop Emergency Response
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#041627] text-white rounded-lg font-bold hover:bg-[#1a2b3c]"
                >
                  Save & Publish Provider
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD CITY MODAL */}
      {showAddCityModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl border border-gray-300">
            <div className="p-4 bg-[#041627] text-white flex items-center justify-between">
              <h3 className="font-bold text-sm">Add New Operational City / Zone</h3>
              <button onClick={() => setShowAddCityModal(false)} className="text-gray-300 hover:text-white">
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateCity} className="p-5 space-y-3 text-xs">
              <div>
                <label className="font-bold text-gray-700 block mb-1">City Name *</label>
                <input
                  required
                  type="text"
                  value={newCityName}
                  onChange={(e) => setNewCityName(e.target.value)}
                  placeholder="e.g. Kolhapur or Solapur"
                  className="w-full p-2.5 border border-gray-300 rounded-lg"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">State *</label>
                <input
                  required
                  type="text"
                  value={newCityState}
                  onChange={(e) => setNewCityState(e.target.value)}
                  placeholder="Maharashtra"
                  className="w-full p-2.5 border border-gray-300 rounded-lg"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">City Tagline</label>
                <input
                  type="text"
                  value={newCityTagline}
                  onChange={(e) => setNewCityTagline(e.target.value)}
                  placeholder="e.g. Western Maharashtra Gateway"
                  className="w-full p-2.5 border border-gray-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Police PCR</label>
                  <input
                    type="text"
                    value={newCityPolice}
                    onChange={(e) => setNewCityPolice(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Ambulance</label>
                  <input
                    type="text"
                    value={newCityAmbulance}
                    onChange={(e) => setNewCityAmbulance(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Fire</label>
                  <input
                    type="text"
                    value={newCityFire}
                    onChange={(e) => setNewCityFire(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowAddCityModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#041627] text-white rounded-lg font-bold hover:bg-[#1a2b3c]"
                >
                  Save City
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* REJECT MODAL */}
      {rejectModalProvider && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl w-full max-w-md p-5 shadow-2xl border border-gray-300 space-y-4 text-xs">
            <h3 className="font-bold text-sm text-[#041627]">
              Reject Application for {rejectModalProvider.name}
            </h3>
            <p className="text-gray-600">
              Provide feedback for the business owner explaining what needs correction.
            </p>
            <form onSubmit={handleConfirmReject} className="space-y-3">
              <textarea
                required
                rows={3}
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="e.g. Unverified phone hotline or missing municipal shop establishment certificate."
                className="w-full p-2.5 border border-gray-300 rounded-lg"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setRejectModalProvider(null)}
                  className="px-4 py-2 border border-gray-300 rounded-lg font-bold text-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-700 text-white rounded-lg font-bold hover:bg-red-800"
                >
                  Confirm Rejection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* COMPLAINT REPLY MODAL */}
      {respondingTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl w-full max-w-md p-5 shadow-2xl border border-gray-300 space-y-4 text-xs">
            <h3 className="font-bold text-sm text-[#041627]">
              Official Admin Reply to {respondingTicket.userName}
            </h3>
            <p className="text-gray-600">
              Subject: <strong>{respondingTicket.subject}</strong>
            </p>
            <form onSubmit={handleSendTicketReply} className="space-y-3">
              <textarea
                required
                rows={3}
                value={adminReplyText}
                onChange={(e) => setAdminReplyText(e.target.value)}
                placeholder="e.g. Incident verified. Provider notified and disciplinary warning issued. Case resolved."
                className="w-full p-2.5 border border-gray-300 rounded-lg"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setRespondingTicket(null)}
                  className="px-4 py-2 border border-gray-300 rounded-lg font-bold text-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-700 text-white rounded-lg font-bold hover:bg-emerald-800"
                >
                  Send & Mark Resolved
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
