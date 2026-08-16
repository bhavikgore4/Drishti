import React, { useState } from 'react';
import { ArrowLeft, Key, Lock, Eye, EyeOff, ShieldCheck, Check } from 'lucide-react';

interface ChangePasswordViewProps {
  onBack: () => void;
  onSuccess: (newPassword: string) => void;
  onNotify: (msg: string) => void;
}

export const ChangePasswordView: React.FC<ChangePasswordViewProps> = ({
  onBack,
  onSuccess,
  onNotify,
}) => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Calculate password strength
  const calculateStrength = (pass: string) => {
    let score = 0;
    if (pass.length >= 8) score += 25;
    if (/[A-Z]/.test(pass)) score += 25;
    if (/[0-9]/.test(pass)) score += 25;
    if (/[^A-Za-z0-9]/.test(pass)) score += 25;
    return score;
  };

  const strength = calculateStrength(newPassword);

  const getStrengthLabel = (score: number) => {
    if (!newPassword) return '';
    if (score <= 25) return 'Weak';
    if (score <= 50) return 'Fair';
    if (score <= 75) return 'Good';
    return 'Strong';
  };

  const getStrengthColor = (score: number) => {
    if (score <= 25) return 'bg-red-500';
    if (score <= 50) return 'bg-amber-500';
    if (score <= 75) return 'bg-blue-500';
    return 'bg-emerald-600';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!oldPassword.trim()) {
      onNotify('Please enter your Old Password.');
      return;
    }

    if (newPassword.length < 6) {
      onNotify('New Password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      onNotify('New Password and Confirm Password do not match.');
      return;
    }

    if (oldPassword === newPassword) {
      onNotify('New Password must be different from your Old Password.');
      return;
    }

    onSuccess(newPassword);
    onNotify('Account password updated successfully.');
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sm:p-8 animate-in fade-in duration-200">
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-200 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gray-800 text-white flex items-center justify-center shrink-0">
            <Key size={18} />
          </div>
          <h1 className="text-lg sm:text-xl font-bold text-gray-900">Change Account Password</h1>
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

      {/* Change Password Form */}
      <form onSubmit={handleSubmit} className="mt-8 space-y-6 max-w-3xl">
        {/* Old Password */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-2 items-center">
          <label className="md:col-span-3 text-left md:text-right font-bold text-xs text-gray-800">
            Old Password <span className="text-red-600">*</span>
          </label>
          <div className="md:col-span-9 relative max-w-md">
            <input
              type={showOld ? 'text' : 'password'}
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              placeholder="Enter current password"
              className="w-full px-3 py-2 pr-9 border border-gray-300 rounded text-xs text-gray-800 focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
              required
            />
            <button
              type="button"
              onClick={() => setShowOld(!showOld)}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              {showOld ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
        </div>

        {/* New Password */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-2 items-start">
          <label className="md:col-span-3 text-left md:text-right font-bold text-xs text-gray-800 pt-2">
            New Password <span className="text-red-600">*</span>
          </label>
          <div className="md:col-span-9 space-y-2 max-w-md">
            <div className="relative">
              <input
                type={showNew ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                className="w-full px-3 py-2 pr-9 border border-gray-300 rounded text-xs text-gray-800 focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
                required
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                {showNew ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>

            {/* Password Strength Meter Bar (as shown in Screenshot 2 placeholder) */}
            <div className="border border-gray-300 rounded p-2 bg-gray-50/50">
              <div className="flex items-center justify-between text-[11px] text-gray-600 mb-1">
                <span>Password Strength</span>
                {newPassword && (
                  <span className="font-bold">{getStrengthLabel(strength)}</span>
                )}
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${getStrengthColor(strength)}`}
                  style={{ width: `${newPassword ? Math.max(strength, 15) : 0}%` }}
                ></div>
              </div>
              <div className="mt-1 text-[10px] text-gray-500">
                Use 8+ characters with uppercase, numbers &amp; special characters.
              </div>
            </div>
          </div>
        </div>

        {/* Confirm Password */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-2 items-center">
          <label className="md:col-span-3 text-left md:text-right font-bold text-xs text-gray-800">
            Confirm Password <span className="text-red-600">*</span>
          </label>
          <div className="md:col-span-9 relative max-w-md">
            <input
              type={showConfirm ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter new password"
              className="w-full px-3 py-2 pr-9 border border-gray-300 rounded text-xs text-gray-800 focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              {showConfirm ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4 border-t border-gray-200 flex justify-center md:justify-start md:pl-[25%]">
          <button
            type="submit"
            className="bg-[#002B49] hover:bg-[#00385F] text-white px-8 py-2 rounded text-xs font-bold shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center gap-2"
          >
            <ShieldCheck size={14} />
            <span>Submit</span>
          </button>
        </div>
      </form>
    </div>
  );
};
