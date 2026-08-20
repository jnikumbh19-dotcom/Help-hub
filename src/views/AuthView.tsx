import React, { useState } from 'react';
import { User, UserRole, CityData } from '../types';
import { INITIAL_USERS, CITIES_DATA } from '../data/mockData';

interface AuthViewProps {
  currentUser?: User | null;
  onLogin: (user: User) => void;
  onLogout?: () => void;
  onClose?: () => void;
  onBackToHome?: () => void;
  initialMode?: 'signin' | 'signup' | 'forgot';
  cities?: CityData[];
}

export const AuthView: React.FC<AuthViewProps> = ({
  currentUser,
  onLogin,
  onLogout,
  onClose,
  onBackToHome,
  initialMode = 'signin',
  cities = CITIES_DATA,
}) => {
  const [authMode, setAuthMode] = useState<'signin' | 'signup' | 'forgot'>(initialMode);
  // For signup, selectedRole can only be 'user' or 'business'
  const [selectedRole, setSelectedRole] = useState<UserRole>('user');

  // Sign In state
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Sign Up state (strictly User or Business)
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [city, setCity] = useState(cities[0]?.name || 'Nashik');
  // Business fields
  const [businessName, setBusinessName] = useState('');
  const [businessCategory, setBusinessCategory] = useState('breakdown');
  // Citizen ICE fields
  const [iceName, setIceName] = useState('');
  const [icePhone, setIcePhone] = useState('');

  // Forgot password
  const [forgotEmail, setForgotEmail] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [enteredOtp, setEnteredOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleQuickDemoLogin = (role: UserRole) => {
    let targetUser: User | undefined;
    if (role === 'admin') {
      targetUser = INITIAL_USERS.find((u) => u.role === 'admin');
    } else if (role === 'business') {
      targetUser = INITIAL_USERS.find((u) => u.role === 'business');
    } else {
      targetUser = INITIAL_USERS.find((u) => u.role === 'user');
    }

    if (targetUser) {
      onLogin(targetUser);
      setSuccessMessage(`Signed in as ${targetUser.name} (${targetUser.role === 'admin' ? 'Single Platform Owner' : targetUser.role.toUpperCase()})`);
      if (onClose) setTimeout(onClose, 600);
    }
  };

  const handleSignInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const emailTrim = signInEmail.trim().toLowerCase();

    // STRICT CHECK: Admin role is strictly restricted to the predefined platform owner
    if (selectedRole === 'admin') {
      const adminUser = INITIAL_USERS.find((u) => u.role === 'admin');
      if (
        adminUser &&
        (emailTrim === adminUser.email.toLowerCase() ||
          emailTrim === 'admin' ||
          emailTrim === 'admin@helphub.org')
      ) {
        onLogin(adminUser);
        setSuccessMessage(`Authenticated as Platform Owner: ${adminUser.name}`);
        if (onClose) setTimeout(onClose, 600);
        return;
      } else {
        setErrorMessage(
          'Access Denied: Main Admin Portal is strictly restricted to the predefined Platform Owner (admin@helphub.org).'
        );
        return;
      }
    }

    const matched = INITIAL_USERS.find(
      (u) =>
        (u.email.toLowerCase() === emailTrim || u.phone.includes(emailTrim)) &&
        u.role === selectedRole
    );

    if (matched) {
      onLogin(matched);
      setSuccessMessage(`Welcome back, ${matched.name}!`);
      if (onClose) setTimeout(onClose, 600);
    } else {
      // Dynamic login for citizen / business
      const customUser: User = {
        id: `user-${Date.now()}`,
        name: emailTrim.split('@')[0] || (selectedRole === 'business' ? 'Service Partner' : 'Citizen User'),
        email: emailTrim.includes('@') ? emailTrim : `${emailTrim}@helphub.org`,
        phone: '+91 98220 00000',
        role: selectedRole === 'admin' ? 'user' : selectedRole, // safety guard
        city: 'Nashik',
        savedProviderIds: [],
        createdAt: new Date().toISOString(),
        isActive: true,
        businessId: selectedRole === 'business' ? 'prov-nsk-garage-1' : undefined,
      };
      onLogin(customUser);
      setSuccessMessage(`Signed in as ${customUser.name}`);
      if (onClose) setTimeout(onClose, 600);
    }
  };

  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Guard: Prevent any admin creation via signup
    if (selectedRole === 'admin') {
      setErrorMessage('Public admin registration is strictly disabled. Only the platform owner has administrative access.');
      return;
    }

    if (!name.trim() || !email.trim() || !phone.trim()) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      role: selectedRole === 'business' ? 'business' : 'user',
      city,
      emergencyProfile:
        selectedRole === 'user'
          ? {
              iceContactName: iceName.trim() || 'Emergency Contact',
              iceContactPhone: icePhone.trim() || phone.trim(),
            }
          : undefined,
      businessId: selectedRole === 'business' ? `prov-new-${Date.now()}` : undefined,
      savedProviderIds: [],
      createdAt: new Date().toISOString(),
      isActive: true,
    };

    onLogin(newUser);
    setSuccessMessage(`Account created successfully as ${newUser.role.toUpperCase()}! Welcome to HELP HUB.`);
    if (onClose) setTimeout(onClose, 800);
  };

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim()) return;
    setOtpSent(true);
    setSuccessMessage(`6-digit reset code sent to ${forgotEmail}. (Demo OTP: 123456)`);
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (enteredOtp !== '123456' && enteredOtp.length < 4) {
      setErrorMessage('Please enter the demo OTP (123456).');
      return;
    }
    setSuccessMessage('Password updated successfully! You can now sign in.');
    setTimeout(() => {
      setAuthMode('signin');
      setOtpSent(false);
      setErrorMessage(null);
    }, 1200);
  };

  return (
    <div className="flex flex-col flex-1 max-w-2xl mx-auto w-full pb-16 space-y-6 animate-in fade-in">
      {/* Brand Header */}
      <div className="text-center space-y-2 pt-2">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#041627] text-white shadow-md mb-1">
          <span className="material-symbols-outlined text-[#b6171e] text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
            shield_lock
          </span>
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-[#041627] tracking-tight">
          HELP HUB Authentication
        </h1>
        <p className="text-xs md:text-sm text-[#44474c]">
          Secure role-based portal for Citizens, Service Providers, and Platform Owner
        </p>
      </div>

      {/* Quick Demo Switcher Card */}
      <div className="bg-gradient-to-r from-gray-900 to-[#041627] text-white rounded-2xl p-5 shadow-md space-y-3 border border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-amber-400 text-lg">bolt</span>
            <span className="text-xs font-bold uppercase tracking-wider text-gray-200">
              One-Click Demo Account Login
            </span>
          </div>
          <span className="text-[10px] text-gray-400 bg-white/10 px-2 py-0.5 rounded">Instant Preview</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <button
            onClick={() => handleQuickDemoLogin('user')}
            className="p-3 rounded-xl bg-white/10 hover:bg-white/20 text-left transition-all active:scale-95 border border-white/15 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-xs text-white">Rahul Sharma</span>
              <span className="material-symbols-outlined text-sky-400 text-base">person</span>
            </div>
            <span className="text-[10px] text-sky-300 font-semibold uppercase">Citizen (User)</span>
            <span className="text-[10px] text-gray-400 mt-0.5">Nashik • Saved Services</span>
          </button>

          <button
            onClick={() => handleQuickDemoLogin('business')}
            className="p-3 rounded-xl bg-white/10 hover:bg-white/20 text-left transition-all active:scale-95 border border-white/15 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-xs text-white">Ramesh Patil</span>
              <span className="material-symbols-outlined text-amber-400 text-base">storefront</span>
            </div>
            <span className="text-[10px] text-amber-300 font-semibold uppercase">Garage Owner</span>
            <span className="text-[10px] text-gray-400 mt-0.5">Nashik Express Garage</span>
          </button>

          <button
            onClick={() => handleQuickDemoLogin('admin')}
            className="p-3 rounded-xl bg-white/10 hover:bg-white/20 text-left transition-all active:scale-95 border border-red-500/40 bg-red-950/20 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-xs text-white">Dr. Vikram Adhikari</span>
              <span className="material-symbols-outlined text-red-400 text-base">admin_panel_settings</span>
            </div>
            <span className="text-[10px] text-red-300 font-semibold uppercase">Single Platform Owner</span>
            <span className="text-[10px] text-gray-400 mt-0.5">Main Admin Portal</span>
          </button>
        </div>
      </div>

      {/* Main Auth Container */}
      <div className="bg-white rounded-2xl p-6 border border-[#c4c6cd] shadow-xs space-y-5">
        {/* Mode Tabs (Sign In / Sign Up / Forgot) */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => {
              setAuthMode('signin');
              setErrorMessage(null);
            }}
            className={`flex-1 py-3 text-xs md:text-sm font-bold text-center border-b-2 transition-all ${
              authMode === 'signin'
                ? 'border-[#b6171e] text-[#b6171e]'
                : 'border-transparent text-gray-500 hover:text-[#041627]'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => {
              setAuthMode('signup');
              // Automatically switch away from 'admin' role if in signup mode
              if (selectedRole === 'admin') setSelectedRole('user');
              setErrorMessage(null);
            }}
            className={`flex-1 py-3 text-xs md:text-sm font-bold text-center border-b-2 transition-all ${
              authMode === 'signup'
                ? 'border-[#b6171e] text-[#b6171e]'
                : 'border-transparent text-gray-500 hover:text-[#041627]'
            }`}
          >
            Create Account (Sign Up)
          </button>
          <button
            onClick={() => {
              setAuthMode('forgot');
              setErrorMessage(null);
            }}
            className={`flex-1 py-3 text-xs md:text-sm font-bold text-center border-b-2 transition-all ${
              authMode === 'forgot'
                ? 'border-[#b6171e] text-[#b6171e]'
                : 'border-transparent text-gray-500 hover:text-[#041627]'
            }`}
          >
            Forgot Password
          </button>
        </div>

        {/* Role Selector */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold text-[#041627] uppercase tracking-wider">
              {authMode === 'signup' ? 'Select Account Type to Register' : 'Select Portal Access Role'}
            </label>
            {authMode === 'signup' && (
              <span className="text-[10px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded font-medium">
                Admin registration restricted to platform owner
              </span>
            )}
          </div>

          {/* In SIGN UP mode, ONLY show User and Business. In SIGN IN mode, show all 3 */}
          {authMode === 'signup' ? (
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setSelectedRole('user')}
                className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  selectedRole === 'user'
                    ? 'border-[#041627] bg-[#041627] text-white shadow-xs'
                    : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                <span className="material-symbols-outlined text-base">person</span>
                <span>Citizen / User</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedRole('business')}
                className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  selectedRole === 'business'
                    ? 'border-[#041627] bg-[#041627] text-white shadow-xs'
                    : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                <span className="material-symbols-outlined text-base">storefront</span>
                <span>Business / Service Provider</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setSelectedRole('user')}
                className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  selectedRole === 'user'
                    ? 'border-[#041627] bg-[#041627] text-white shadow-xs'
                    : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                <span className="material-symbols-outlined text-base">person</span>
                <span>Citizen</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedRole('business')}
                className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  selectedRole === 'business'
                    ? 'border-[#041627] bg-[#041627] text-white shadow-xs'
                    : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                <span className="material-symbols-outlined text-base">storefront</span>
                <span>Business</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedRole('admin')}
                className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  selectedRole === 'admin'
                    ? 'border-[#b6171e] bg-[#b6171e] text-white shadow-xs'
                    : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                <span className="material-symbols-outlined text-base">security</span>
                <span>Main Admin</span>
              </button>
            </div>
          )}
        </div>

        {/* Alert Notifications */}
        {errorMessage && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
            <span className="material-symbols-outlined text-sm shrink-0">error</span>
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
            <span className="material-symbols-outlined text-sm shrink-0">check_circle</span>
            <span>{successMessage}</span>
          </div>
        )}

        {/* SIGN IN FORM */}
        {authMode === 'signin' && (
          <form onSubmit={handleSignInSubmit} className="space-y-4 text-xs">
            {selectedRole === 'admin' && (
              <div className="p-3 bg-red-50/70 border border-red-200 rounded-xl text-xs text-red-950 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-red-900">
                  <span className="material-symbols-outlined text-base text-red-700">admin_panel_settings</span>
                  <span>Single Platform Owner Authentication</span>
                </div>
                <p className="text-[11px] text-gray-600">
                  Enter the credentials for the dedicated HELP HUB Platform Owner (<code>admin@helphub.org</code>).
                </p>
              </div>
            )}

            <div>
              <label className="font-bold text-gray-700 block mb-1">
                {selectedRole === 'admin'
                  ? 'Platform Owner Admin Email'
                  : 'Email Address or Registered Mobile Number'}
              </label>
              <div className="relative">
                <input
                  required
                  type="text"
                  value={signInEmail}
                  onChange={(e) => setSignInEmail(e.target.value)}
                  placeholder={
                    selectedRole === 'admin'
                      ? 'admin@helphub.org'
                      : selectedRole === 'business'
                      ? 'business@helphub.org or 9822019283'
                      : 'user@helphub.org or 9822012345'
                  }
                  className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#041627] focus:outline-none"
                />
                <span className="material-symbols-outlined absolute left-3 top-2.5 text-gray-400 text-base">
                  account_circle
                </span>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="font-bold text-gray-700">Password</label>
                <button
                  type="button"
                  onClick={() => setAuthMode('forgot')}
                  className="text-sky-700 hover:underline font-semibold"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <input
                  required
                  type={showPassword ? 'text' : 'password'}
                  value={signInPassword}
                  onChange={(e) => setSignInPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-9 pr-10 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#041627] focus:outline-none"
                />
                <span className="material-symbols-outlined absolute left-3 top-2.5 text-gray-400 text-base">
                  lock
                </span>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                >
                  <span className="material-symbols-outlined text-base">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded text-[#041627]" />
                <span className="text-gray-600">Remember this device</span>
              </label>

              <span className="text-gray-400">
                Logging in as:{' '}
                <strong className="text-[#041627] uppercase">
                  {selectedRole === 'admin' ? 'Single Platform Owner' : selectedRole}
                </strong>
              </span>
            </div>

            <button
              type="submit"
              className={`w-full py-3 px-4 text-white rounded-xl font-bold text-xs md:text-sm flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all ${
                selectedRole === 'admin'
                  ? 'bg-[#b6171e] hover:bg-[#930010]'
                  : 'bg-[#041627] hover:bg-[#1a2b3c]'
              }`}
            >
              <span className="material-symbols-outlined text-base">login</span>
              <span>
                Sign In to{' '}
                {selectedRole === 'admin'
                  ? 'Main Admin Portal'
                  : selectedRole === 'business'
                  ? 'Business Portal'
                  : 'HELP HUB'}
              </span>
            </button>
          </form>
        )}

        {/* SIGN UP FORM (Strictly Citizen or Business) */}
        {authMode === 'signup' && (
          <form onSubmit={handleSignUpSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-gray-700 block mb-1">
                  {selectedRole === 'business' ? 'Owner / Manager Full Name' : 'Full Name'} *
                </label>
                <input
                  required
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ramesh Patil"
                  className="w-full p-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#041627] focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">City / Region *</label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full p-2.5 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-[#041627] focus:outline-none"
                >
                  {cities.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}, {c.state}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-gray-700 block mb-1">Email Address *</label>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full p-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#041627] focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Mobile Hotline (10 Digits) *</label>
                <input
                  required
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98220 XXXXX"
                  className="w-full p-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#041627] focus:outline-none"
                />
              </div>
            </div>

            {/* Role-Specific Fields */}
            {selectedRole === 'business' && (
              <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl space-y-3">
                <h3 className="font-bold text-[#041627] flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-amber-700 text-sm">store</span>
                  Business / Service Details (Submitted for Admin Verification)
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-gray-700 block mb-1">Shop / Agency Name *</label>
                    <input
                      required
                      type="text"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      placeholder="e.g. Nashik 24x7 Express Garage"
                      className="w-full p-2 border border-gray-300 rounded-lg bg-white"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-gray-700 block mb-1">Category *</label>
                    <select
                      value={businessCategory}
                      onChange={(e) => setBusinessCategory(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg bg-white"
                    >
                      <option value="breakdown">Vehicle Breakdown / Mechanic</option>
                      <option value="towing">Towing & Recovery</option>
                      <option value="pharmacy">24/7 Pharmacy / Oxygen</option>
                      <option value="fuel">EV Charging / CNG / Fuel</option>
                      <option value="locksmith">Locksmith / Keymaker</option>
                      <option value="medical">Ambulance / Clinic</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {selectedRole === 'user' && (
              <div className="p-4 bg-sky-50/70 border border-sky-200 rounded-xl space-y-3">
                <h3 className="font-bold text-sky-950 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sky-700 text-sm">contact_emergency</span>
                  Emergency (ICE) Contact (Optional)
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-gray-700 block mb-1">Emergency Contact Name</label>
                    <input
                      type="text"
                      value={iceName}
                      onChange={(e) => setIceName(e.target.value)}
                      placeholder="e.g. Pooja Sharma (Spouse)"
                      className="w-full p-2 border border-gray-300 rounded-lg bg-white"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-gray-700 block mb-1">Emergency Contact Phone</label>
                    <input
                      type="tel"
                      value={icePhone}
                      onChange={(e) => setIcePhone(e.target.value)}
                      placeholder="+91 98220 XXXXX"
                      className="w-full p-2 border border-gray-300 rounded-lg bg-white"
                    />
                  </div>
                </div>
              </div>
            )}

            <div>
              <label className="font-bold text-gray-700 block mb-1">Create Password *</label>
              <input
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                className="w-full p-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#041627] focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-[#b6171e] hover:bg-[#930010] text-white rounded-xl font-bold text-xs md:text-sm flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-base">person_add</span>
              <span>Register as {selectedRole === 'business' ? 'Service Provider' : 'Citizen'}</span>
            </button>
          </form>
        )}

        {/* FORGOT PASSWORD */}
        {authMode === 'forgot' && (
          <div className="space-y-4 text-xs">
            {!otpSent ? (
              <form onSubmit={handleSendOtp} className="space-y-3">
                <p className="text-gray-600">
                  Enter your registered email address or mobile number to receive a one-time reset code.
                </p>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Email or Mobile</label>
                  <input
                    required
                    type="text"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="user@helphub.org"
                    className="w-full p-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#041627]"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 bg-[#041627] hover:bg-[#1a2b3c] text-white rounded-xl font-bold"
                >
                  Send OTP Code
                </button>
              </form>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Enter 6-Digit OTP (Demo: 123456)</label>
                  <input
                    required
                    type="text"
                    value={enteredOtp}
                    onChange={(e) => setEnteredOtp(e.target.value)}
                    placeholder="123456"
                    className="w-full p-2.5 border border-gray-300 rounded-xl font-mono text-center text-base tracking-widest"
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Set New Password</label>
                  <input
                    required
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new strong password"
                    className="w-full p-2.5 border border-gray-300 rounded-xl"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 bg-[#b6171e] hover:bg-[#930010] text-white rounded-xl font-bold"
                >
                  Save New Password & Log In
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

