import React, { useState } from 'react';
import { ArrowLeft, User, RefreshCw, Edit, Check, X, ShieldCheck } from 'lucide-react';

export interface ProfileData {
  username: string;
  name: string;
  gender: 'Male' | 'Female' | 'Transgender';
  country: string;
  state: string;
  district: string;
  pincode: string;
  address1: string;
  address2: string;
  address3: string;
  phone: string;
  mobile: string;
  email: string;
  exServicemen: 'No' | 'Yes';
}

interface EditProfileViewProps {
  initialData?: Partial<ProfileData>;
  onBack: () => void;
  onSave: (data: ProfileData) => void;
  onNotify: (msg: string) => void;
}

export const EditProfileView: React.FC<EditProfileViewProps> = ({
  initialData,
  onBack,
  onSave,
  onNotify,
}) => {
  const [username, setUsername] = useState(initialData?.username || 'Bhavikgore4');
  const [name, setName] = useState(initialData?.name || 'Bhavik Gore');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Transgender'>(initialData?.gender || 'Male');
  const [country, setCountry] = useState(initialData?.country || 'India');
  const [stateVal, setStateVal] = useState(initialData?.state || 'Maharashtra');
  const [district, setDistrict] = useState(initialData?.district || 'Nagpur');
  const [pincode, setPincode] = useState(initialData?.pincode || '441110');
  const [address1, setAddress1] = useState(initialData?.address1 || 'Nagpur');
  const [address2, setAddress2] = useState(initialData?.address2 || '');
  const [address3, setAddress3] = useState(initialData?.address3 || '');
  const [phone, setPhone] = useState(initialData?.phone || '');
  const [mobile, setMobile] = useState(initialData?.mobile || '9420653315');
  const [email, setEmail] = useState(initialData?.email || 'bhavikgore4@gmail.com');
  const [exServicemen, setExServicemen] = useState<'No' | 'Yes'>(initialData?.exServicemen || 'No');
  const [securityCodeInput, setSecurityCodeInput] = useState('');
  const [captchaCode, setCaptchaCode] = useState('IKvBuo');

  // Inline edit modals for Username, Mobile, and Email
  const [activeInlineModal, setActiveInlineModal] = useState<'username' | 'mobile' | 'email' | null>(null);
  const [modalTempInput, setModalTempInput] = useState('');
  const [modalOtpInput, setModalOtpInput] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  const generateCaptcha = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaCode(code);
    setSecurityCodeInput('');
  };

  const handleOpenInlineModal = (type: 'username' | 'mobile' | 'email') => {
    setActiveInlineModal(type);
    setOtpSent(false);
    setModalOtpInput('');
    if (type === 'username') setModalTempInput(username);
    if (type === 'mobile') setModalTempInput(mobile);
    if (type === 'email') setModalTempInput(email);
  };

  const handleSendModalOtp = () => {
    if (!modalTempInput.trim()) {
      onNotify('Please enter a valid value.');
      return;
    }
    setOtpSent(true);
    onNotify(`Verification OTP sent to ${modalTempInput}`);
  };

  const handleConfirmModalUpdate = () => {
    if (activeInlineModal === 'username') {
      setUsername(modalTempInput);
      onNotify('Username updated successfully.');
    } else if (activeInlineModal === 'mobile') {
      setMobile(modalTempInput);
      onNotify('Mobile number updated successfully.');
    } else if (activeInlineModal === 'email') {
      setEmail(modalTempInput);
      onNotify('Email address updated successfully.');
    }
    setActiveInlineModal(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      onNotify('Name is mandatory.');
      return;
    }

    if (!address1.trim()) {
      onNotify('Address Line 1 is mandatory.');
      return;
    }

    if (securityCodeInput.trim().toLowerCase() !== captchaCode.toLowerCase()) {
      onNotify('Invalid Security Code (Captcha). Please enter the correct code.');
      generateCaptcha();
      return;
    }

    const updatedData: ProfileData = {
      username,
      name,
      gender,
      country,
      state: stateVal,
      district,
      pincode,
      address1,
      address2,
      address3,
      phone,
      mobile,
      email,
      exServicemen,
    };

    onSave(updatedData);
    onNotify('Profile details updated and saved successfully.');
    generateCaptcha();
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sm:p-8 animate-in fade-in duration-200">
      {/* Top Header Row with Title and Back Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-200 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gray-800 text-white flex items-center justify-center shrink-0">
            <User size={18} />
          </div>
          <h1 className="text-lg sm:text-xl font-bold text-gray-900">Edit Profile</h1>
          <button
            type="button"
            onClick={onBack}
            className="bg-[#5A6268] hover:bg-[#4E555B] text-white text-xs font-semibold px-3 py-1.5 rounded flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
          >
            <ArrowLeft size={13} />
            <span>Back To Home Page</span>
          </button>
        </div>

        <div className="text-red-600 text-xs font-bold text-left sm:text-right">
          Fields marked with * are mandatory
        </div>
      </div>

      {/* Profile Form */}
      <form onSubmit={handleSubmit} className="mt-6 space-y-4 max-w-4xl">
        {/* Username */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-2 items-center">
          <label className="md:col-span-3 text-left md:text-right font-bold text-xs text-gray-800">
            Username <span className="text-red-600">*</span>
          </label>
          <div className="md:col-span-9 flex items-center gap-2">
            <input
              type="text"
              value={username}
              readOnly
              className="w-full max-w-md px-3 py-1.5 border border-gray-300 rounded text-xs bg-gray-50 text-gray-800 focus:outline-hidden"
            />
            <button
              type="button"
              onClick={() => handleOpenInlineModal('username')}
              className="bg-[#FFCC00] hover:bg-[#E5B800] text-black font-bold text-xs px-3.5 py-1.5 rounded flex items-center gap-1 shrink-0 shadow-2xs cursor-pointer"
            >
              <Edit size={12} />
              <span>Edit</span>
            </button>
          </div>
        </div>

        {/* Name */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-2 items-center">
          <label className="md:col-span-3 text-left md:text-right font-bold text-xs text-gray-800">
            Name <span className="text-red-600">*</span>
          </label>
          <div className="md:col-span-9">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full max-w-md px-3 py-1.5 border border-gray-300 rounded text-xs text-gray-800 focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
              required
            />
          </div>
        </div>

        {/* Gender */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-2 items-center">
          <label className="md:col-span-3 text-left md:text-right font-bold text-xs text-gray-800">
            Gender <span className="text-red-600">*</span>
          </label>
          <div className="md:col-span-9 flex items-center gap-6 text-xs text-gray-800 font-semibold">
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="radio"
                name="gender"
                value="Male"
                checked={gender === 'Male'}
                onChange={() => setGender('Male')}
                className="text-blue-600"
              />
              <span>Male</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="radio"
                name="gender"
                value="Female"
                checked={gender === 'Female'}
                onChange={() => setGender('Female')}
                className="text-blue-600"
              />
              <span>Female</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="radio"
                name="gender"
                value="Transgender"
                checked={gender === 'Transgender'}
                onChange={() => setGender('Transgender')}
                className="text-blue-600"
              />
              <span>Transgender</span>
            </label>
          </div>
        </div>

        {/* Country */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-2 items-center">
          <label className="md:col-span-3 text-left md:text-right font-bold text-xs text-gray-800">
            Country <span className="text-red-600">*</span>
          </label>
          <div className="md:col-span-9">
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full max-w-md px-3 py-1.5 border border-gray-300 rounded text-xs bg-white text-gray-800 focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
            >
              <option value="India">India</option>
              <option value="United States">United States</option>
              <option value="United Kingdom">United Kingdom</option>
              <option value="United Arab Emirates">United Arab Emirates</option>
              <option value="Canada">Canada</option>
              <option value="Australia">Australia</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        {/* State */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-2 items-center">
          <label className="md:col-span-3 text-left md:text-right font-bold text-xs text-gray-800">
            State <span className="text-red-600">*</span>
          </label>
          <div className="md:col-span-9">
            <select
              value={stateVal}
              onChange={(e) => setStateVal(e.target.value)}
              className="w-full max-w-md px-3 py-1.5 border border-gray-300 rounded text-xs bg-white text-gray-800 focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
            >
              <option value="Maharashtra">Maharashtra</option>
              <option value="Delhi">Delhi</option>
              <option value="Gujarat">Gujarat</option>
              <option value="Karnataka">Karnataka</option>
              <option value="Tamil Nadu">Tamil Nadu</option>
              <option value="Uttar Pradesh">Uttar Pradesh</option>
              <option value="West Bengal">West Bengal</option>
              <option value="Telangana">Telangana</option>
              <option value="Kerala">Kerala</option>
              <option value="Andhra Pradesh">Andhra Pradesh</option>
              <option value="Madhya Pradesh">Madhya Pradesh</option>
              <option value="Rajasthan">Rajasthan</option>
              <option value="Bihar">Bihar</option>
              <option value="Punjab">Punjab</option>
              <option value="Haryana">Haryana</option>
              <option value="Odisha">Odisha</option>
              <option value="Assam">Assam</option>
            </select>
          </div>
        </div>

        {/* District */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-2 items-center">
          <label className="md:col-span-3 text-left md:text-right font-bold text-xs text-gray-800">
            District <span className="text-red-600">*</span>
          </label>
          <div className="md:col-span-9">
            <select
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="w-full max-w-md px-3 py-1.5 border border-gray-300 rounded text-xs bg-white text-gray-800 focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
            >
              <option value="Nagpur">Nagpur</option>
              <option value="Mumbai City">Mumbai City</option>
              <option value="Mumbai Suburban">Mumbai Suburban</option>
              <option value="Pune">Pune</option>
              <option value="Thane">Thane</option>
              <option value="Nashik">Nashik</option>
              <option value="Chhatrapati Sambhajinagar">Chhatrapati Sambhajinagar</option>
              <option value="Solapur">Solapur</option>
              <option value="Amravati">Amravati</option>
              <option value="Kolhapur">Kolhapur</option>
            </select>
          </div>
        </div>

        {/* Pincode */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-2 items-center">
          <label className="md:col-span-3 text-left md:text-right font-bold text-xs text-gray-800">
            Pincode
          </label>
          <div className="md:col-span-9">
            <input
              type="text"
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
              maxLength={6}
              className="w-full max-w-md px-3 py-1.5 border border-gray-300 rounded text-xs text-gray-800 focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
            />
          </div>
        </div>

        {/* Address (3 stacked inputs matching Screenshot 1) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-2 items-start">
          <label className="md:col-span-3 text-left md:text-right font-bold text-xs text-gray-800 pt-1.5">
            Address <span className="text-red-600">*</span>
          </label>
          <div className="md:col-span-9 space-y-2 max-w-md">
            <input
              type="text"
              value={address1}
              onChange={(e) => setAddress1(e.target.value)}
              placeholder="Address Line 1"
              className="w-full px-3 py-1.5 border border-gray-300 rounded text-xs text-gray-800 focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
              required
            />
            <input
              type="text"
              value={address2}
              onChange={(e) => setAddress2(e.target.value)}
              placeholder="Address Line 2 (Optional)"
              className="w-full px-3 py-1.5 border border-gray-300 rounded text-xs text-gray-800 focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
            />
            <input
              type="text"
              value={address3}
              onChange={(e) => setAddress3(e.target.value)}
              placeholder="Address Line 3 (Optional)"
              className="w-full px-3 py-1.5 border border-gray-300 rounded text-xs text-gray-800 focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
            />
          </div>
        </div>

        {/* Phone number */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-2 items-center">
          <label className="md:col-span-3 text-left md:text-right font-bold text-xs text-gray-800">
            Phone number
          </label>
          <div className="md:col-span-9">
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder=""
              className="w-full max-w-md px-3 py-1.5 border border-gray-300 rounded text-xs text-gray-800 focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
            />
          </div>
        </div>

        {/* Mobile number */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-2 items-center">
          <label className="md:col-span-3 text-left md:text-right font-bold text-xs text-gray-800">
            Mobile number <span className="text-red-600">*</span>
          </label>
          <div className="md:col-span-9 flex items-center gap-2">
            <input
              type="text"
              value={mobile}
              readOnly
              className="w-full max-w-md px-3 py-1.5 border border-gray-300 rounded text-xs bg-gray-50 text-gray-800 focus:outline-hidden"
            />
            <button
              type="button"
              onClick={() => handleOpenInlineModal('mobile')}
              className="bg-[#FFCC00] hover:bg-[#E5B800] text-black font-bold text-xs px-3.5 py-1.5 rounded flex items-center gap-1 shrink-0 shadow-2xs cursor-pointer"
            >
              <Edit size={12} />
              <span>Edit</span>
            </button>
          </div>
        </div>

        {/* E-mail address */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-2 items-center">
          <label className="md:col-span-3 text-left md:text-right font-bold text-xs text-gray-800">
            E-mail address <span className="text-red-600">*</span>
          </label>
          <div className="md:col-span-9 flex items-center gap-2">
            <input
              type="text"
              value={email}
              readOnly
              className="w-full max-w-md px-3 py-1.5 border border-gray-300 rounded text-xs bg-gray-50 text-gray-800 focus:outline-hidden"
            />
            <button
              type="button"
              onClick={() => handleOpenInlineModal('email')}
              className="bg-[#FFCC00] hover:bg-[#E5B800] text-black font-bold text-xs px-3.5 py-1.5 rounded flex items-center gap-1 shrink-0 shadow-2xs cursor-pointer"
            >
              <Edit size={12} />
              <span>Edit</span>
            </button>
          </div>
        </div>

        {/* Are you an Ex Servicemen? */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-2 items-center">
          <label className="md:col-span-3 text-left md:text-right font-bold text-xs text-gray-800">
            Are you an Ex Servicemen? <span className="text-red-600">*</span>
          </label>
          <div className="md:col-span-9 flex items-center gap-6 text-xs text-gray-800 font-semibold">
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="radio"
                name="exServicemen"
                value="No"
                checked={exServicemen === 'No'}
                onChange={() => setExServicemen('No')}
                className="text-blue-600"
              />
              <span>No</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="radio"
                name="exServicemen"
                value="Yes"
                checked={exServicemen === 'Yes'}
                onChange={() => setExServicemen('Yes')}
                className="text-blue-600"
              />
              <span>Yes</span>
            </label>
          </div>
        </div>

        {/* Security Code */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-2 items-center pt-2">
          <label className="md:col-span-3 text-left md:text-right font-bold text-xs text-gray-800">
            Security Code <span className="text-red-600">*</span>
          </label>
          <div className="md:col-span-9 flex flex-wrap items-center gap-3">
            <input
              type="text"
              value={securityCodeInput}
              onChange={(e) => setSecurityCodeInput(e.target.value)}
              placeholder=""
              className="w-48 px-3 py-1.5 border border-gray-300 rounded text-xs text-gray-800 focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
              required
            />
            {/* Captcha Box */}
            <div
              className="px-4 py-1.5 bg-gradient-to-r from-gray-100 to-gray-200 border border-gray-300 rounded select-none font-mono text-base font-bold tracking-widest text-gray-800 shadow-inner flex items-center gap-1"
              style={{ letterSpacing: '0.25em' }}
            >
              <span className="italic">{captchaCode}</span>
            </div>
            <button
              type="button"
              onClick={generateCaptcha}
              title="Refresh Captcha"
              className="p-1.5 text-gray-600 hover:text-blue-700 transition-colors cursor-pointer"
            >
              <RefreshCw size={15} />
            </button>
          </div>
        </div>

        {/* Navy Blue Submit Button */}
        <div className="pt-6 border-t border-gray-200 flex justify-center">
          <button
            type="submit"
            className="bg-[#002B49] hover:bg-[#00385F] text-white px-8 py-2 rounded text-xs font-bold shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center gap-2"
          >
            <ShieldCheck size={14} />
            <span>Submit</span>
          </button>
        </div>
      </form>

      {/* Inline Modal for Updating Username / Mobile / Email */}
      {activeInlineModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full shadow-2xl border border-gray-200 p-6 space-y-4 animate-in zoom-in-95 duration-200 text-xs">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3">
              <h3 className="text-sm font-bold text-gray-900 capitalize">
                Update {activeInlineModal}
              </h3>
              <button
                onClick={() => setActiveInlineModal(null)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="font-bold text-gray-700 block mb-1">
                  New {activeInlineModal === 'username' ? 'Username' : activeInlineModal === 'mobile' ? 'Mobile Number' : 'Email Address'}
                </label>
                <input
                  type={activeInlineModal === 'mobile' ? 'tel' : activeInlineModal === 'email' ? 'email' : 'text'}
                  value={modalTempInput}
                  onChange={(e) => setModalTempInput(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-xs text-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>

              {!otpSent ? (
                <button
                  type="button"
                  onClick={handleSendModalOtp}
                  className="w-full bg-[#FFCC00] hover:bg-[#E5B800] text-black font-bold py-2 rounded text-xs cursor-pointer shadow-xs transition-colors"
                >
                  Send Verification OTP
                </button>
              ) : (
                <div className="space-y-2 pt-2 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-gray-700">Enter 6-Digit OTP</label>
                    <span className="text-[10px] text-emerald-600 font-semibold">OTP sent (Use: 123456)</span>
                  </div>
                  <input
                    type="text"
                    maxLength={6}
                    value={modalOtpInput}
                    onChange={(e) => setModalOtpInput(e.target.value)}
                    placeholder="123456"
                    className="w-full px-3 py-2 border border-gray-300 rounded text-xs text-center font-mono text-base tracking-widest text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={handleConfirmModalUpdate}
                    className="w-full bg-[#002B49] hover:bg-[#00385F] text-white font-bold py-2 rounded text-xs cursor-pointer shadow-xs transition-colors"
                  >
                    Verify &amp; Update
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
