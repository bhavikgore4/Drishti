import React, { useState } from 'react';
import { Save, ArrowLeft, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import { EmblemAndTopBar } from './EmblemAndTopBar';
import { Navbar } from './Navbar';
import { CaptchaBox } from './CaptchaBox';
import { LanguageCode, PageRoute } from '../types';
import { AuthUser, registerCitizen } from '../api/auth';

interface RegistrationPageProps {
  currentLang: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
  onNavigate: (route: PageRoute) => void;
  onRegisterSuccess?: (user: AuthUser) => void;
}

const INDIAN_STATES_DISTRICTS: Record<string, string[]> = {
  Maharashtra: ['Mumbai', 'Pune', 'Nagpur', 'Thane', 'Nashik', 'Aurangabad', 'Solapur', 'Kolhapur'],
  Delhi: ['Central Delhi', 'East Delhi', 'New Delhi', 'North Delhi', 'South Delhi', 'West Delhi'],
  Karnataka: ['Bengaluru Urban', 'Mysuru', 'Hubballi-Dharwad', 'Mangaluru', 'Belagavi', 'Kalaburagi'],
  'Uttar Pradesh': ['Lucknow', 'Kanpur', 'Varanasi', 'Prayagraj', 'Agra', 'Noida', 'Ghaziabad', 'Gorakhpur'],
  Gujarat: ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar', 'Gandhinagar'],
  'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem', 'Tirunelveli'],
  'West Bengal': ['Kolkata', 'Howrah', 'North 24 Parganas', 'South 24 Parganas', 'Darjeeling', 'Siliguri'],
  Rajasthan: ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota', 'Bikaner', 'Ajmer'],
  Bihar: ['Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur', 'Darbhanga', 'Purnia'],
  'Madhya Pradesh': ['Bhopal', 'Indore', 'Gwalior', 'Jabalpur', 'Ujjain', 'Sagar'],
  Assam: ['Guwahati (Kamrup)', 'Dibrugarh', 'Silchar', 'Jorhat', 'Nagaon'],
  Kerala: ['Thiruvananthapuram', 'Kochi (Ernakulam)', 'Kozhikode', 'Thrissur', 'Kollam'],
  Punjab: ['Amritsar', 'Ludhiana', 'Jalandhar', 'Patiala', 'Bathinda'],
  Odisha: ['Bhubaneswar (Khurda)', 'Cuttack', 'Rourkela (Sundargarh)', 'Puri', 'Balasore'],
};

