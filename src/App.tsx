import React, { useState } from 'react';
import {
  ActiveScreen,
  EmergencyCategory,
  ServiceProvider,
  LocationState,
  AuditLogEntry,
  User,
  CityData,
  ComplaintTicket,
  UserRole,
} from './types';
import {
  DEFAULT_LOCATION,
  INITIAL_SERVICE_PROVIDERS,
  INITIAL_AUDIT_LOGS,
  INITIAL_USERS,
  CITIES_DATA,
  INITIAL_COMPLAINTS,
} from './data/mockData';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { BottomNav } from './components/BottomNav';
import { CallModal } from './components/modals/CallModal';
import { ShareLocationModal } from './components/modals/ShareLocationModal';
import { ManualLocationModal } from './components/modals/ManualLocationModal';
import { HomeView } from './views/HomeView';
import { CategoryListView } from './views/CategoryListView';
import { ProviderDetailView } from './views/ProviderDetailView';
import { OfficialNumbersView } from './views/OfficialNumbersView';
import { PoliceSecurityView } from './views/PoliceSecurityView';
import { OfflineModeView } from './views/OfflineModeView';
import { AdminDashboardView } from './views/AdminDashboardView';
import { AuthView } from './views/AuthView';
import { UserDashboardView } from './views/UserDashboardView';
import { BusinessPanelView } from './views/BusinessPanelView';

