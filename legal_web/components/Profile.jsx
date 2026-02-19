"use client";
import React, { useEffect, useState, useRef } from "react";
import Webcam from "react-webcam";
import { ArrowLeft, Pencil, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Footer from "./Footer";
import { profileService } from "../lib/api";
import { useAuth } from "../context/LoginContext";
import { PhotoUpdateModal } from "./PhotoUpdateModal";
import { User } from 'lucide-react'

const COLORS = {
  black: "#16161a",
  gold: "#ffd600",
  accent: "#228be6",
  gray: "#f6f7fb",
};

const Profile = () => {
  const { accessToken, logoutUser, name: username } = useAuth();
  const navigate = useRouter();
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    photo: 'https://via.placeholder.com/120',
    phone: '',
    address: '',
    state: '',
    zipcode: '',
    barCouncilId: '',
  });

  const [editMode, setEditMode] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [password, setpassword] = useState(false);
  const [form, setForm] = useState({ current: '', newPass: '', confirm: '' });
  useEffect(() => {
    const controller = new AbortController();

    const fetchProfile = async () => {
      if (!accessToken) return;
      setLoading(true);
      try {
        const data = await profileService.getProfile(controller.signal);
        if (!controller.signal.aborted && data) {
          setProfile(data);
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          setLoading(true)
          console.error("Failed to fetch profile:", err);
          if (saved) setProfile(JSON.parse(saved));

        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };
    fetchProfile();

    return () => controller.abort();
  }, [accessToken]);

  const handleSave = async () => {
    try {
      console.log('profile data ', profile)
      const response = await profileService.updateProfile(profile);
      console.log('this is profile data', response.updateProfile)
      const mappedProfile = {
        name: response.updateProfile.lawyername,
        email: response.updateProfile.email,
        barCouncilId: response.updateProfile.barcouncilid,
        phone: response.updateProfile.mobile,
        state: response.updateProfile.state,
        zipcode: response.updateProfile.postal_code,
        address: response.updateProfile.address

      };
      setProfile(mappedProfile)
      localStorage.setItem('advocate_profile', JSON.stringify(profile));
      setEditMode(false);
    } catch (err) {
      console.error("Failed to save profile:", err);
      alert("Failed to save profile changes.");
    }
  };

  // Called by PhotoUpdateModal with (file: File, previewDataUrl: string)
  const handleImageUpdate = async (file, previewDataUrl) => {
    // Immediately show the local preview for instant feedback
    setProfile(prev => ({ ...prev, photo: previewDataUrl }));
    setUploadError(null);
    setUploadLoading(true);
    try {
      const { imageUrl } = await profileService.uploadProfilePhoto(file);
      // Replace preview with the permanent S3 URL
      setProfile(prev => ({ ...prev, photo: imageUrl }));
      localStorage.setItem("advocate_profile", JSON.stringify({ ...profile, photo: imageUrl }));
    } catch (err) {
      console.error("Profile photo upload failed:", err);
      setUploadError("Photo upload failed. Please try again.");
      // Roll back to previous photo
      setProfile(prev => ({ ...prev, photo: profile.photo }));
    } finally {
      setUploadLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleDashboard = () => {
    navigate.replace('/personaldashboard');
  };

  const handlechangePassword = () => {
    navigate.replace('/forgot-password')
    setMenuOpen(false);
  };

  const handlelogout = () => {
    logoutUser();
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (form.newPass !== form.confirm) {
      alert('Passwords do not match!');
      return;
    }
    // Call backend API or handler
    setForm({ current: "", newPass: "", confirm: "" });
    setpassword(false);
  };

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  if (loading) {
    return (
      <div style={{ background: COLORS.gray, minHeight: "100vh" }} className="flex flex-col">
        {/* Header (Keep header visible for better UX) */}
        <div className="bg-white shadow-sm border-b border-gray-200" >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <Link href='/personaldashboard' replace className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors group">
                <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform text-black" />
                <span className="font-medium text-black">Back to Dashboard</span>
              </Link>
              <div className="hidden lg:flex items-center gap-3">
                <div className="w-14 h-14 bg-white flex items-center rounded-lg justify-center">
                  <button
                    // onClick={() => setMenuOpen(prev => !prev)}
                    className="w-10 h-10 rounded-full overflow-hidden border border-gray-300 hover:ring-2 hover:ring-blue-400 cursor-pointer"
                  >
                    <img
                      src={profile.profile_image}
                      alt="User Avatar"
                      className="w-full h-full object-cover"
                    />
                  </button>                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center p-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderBottomColor: COLORS.gold }}></div>
          <p className="mt-4 text-gray-600 font-medium">Fetching profile details...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: COLORS.gray, minHeight: "100vh" }}>
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200" >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href='/personaldashboard' replace className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors group">
              <>
                <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform text-black" />
                <span className="font-medium text-black">Back to Dashboard</span>
              </></Link>
            <div className="hidden lg:flex items-center gap-3">
              <div className="w-14 h-14 bg-white flex items-center rounded-lg justify-center relative">
                <button
                  onClick={() => setMenuOpen(prev => !prev)}
                  className="w-10 h-10 rounded-full overflow-hidden border border-gray-300 hover:ring-2 hover:ring-blue-400 cursor-pointer"
                >
                  <img
                    src={profile.profile_image}
                    alt="User Avatar"
                    className="w-full h-full object-cover"
                  />
                </button>
                {menuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-64 bg-white shadow-xl rounded-xl border overflow-hidden z-20">
                    <div className="p-4 border-b">
                      <p className="font-semibold text-gray-800">{profile?.name || username || 'Advocate'}</p>
                      <p className="text-sm text-gray-500">Advocate</p>
                    </div>
                    <ul className="py-2 text-sm text-gray-700">
                      <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                        <button className="w-full text-left text-gray-700 hover:text-blue-600"
                          onClick={handleDashboard}
                        >
                          Personal Dashboard
                        </button>
                      </li>
                      <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                        <button className="w-full text-left text-gray-700 hover:text-blue-600"
                          onClick={handlechangePassword}>
                          Change Password
                        </button>
                      </li>
                      <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                        <button className="w-full text-left text-gray-700 hover:text-red-600"
                          onClick={handlelogout}
                        >
                          Logout
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="min-h-screen py-10 px-4">
        <div className="max-w-4xl mx-auto ">
          <div className="bg-white shadow-xl rounded-2xl p-8 bg-gradient-to-br from-gray-200 via-gold to-black">
            {/* Profile Section */}
            <div className="flex flex-col items-center mb-6 relative">
              <div className="relative group w-28 h-28 mb-4">
                <img
                  src={profile.profile_image}
                  alt="Advocate"
                  className={`w-full h-full rounded-full object-cover border-4 border-blue-200 ${uploadLoading ? 'opacity-50' : ''}`}
                />
                {uploadLoading && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderBottomColor: COLORS.gold }} />
                  </div>
                )}
                <button
                  onClick={() => setShowModal(true)}
                  disabled={uploadLoading}
                  className="absolute bottom-1 right-1 bg-white rounded-full p-1 shadow-md cursor-pointer disabled:opacity-50"
                  title="Edit photo"
                >
                  <Pencil className="w-4 h-4 text-gray-700" />
                </button>
                {showModal && (
                  <PhotoUpdateModal
                    onClose={() => setShowModal(false)}
                    onImageSelect={handleImageUpdate}
                    colors={COLORS}
                  />
                )}
              </div>
              {uploadError && (
                <p className="text-red-500 text-sm mt-1">{uploadError}</p>
              )}
              <h2 className="text-2xl font-bold text-gray-800">{profile.name}</h2>
              <p className="text-gray-600">{profile.email}</p>
            </div>
            <div className="space-y-7">
              {/* 1. Personal Details */}
              <div className="bg-white rounded-2xl shadow-xl p-7 border border-gray-200">
                <h3 className="text-xl font-bold text-gray-800 mb-6 border-b pb-2">Personal Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Full Name</label>
                    <div className="text-gray-800 border border-gray-300 rounded-xl p-4 bg-gray-50 shadow-sm">
                      {profile.name || '-'}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Email</label>
                    <div className="text-gray-800 border border-gray-300 rounded-xl p-4 bg-gray-50 shadow-sm">
                      {profile.email || '-'}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Bar Council ID</label>
                    <div className="text-gray-800 border border-gray-300 rounded-xl p-4 bg-gray-50 shadow-sm">
                      {profile.barCouncilId || '-'}
                    </div>
                  </div>
                </div>
              </div>
              <hr />
              {/* 2. Demographic Details */}
              <div className="bg-white rounded-2xl shadow-xl p-7 border border-gray-200">
                <div className='flex  gap-4'>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Demographic Details</h3>
                  <div className='mt-1'>
                    <button
                      onClick={() => setEditMode(!editMode)}
                      className="text-gray-500 hover:text-gray-700 transition"
                      aria-label="Edit Demographic Details"
                    >
                      {!editMode && <Pencil size={18} />}
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 items-start gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                    {editMode
                      ? <input type="text" value={profile.state} onChange={(e) => handleInputChange('state', e.target.value)} className="w-full border border-gray-300 rounded-md px-4 py-2" />
                      : <p className="text-gray-800 border border-gray-300 rounded-lg p-4 shadow-sm bg-white">{profile.state || '-'}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Zip Code</label>
                    {editMode
                      ? <input type="text" value={profile.zipcode} onChange={(e) => handleInputChange('zipcode', e.target.value)} className="w-full border border-gray-300 rounded-md px-4 py-2" />
                      : <p className="text-gray-800 border border-gray-300 rounded-lg p-4 shadow-sm bg-white">{profile.zipcode || '-'}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    {editMode
                      ? <textarea rows={3} value={profile.address} onChange={(e) => handleInputChange('address', e.target.value)} className="w-full border border-gray-300 rounded-md px-4 py-2" />
                      : <p className="text-gray-800 whitespace-pre-line border border-gray-300 rounded-lg p-4 shadow-sm bg-white">{profile.address || '-'}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    {editMode
                      ? <input type="text" value={profile.phone} onChange={(e) => handleInputChange('phone', e.target.value)} className="w-full border border-gray-300 rounded-md px-4 py-2" />
                      : <p className="text-gray-800 border border-gray-300 rounded-lg p-4 shadow-sm bg-white">{profile.phone || '-'}</p>}
                  </div>
                </div>
                <div className="flex justify-end space-x-4 mt-4">
                  {editMode && (
                    <>
                      <button
                        onClick={handleSave}
                        className="bg-[#228be6] text-white px-5 py-2 rounded-md hover:bg-blue-700 transition"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditMode(false)}
                        className="text-gray-600 hover:text-gray-800 transition"
                      >
                        Cancel
                      </button>
                    </>
                  )}
                </div>
              </div>
              <hr />
              {/* 3. Credentials */}
              {/* <div className="bg-white rounded-2xl shadow-xl p-7 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Credentials</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <p className="text-gray-800">
                    ••••••••
                    <Link href="/reset_password" className="text-blue-600 hover:underline ml-2">Reset Password</Link>
                  </p>
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </div>
      <Footer />
      {password && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white w-full max-w-md p-6 rounded-xl shadow-lg relative">
            <h2 className="text-xl font-semibold mb-4 text-black">Change Password</h2>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <input
                type="password"
                name="current"
                placeholder="Current Password"
                className="w-full px-4 py-2 border rounded-lg text-black"
                value={form.current}
                onChange={handleFormChange}
                required
              />
              <input
                type="password"
                name="newPass"
                placeholder="New Password"
                className="w-full px-4 py-2 border rounded-lg text-black"
                value={form.newPass}
                onChange={handleFormChange}
                required
              />
              <input
                type="password"
                name="confirm"
                placeholder="Confirm New Password"
                className="w-full px-4 py-2 border rounded-lg text-black"
                value={form.confirm}
                onChange={handleFormChange}
                required
              />
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-200 rounded-lg text-black"
                  onClick={() => setpassword(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