export const RegistrationPage: React.FC<RegistrationPageProps> = ({
  currentLang,
  onLanguageChange,
  onNavigate,
  onRegisterSuccess,
}) => {
  // Form Field States (Matching Image 2 exact fields)
  const [formData, setFormData] = useState({
    name: '',
    gender: 'Male',
    premiseAddress: '',
    subLocality: '',
    locality: '',
    country: 'India',
    state: '',
    district: '',
    pincode: '',
    mobileNumber: '',
    phoneNumber: '',
    email: '',
    password: '',
    securityCode: '',
  });

  const [captchaValue, setCaptchaValue] = useState('hGsffJ');
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const refreshCaptcha = () => {
    const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz';
    let res = '';
    for (let i = 0; i < 6; i++) {
      res += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaValue(res);
    setFormData((prev) => ({ ...prev, securityCode: '' }));
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errorMessage) setErrorMessage(null);
  };

  const handleStateChange = (stateName: string) => {
    setFormData((prev) => ({
      ...prev,
      state: stateName,
      district: '', // Reset district when state changes
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mark mandatory fields as touched
    const requiredFields = ['name', 'premiseAddress', 'state', 'pincode', 'mobileNumber', 'email', 'password', 'securityCode'];
    const newTouched: Record<string, boolean> = {};
    requiredFields.forEach((f) => {
      newTouched[f] = true;
    });
    setTouched(newTouched);

    // Validation
    if (
      !formData.name.trim() ||
      !formData.premiseAddress.trim() ||
      !formData.state ||
      !formData.pincode.trim() ||
      !formData.mobileNumber.trim() ||
      !formData.email.trim() ||
      formData.password.length < 6 ||
      !formData.securityCode.trim()
    ) {
      setErrorMessage('Please fill in all mandatory fields marked with an asterisk (*).');
      return;
    }

    if (formData.securityCode.trim().toLowerCase() !== captchaValue.toLowerCase()) {
      setErrorMessage('Invalid Security Code. Please verify and enter the characters accurately.');
      refreshCaptcha();
      return;
    }

    setIsSubmitted(true);
    try {
      const user = await registerCitizen({
        name: formData.name, email: formData.email, mobile: formData.mobileNumber, password: formData.password,
        gender: formData.gender, country: formData.country, state: formData.state, district: formData.district || null,
        pincode: formData.pincode, address: [formData.premiseAddress, formData.subLocality, formData.locality].filter(Boolean).join(', '),
      });
      setSuccessToast('Registration successful! Opening your Drishti dashboard...');
      onRegisterSuccess?.(user);
      if (!onRegisterSuccess) onNavigate('login');
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Registration could not be completed.');
      refreshCaptcha();
    } finally {
      setIsSubmitted(false);
    }
  };

  const availableDistricts = formData.state ? INDIAN_STATES_DISTRICTS[formData.state] || [] : [];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans select-none text-gray-900">
      
      {/* 1. Official Government Header (Top Bar & Secondary Nav as shown in Image 2) */}
      <EmblemAndTopBar
        currentLang={currentLang}
        onLogoClick={() => onNavigate('landing')}
        onQuickLinkClick={(key) => {
          if (key === 'home') onNavigate('landing');
          else if (key === 'contact') onNavigate('login');
          else onNavigate('landing');
        }}
      />

      <Navbar
        currentLang={currentLang}
        onLanguageChange={onLanguageChange}
        onSignInClick={() => onNavigate('login')}
        onNavAction={(key) => {
          if (key === 'open_status_lookup' || key === 'view_status') onNavigate('landing');
          else if (key === 'open_lodge_flow' || key === 'lodge_grievance') onNavigate('login');
        }}
      />

      {/* 2. Breadcrumb Title Strip (Exact Image 2 banner) */}
      <div className="w-full bg-[#EAE8E8] border-b border-gray-300 py-1.5 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-gray-800">
            <button
              onClick={() => onNavigate('login')}
              className="text-gray-500 hover:text-[#6B0C36] flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft size={14} />
              <span>Back to Login</span>
            </button>
            <span className="text-gray-400">|</span>
            <span className="font-bold text-gray-900 font-sans">Registration/Sign up Form</span>
          </div>

          <div className="text-[11px] text-gray-500 hidden sm:block">
            Project Drishti / CPGRAMS Citizen Registration
          </div>
        </div>
      </div>

      {/* 3. Main Form Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {/* Toast Alert Notification */}
        {successToast && (
          <div className="fixed top-24 right-6 z-50 bg-[#002B49] text-white px-4 py-3 rounded-lg shadow-2xl border border-amber-400 flex items-center gap-2.5 animate-in slide-in-from-top-3 duration-200 text-xs sm:text-sm">
            <Sparkles size={16} className="text-amber-400 shrink-0" />
            <span>{successToast}</span>
          </div>
        )}

        <div className="bg-white rounded-md border border-gray-300 shadow-sm p-6 sm:p-8">
          
          {/* Form Header Notices (Image 2 exact red titles) */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 mb-6 border-b border-gray-200 gap-2">
            <h2 className="text-base sm:text-lg font-bold text-[#8B1A4B]">
              Enter Details
            </h2>
            <span className="text-xs sm:text-sm font-bold text-[#8B1A4B]">
              Fields marked with * are mandatory
            </span>
          </div>

          {errorMessage && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-xs flex items-center gap-2">
              <AlertCircle size={16} className="shrink-0 text-red-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* 2-Column Grid Layout matching Image 2 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
              
              {/* ============================================================= */}
              {/* LEFT COLUMN */}
              {/* ============================================================= */}
              <div className="space-y-4">
                
                {/* Name * */}
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-gray-800 mb-1">
                    Name <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    onBlur={() => setTouched((prev) => ({ ...prev, name: true }))}
                    className={`w-full px-3 py-2 border rounded text-xs sm:text-sm text-gray-900 focus:outline-hidden focus:ring-1 focus:ring-blue-500 transition-colors ${
                      touched.name && !formData.name.trim() ? 'border-red-500 bg-red-50/20' : 'border-gray-300'
                    }`}
                  />
                  {touched.name && !formData.name.trim() && (
                    <span className="text-[11px] text-red-600">Please enter your full name.</span>
                  )}
                </div>

                {/* Address * (Premise Number or Name) */}
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-gray-800 mb-1">
                    Address <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.premiseAddress}
                    placeholder="Premise Number or Name"
                    onChange={(e) => handleInputChange('premiseAddress', e.target.value)}
                    onBlur={() => setTouched((prev) => ({ ...prev, premiseAddress: true }))}
                    className={`w-full px-3 py-2 border rounded text-xs sm:text-sm text-gray-900 placeholder:text-gray-400 focus:outline-hidden focus:ring-1 focus:ring-blue-500 transition-colors ${
                      touched.premiseAddress && !formData.premiseAddress.trim() ? 'border-red-500 bg-red-50/20' : 'border-gray-300'
                    }`}
                  />
                  {touched.premiseAddress && !formData.premiseAddress.trim() && (
                    <span className="text-[11px] text-red-600">Please enter premise number or building name.</span>
                  )}
                </div>

                {/* Locality */}
                <div>
                  <input
                    type="text"
                    value={formData.locality}
                    placeholder="Locality"
                    onChange={(e) => handleInputChange('locality', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-xs sm:text-sm text-gray-900 placeholder:text-gray-400 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                {/* State * */}
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-gray-800 mb-1">
                    State <span className="text-red-600">*</span>
                  </label>
                  <select
                    value={formData.state}
                    onChange={(e) => handleStateChange(e.target.value)}
                    onBlur={() => setTouched((prev) => ({ ...prev, state: true }))}
                    className={`w-full px-3 py-2 border rounded text-xs sm:text-sm text-gray-900 focus:outline-hidden focus:ring-1 focus:ring-blue-500 bg-white ${
                      touched.state && !formData.state ? 'border-red-500 bg-red-50/20' : 'border-gray-300'
                    }`}
                  >
                    <option value="">--Select a state--</option>
                    {Object.keys(INDIAN_STATES_DISTRICTS).map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                  {touched.state && !formData.state && (
                    <span className="text-[11px] text-red-600">Please select your state.</span>
                  )}
                </div>

                {/* Pincode * */}
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-gray-800 mb-1">
                    Pincode <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    value={formData.pincode}
                    onChange={(e) => handleInputChange('pincode', e.target.value.replace(/\D/g, ''))}
                    onBlur={() => setTouched((prev) => ({ ...prev, pincode: true }))}
                    className={`w-full px-3 py-2 border rounded text-xs sm:text-sm text-gray-900 focus:outline-hidden focus:ring-1 focus:ring-blue-500 ${
                      touched.pincode && !formData.pincode.trim() ? 'border-red-500 bg-red-50/20' : 'border-gray-300'
                    }`}
                  />
                  {touched.pincode && !formData.pincode.trim() && (
                    <span className="text-[11px] text-red-600">Please enter a valid 6-digit postal pincode.</span>
                  )}
                </div>

                {/* Phone number */}
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-gray-800 mb-1">
                    Phone number
                  </label>
                  <input
                    type="text"
                    value={formData.phoneNumber}
                    placeholder="Phone number with STD code. (e.g 011XXXXXXXX)"
                    onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-xs sm:text-sm text-gray-900 placeholder:text-gray-400 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                {/* Security Code * (Left Input field as in Image 2) */}
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-gray-800 mb-1">
                    Security Code <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.securityCode}
                    onChange={(e) => handleInputChange('securityCode', e.target.value)}
                    onBlur={() => setTouched((prev) => ({ ...prev, securityCode: true }))}
                    className={`w-full px-3 py-2 border rounded text-xs sm:text-sm text-gray-900 focus:outline-hidden focus:ring-1 focus:ring-blue-500 ${
                      touched.securityCode && !formData.securityCode.trim() ? 'border-red-500 bg-red-50/20' : 'border-gray-300'
                    }`}
                  />
                  {touched.securityCode && !formData.securityCode.trim() && (
                    <span className="text-[11px] text-red-600">Enter Security Code.</span>
                  )}
                </div>

              </div>

              {/* ============================================================= */}
              {/* RIGHT COLUMN */}
              {/* ============================================================= */}
              <div className="space-y-4">
                
                {/* Gender * (Radio: Male / Female / Transgender) */}
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-gray-800 mb-2">
                    Gender <span className="text-red-600">*</span>
                  </label>
                  <div className="flex items-center gap-6 text-xs sm:text-sm text-gray-800">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="gender"
                        value="Male"
                        checked={formData.gender === 'Male'}
                        onChange={(e) => handleInputChange('gender', e.target.value)}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span>Male</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="gender"
                        value="Female"
                        checked={formData.gender === 'Female'}
                        onChange={(e) => handleInputChange('gender', e.target.value)}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span>Female</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="gender"
                        value="Transgender"
                        checked={formData.gender === 'Transgender'}
                        onChange={(e) => handleInputChange('gender', e.target.value)}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span>Transgender</span>
                    </label>
                  </div>
                </div>

                {/* Sub-locality */}
                <div className="pt-2">
                  <label className="block text-xs sm:text-sm font-bold text-gray-800 mb-1 opacity-0 pointer-events-none hidden md:block">
                    Sub-locality Spacer
                  </label>
                  <input
                    type="text"
                    value={formData.subLocality}
                    placeholder="Sub-locality"
                    onChange={(e) => handleInputChange('subLocality', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-xs sm:text-sm text-gray-900 placeholder:text-gray-400 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                {/* Country * */}
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-gray-800 mb-1">
                    Country <span className="text-red-600">*</span>
                  </label>
                  <select
                    value={formData.country}
                    onChange={(e) => handleInputChange('country', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-xs sm:text-sm text-gray-900 focus:outline-hidden focus:ring-1 focus:ring-blue-500 bg-white"
                  >
                    <option value="India">India</option>
                  </select>
                </div>

                {/* District * */}
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-gray-800 mb-1">
                    District <span className="text-red-600">*</span>
                  </label>
                  <select
                    value={formData.district}
                    onChange={(e) => handleInputChange('district', e.target.value)}
                    disabled={!formData.state}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-xs sm:text-sm text-gray-900 focus:outline-hidden focus:ring-1 focus:ring-blue-500 bg-white disabled:bg-gray-100 disabled:text-gray-400"
                  >
                    <option value="">
                      {formData.state ? '--Select District--' : '---Select a state first---'}
                    </option>
                    {availableDistricts.map((dst) => (
                      <option key={dst} value={dst}>
                        {dst}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Mobile number * */}
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-gray-800 mb-1">
                    Mobile number <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="tel"
                    maxLength={10}
                    value={formData.mobileNumber}
                    onChange={(e) => handleInputChange('mobileNumber', e.target.value.replace(/\D/g, ''))}
                    onBlur={() => setTouched((prev) => ({ ...prev, mobileNumber: true }))}
                    className={`w-full px-3 py-2 border rounded text-xs sm:text-sm text-gray-900 focus:outline-hidden focus:ring-1 focus:ring-blue-500 ${
                      touched.mobileNumber && !formData.mobileNumber.trim() ? 'border-red-500 bg-red-50/20' : 'border-gray-300'
                    }`}
                  />
                  {touched.mobileNumber && !formData.mobileNumber.trim() && (
                    <span className="text-[11px] text-red-600">Enter a valid 10-digit mobile number.</span>
                  )}
                </div>

                {/* E-mail address * */}
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-gray-800 mb-1">
                    E-mail address <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    onBlur={() => setTouched((prev) => ({ ...prev, email: true }))}
                    className={`w-full px-3 py-2 border rounded text-xs sm:text-sm text-gray-900 focus:outline-hidden focus:ring-1 focus:ring-blue-500 ${
                      touched.email && !formData.email.trim() ? 'border-red-500 bg-red-50/20' : 'border-gray-300'
                    }`}
                  />
                  {touched.email && !formData.email.trim() && (
                    <span className="text-[11px] text-red-600">Enter a valid email address.</span>
                  )}
                </div>

                {/* Captcha Box (Right side display in Image 2) */}
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-gray-800 mb-1">
                    Password <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="password"
                    minLength={6}
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    onBlur={() => setTouched((prev) => ({ ...prev, password: true }))}
                    className={`w-full px-3 py-2 border rounded text-xs sm:text-sm text-gray-900 focus:outline-hidden focus:ring-1 focus:ring-blue-500 ${
                      touched.password && formData.password.length < 6 ? 'border-red-500 bg-red-50/20' : 'border-gray-300'
                    }`}
                  />
                  {touched.password && formData.password.length < 6 && <span className="text-[11px] text-red-600">Use at least 6 characters.</span>}
                </div>

                {/* Captcha Box (Right side display in Image 2) */}
                <div className="pt-2 flex items-center gap-3">
                  <CaptchaBox
                    captchaText={captchaValue}
                    onRefresh={refreshCaptcha}
                    showAudio={true}
                  />
                </div>

              </div>

            </div>

            {/* Bottom Submit Action Button (Exact Dark Navy button with floppy disk icon from Image 2) */}
            <div className="pt-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <button
                type="submit"
                disabled={isSubmitted}
                className="bg-[#002B49] hover:bg-[#001D33] active:bg-[#001424] text-white px-8 py-2.5 rounded-xs font-bold text-sm flex items-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer border border-[#001D33]"
              >
                <Save size={16} />
                <span>Submit</span>
              </button>

              <div className="text-xs text-gray-600">
                <span>Already registered? </span>
                <button
                  type="button"
                  onClick={() => onNavigate('login')}
                  className="text-blue-700 font-bold hover:underline cursor-pointer"
                >
                  Click here to Login
                </button>
              </div>
            </div>

          </form>

        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-[#001D33] text-gray-400 text-xs py-4 px-4 sm:px-6 border-t border-[#002B49] mt-auto text-center">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>DRISHTI — National Disaster &amp; Public Grievance Management System</span>
          <span>Department of Administrative Reforms and Public Grievances (DARPG)</span>
        </div>
      </footer>

    </div>
  );
};