export function App() {
  const [activeScreen, setActiveScreen] = useState<ActiveScreen>('home');
  const [selectedCategory, setSelectedCategory] = useState<EmergencyCategory>('medical');
  const [selectedProvider, setSelectedProvider] = useState<ServiceProvider | null>(null);
  const [location, setLocation] = useState<LocationState>(DEFAULT_LOCATION);
  const [providers, setProviders] = useState<ServiceProvider[]>(INITIAL_SERVICE_PROVIDERS);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOGS);
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [cities, setCities] = useState<CityData[]>(CITIES_DATA);
  const [complaints, setComplaints] = useState<ComplaintTicket[]>(INITIAL_COMPLAINTS);
  const [currentUser, setCurrentUser] = useState<User | null>(INITIAL_USERS[0]); // Default to Citizen Aarav Sharma
  const [currentLanguage, setCurrentLanguage] = useState<'en' | 'hi' | 'mr'>('en');

  // Flash notification toast
  const [toastMessage, setToastMessage] = useState<{ title: string; type: 'success' | 'info' | 'warn' } | null>(null);

  const showToast = (title: string, type: 'success' | 'info' | 'warn' = 'success') => {
    setToastMessage({ title, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Modals state
  const [callModalData, setCallModalData] = useState<{
    isOpen: boolean;
    name: string;
    number: string;
  }>({
    isOpen: false,
    name: '',
    number: '',
  });

  const [shareModalData, setShareModalData] = useState<{
    isOpen: boolean;
    provider?: ServiceProvider;
  }>({
    isOpen: false,
    provider: undefined,
  });

  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

  // Modal Triggers
  const handleOpenCallModal = (name: string, number: string) => {
    setCallModalData({
      isOpen: true,
      name,
      number,
    });
  };

  const handleOpenShareModal = (provider?: ServiceProvider) => {
    setShareModalData({
      isOpen: true,
      provider,
    });
  };

  const handleSelectCategory = (cat: EmergencyCategory) => {
    setSelectedCategory(cat);
    setActiveScreen('category');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectProvider = (prov: ServiceProvider) => {
    setSelectedProvider(prov);
    setActiveScreen('provider-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Switch City Directly
  const handleSelectCityDirect = (city: CityData) => {
    setLocation({
      name: `${city.name}, Maharashtra`,
      city: city.name,
      address: `${city.name} Central Municipal Sector`,
      coordinates: city.coordinates,
      isGPS: false,
      statusText: `${city.tagline} • Official Emergency Zone`,
    });
    showToast(`Switched active city to ${city.name}`, 'info');
  };

  const handleUseGPSDirect = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation({
            name: 'GPS Auto-Detected • College Road, Nashik',
            city: 'Nashik',
            address: 'GPS Precision Coordinates Active',
            coordinates: { lat: pos.coords.latitude, lng: pos.coords.longitude },
            isGPS: true,
            statusText: `GPS Active ±${Math.round(pos.coords.accuracy || 15)}m Accuracy`,
          });
          showToast('GPS Location acquired accurately!', 'success');
        },
        () => {
          // Fallback simulation
          setLocation({
            name: 'Nashik GPS Anchor (Trimbak Road)',
            city: 'Nashik',
            address: 'Trimbak Road near MIDC Satpur',
            coordinates: { lat: 19.9975, lng: 73.7898 },
            isGPS: true,
            statusText: 'GPS Simulation Signal Active',
          });
          showToast('GPS active for Nashik Region', 'info');
        }
      );
    }
  };

  // Auth Handlers
  const handleLogin = (user: User) => {
    setCurrentUser(user);
    showToast(`Signed in successfully as ${user.name} (${user.role.toUpperCase()})`, 'success');

    // Intelligent role-based redirection
    if (user.role === 'admin') {
      setActiveScreen('admin-portal');
    } else if (user.role === 'business') {
      setActiveScreen('business-panel');
    } else {
      setActiveScreen('user-dashboard');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    showToast('Signed out of Help Hub', 'info');
    setActiveScreen('home');
  };

  // Provider Governance
  const handleToggleVerify = (id: string) => {
    setProviders((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const updated = !p.isVerified;
          const logEntry: AuditLogEntry = {
            id: `log-${Date.now()}`,
            timestamp: new Date().toLocaleString(),
            user: currentUser?.name || 'Platform Admin',
            action: updated ? 'VERIFY_PROVIDER' : 'UNVERIFY_PROVIDER',
            target: `${p.name} (${p.id})`,
            details: `Provider status set to ${updated ? 'Verified' : 'Unverified'}.`,
          };
          setAuditLogs((prevLogs) => [logEntry, ...prevLogs]);
          return {
            ...p,
            isVerified: updated,
            verificationStatus: updated ? 'verified' : 'unverified',
          };
        }
        return p;
      })
    );
    showToast('Provider verification status toggled', 'success');
  };

  const handleToggleActive = (id: string) => {
    setProviders((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const updated = !p.isActive;
          const logEntry: AuditLogEntry = {
            id: `log-${Date.now()}`,
            timestamp: new Date().toLocaleString(),
            user: currentUser?.name || 'Platform Admin',
            action: updated ? 'ACTIVATE_SERVICE' : 'DEACTIVATE_SERVICE',
            target: `${p.name} (${p.id})`,
            details: `Dispatch availability updated to ${updated ? 'Active 24/7' : 'Offline'}.`,
          };
          setAuditLogs((prevLogs) => [logEntry, ...prevLogs]);
          return { ...p, isActive: updated };
        }
        return p;
      })
    );
    showToast('Provider dispatch availability updated', 'info');
  };

  const handleApproveProvider = (id: string) => {
    setProviders((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          return {
            ...p,
            isVerified: true,
            verificationStatus: 'verified',
            isActive: true,
          };
        }
        return p;
      })
    );
    const prov = providers.find((p) => p.id === id);
    const logEntry: AuditLogEntry = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleString(),
      user: currentUser?.name || 'Platform Admin',
      action: 'APPROVE_REGISTRATION',
      target: `${prov?.name || id}`,
      details: 'Trade license verified and dispatched onto live network.',
    };
    setAuditLogs((prevLogs) => [logEntry, ...prevLogs]);
    showToast('Listing Approved & Published to Live Network', 'success');
  };

  const handleRejectProvider = (id: string, reason: string) => {
    setProviders((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          return {
            ...p,
            isVerified: false,
            verificationStatus: 'rejected',
            rejectionReason: reason,
          };
        }
        return p;
      })
    );
    const logEntry: AuditLogEntry = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleString(),
      user: currentUser?.name || 'Platform Admin',
      action: 'REJECT_REGISTRATION',
      target: id,
      details: `Rejection notice: ${reason}`,
    };
    setAuditLogs((prevLogs) => [logEntry, ...prevLogs]);
    showToast('Listing marked rejected with feedback notice', 'warn');
  };

  const handleAddProvider = (newProv: ServiceProvider) => {
    setProviders((prev) => [newProv, ...prev]);
    const logEntry: AuditLogEntry = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleString(),
      user: currentUser?.name || 'Platform Admin',
      action: 'CREATE_PROVIDER',
      target: `${newProv.name} (${newProv.id})`,
      details: `Added new provider in ${newProv.category} category for ${newProv.city}.`,
    };
    setAuditLogs((prevLogs) => [logEntry, ...prevLogs]);
    showToast(`Emergency Provider "${newProv.name}" created!`, 'success');
  };

  const handleUpdateProvider = (updatedProv: ServiceProvider) => {
    setProviders((prev) => prev.map((p) => (p.id === updatedProv.id ? updatedProv : p)));
    const logEntry: AuditLogEntry = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleString(),
      user: currentUser?.name || 'Business Owner',
      action: 'UPDATE_PROVIDER_PROFILE',
      target: updatedProv.name,
      details: 'Operating hours, capacity or services updated.',
    };
    setAuditLogs((prevLogs) => [logEntry, ...prevLogs]);
    showToast('Business profile and service status updated successfully', 'success');
  };

  const handleDeleteProvider = (id: string) => {
    const prov = providers.find((p) => p.id === id);
    setProviders((prev) => prev.filter((p) => p.id !== id));
    const logEntry: AuditLogEntry = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleString(),
      user: currentUser?.name || 'Platform Admin',
      action: 'DELETE_PROVIDER',
      target: `${prov?.name || id}`,
      details: 'Listing removed from the emergency registry.',
    };
    setAuditLogs((prevLogs) => [logEntry, ...prevLogs]);
    showToast('Provider listing deleted', 'info');
  };

  const handleUpdateUser = (updatedUser: User) => {
    setUsers((prev) => prev.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
    if (currentUser?.id === updatedUser.id) {
      setCurrentUser(updatedUser);
    }
    showToast('ICE Medical Profile and Emergency Contacts Saved', 'success');
  };

  const handleUpdateUserRole = (userId: string, newRole: UserRole) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          return { ...u, role: newRole };
        }
        return u;
      })
    );
    if (currentUser?.id === userId) {
      setCurrentUser({ ...currentUser, role: newRole });
    }
    const logEntry: AuditLogEntry = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleString(),
      user: currentUser?.name || 'Platform Admin',
      action: 'UPDATE_USER_ROLE',
      target: userId,
      details: `Role reassigned to ${newRole.toUpperCase()}.`,
    };
    setAuditLogs((prevLogs) => [logEntry, ...prevLogs]);
    showToast(`User role updated to ${newRole.toUpperCase()}`, 'info');
  };

  const handleAddComplaint = (complaint: ComplaintTicket) => {
    setComplaints((prev) => [complaint, ...prev]);
    const logEntry: AuditLogEntry = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleString(),
      user: currentUser?.name || 'Citizen',
      action: 'FILE_COMPLAINT',
      target: complaint.providerName || complaint.subject,
      details: `Ticket #${complaint.id}: ${complaint.subject}`,
    };
    setAuditLogs((prevLogs) => [logEntry, ...prevLogs]);
    showToast('Grievance filed with Help Hub Vigilance Desk (#TK-' + complaint.id.slice(-4) + ')', 'success');
  };

  const handleUpdateComplaintStatus = (
    ticketId: string,
    status: ComplaintTicket['status'],
    response?: string
  ) => {
    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id === ticketId) {
          return {
            ...c,
            status,
            adminResponse: response || c.adminResponse,
          };
        }
        return c;
      })
    );
    const logEntry: AuditLogEntry = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleString(),
      user: currentUser?.name || 'Platform Admin',
      action: 'RESOLVE_COMPLAINT',
      target: ticketId,
      details: `Status set to ${status}. Response: ${response || 'None'}`,
    };
    setAuditLogs((prevLogs) => [logEntry, ...prevLogs]);
    showToast(`Complaint #${ticketId.slice(-4)} updated to ${status.toUpperCase()}`, 'success');
  };

  const handleAddCity = (newCity: CityData) => {
    setCities((prev) => [...prev, newCity]);
    const logEntry: AuditLogEntry = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleString(),
      user: currentUser?.name || 'Platform Admin',
      action: 'ADD_CITY_ZONE',
      target: newCity.name,
      details: `Configured municipal hotlines: Police ${newCity.emergencyHotlines.police}, Ambulance ${newCity.emergencyHotlines.ambulance}`,
    };
    setAuditLogs((prevLogs) => [logEntry, ...prevLogs]);
    showToast(`City "${newCity.name}" added to active coverage!`, 'success');
  };

  const handleToggleCityActive = (cityId: string) => {
    setCities((prev) =>
      prev.map((c) => (c.id === cityId ? { ...c, isActive: !c.isActive } : c))
    );
    showToast('City active state toggled', 'info');
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-[#191c1d] flex flex-col font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-2xl shadow-xl border flex items-center gap-3 text-xs font-bold animate-in fade-in slide-in-from-top-3 duration-200 ${
            toastMessage.type === 'warn'
              ? 'bg-amber-900 text-amber-100 border-amber-700'
              : toastMessage.type === 'info'
              ? 'bg-[#041627] text-white border-gray-700'
              : 'bg-emerald-900 text-emerald-100 border-emerald-700'
          }`}
        >
          <span className="material-symbols-outlined text-base">
            {toastMessage.type === 'warn' ? 'warning' : toastMessage.type === 'info' ? 'info' : 'check_circle'}
          </span>
          <span>{toastMessage.title}</span>
        </div>
      )}

      {/* Top Fixed Navigation */}
      <Navbar
        activeScreen={activeScreen}
        setActiveScreen={setActiveScreen}
        location={location}
        onOpenLocationModal={() => setIsLocationModalOpen(true)}
        onOpenCallModal={handleOpenCallModal}
        currentLanguage={currentLanguage}
        setCurrentLanguage={setCurrentLanguage}
        currentUser={currentUser}
        onLogout={handleLogout}
        cities={cities}
        onSelectCityDirect={handleSelectCityDirect}
      />

      {/* Main Layout Body: Sidebar + Dynamic Main Content */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Left Sidebar on desktop */}
        <Sidebar
          activeScreen={activeScreen}
          setActiveScreen={setActiveScreen}
          location={location}
          onOpenLocationModal={() => setIsLocationModalOpen(true)}
          currentUser={currentUser}
          onLogout={handleLogout}
        />

        {/* Dynamic Main Workspace Screen */}
        <main className="flex-1 p-4 md:p-8 flex flex-col overflow-y-auto pb-24 md:pb-8">
          {activeScreen === 'home' && (
            <HomeView
              location={location}
              onSelectCategory={handleSelectCategory}
              onOpenLocationModal={() => setIsLocationModalOpen(true)}
              onOpenCallModal={handleOpenCallModal}
              onSelectCityDirect={handleSelectCityDirect}
              onUseGPSDirect={handleUseGPSDirect}
              currentLanguage={currentLanguage}
              providers={providers}
              cities={cities}
              currentUser={currentUser}
              onNavigateScreen={(s) => setActiveScreen(s)}
            />
          )}

          {activeScreen === 'category' && (
            <CategoryListView
              category={selectedCategory}
              providers={providers}
              location={location}
              onSelectProvider={handleSelectProvider}
              onBack={() => setActiveScreen('home')}
              onOpenCallModal={handleOpenCallModal}
              onOpenShareModal={() => handleOpenShareModal()}
              onOpenLocationModal={() => setIsLocationModalOpen(true)}
            />
          )}

          {activeScreen === 'provider-detail' && selectedProvider && (
            <ProviderDetailView
              provider={selectedProvider}
              location={location}
              onBack={() => setActiveScreen('category')}
              onOpenCallModal={handleOpenCallModal}
              onOpenShareModal={(p) => handleOpenShareModal(p)}
            />
          )}

          {activeScreen === 'auth' && (
            <AuthView
              onLogin={handleLogin}
              onBackToHome={() => setActiveScreen('home')}
            />
          )}

          {activeScreen === 'user-dashboard' && (
            <UserDashboardView
              currentUser={currentUser}
              providers={providers}
              complaints={complaints}
              onUpdateUser={handleUpdateUser}
              onFileComplaint={handleAddComplaint}
              onOpenCallModal={handleOpenCallModal}
              onQuickLoginAsUser={() => handleLogin(INITIAL_USERS[0])}
            />
          )}

          {activeScreen === 'business-panel' && (
            <BusinessPanelView
              currentUser={currentUser}
              providers={providers}
              onUpdateProvider={handleUpdateProvider}
              onAddProvider={handleAddProvider}
              onQuickLoginAsBusiness={() => handleLogin(INITIAL_USERS[1])}
            />
          )}

          {activeScreen === 'admin-portal' && (
            <AdminDashboardView
              currentUser={currentUser}
              providers={providers}
              auditLogs={auditLogs}
              users={users}
              cities={cities}
              complaints={complaints}
              onToggleVerify={handleToggleVerify}
              onToggleActive={handleToggleActive}
              onApproveProvider={handleApproveProvider}
              onRejectProvider={handleRejectProvider}
              onAddProvider={handleAddProvider}
              onDeleteProvider={handleDeleteProvider}
              onUpdateUserRole={handleUpdateUserRole}
              onUpdateComplaintStatus={handleUpdateComplaintStatus}
              onAddCity={handleAddCity}
              onToggleCityActive={handleToggleCityActive}
              onQuickLoginAsAdmin={() => handleLogin(INITIAL_USERS[2])}
              onNavigateToUserDashboard={() => setActiveScreen('user-dashboard')}
              onNavigateToBusinessPanel={() => setActiveScreen('business-panel')}
              onNavigateToHome={() => setActiveScreen('home')}
              onNavigateToAuth={() => setActiveScreen('auth')}
            />
          )}

          {activeScreen === 'official-numbers' && (
            <OfficialNumbersView onOpenCallModal={handleOpenCallModal} />
          )}

          {activeScreen === 'police-security' && (
            <PoliceSecurityView
              location={location}
              providers={providers}
              onOpenCallModal={handleOpenCallModal}
              onOpenShareModal={() => handleOpenShareModal()}
            />
          )}

          {activeScreen === 'offline-mode' && (
            <OfflineModeView
              location={location}
              onOpenCallModal={handleOpenCallModal}
              onOpenShareModal={() => handleOpenShareModal()}
            />
          )}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <BottomNav
        activeScreen={activeScreen}
        setActiveScreen={setActiveScreen}
        onOpenLocationModal={() => setIsLocationModalOpen(true)}
        onOpenCallModal={handleOpenCallModal}
      />

      {/* Global Interactive Modals */}
      <CallModal
        isOpen={callModalData.isOpen}
        onClose={() => setCallModalData({ ...callModalData, isOpen: false })}
        targetName={callModalData.name}
        targetNumber={callModalData.number}
        location={location}
      />

      <ShareLocationModal
        isOpen={shareModalData.isOpen}
        onClose={() => setShareModalData({ ...shareModalData, isOpen: false })}
        location={location}
        selectedProvider={shareModalData.provider}
      />

      <ManualLocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        currentLocation={location}
        onUpdateLocation={(newLoc) => {
          setLocation(newLoc);
          showToast(`Location set to ${newLoc.name}`, 'info');
        }}
      />
    </div>
  );
}

export default App;
