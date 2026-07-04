// 'use client';

// import React from 'react';
// import { X, Loader2, User } from 'lucide-react';

// interface Advocate {
//     id: string | number;
//     name: string;
//     enrollmentNumber?: string;
//     enrollment_number?: string;
//     barRegistration?: string;
//     bar_registration?: string;
//     imageUrl?: string;
//     profile_image?: string;
//     photo?: string;
// }

// interface PhotoModalProps {
//     isOpen: boolean;
//     onClose: () => void;
//     advocates: Advocate[];
//     loading?: boolean;
// }

// export const PhotoModal: React.FC<PhotoModalProps> = ({
//     isOpen,
//     onClose,
//     advocates = [],
//     loading = false
// }) => {
//     if (false) return null;

//     return (
//         <div >
//             <div className="bg-white max-h-[75vh] rounded-2xl shadow-xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">

//                 {/* Header */}
//                 <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
//                     <div>
//                         <h3 className="text-base font-bold text-gray-900">Advocates List</h3>
//                         <p className="text-xs text-gray-500 mt-0.5">Showcasing registered legal professionals</p>
//                     </div>
//                     <button
//                         onClick={onClose}
//                         className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
//                         aria-label="Close"
//                     >
//                         <X size={18} />
//                     </button>
//                 </div>

//                 {/* Content */}
//                 <div className="flex-1 overflow-y-auto p-5 min-h-[200px]">
//                     {loading ? (
//                         <div className="flex flex-col items-center justify-center py-12">
//                             <Loader2 className="text-blue-600 animate-spin mb-2" size={28} />
//                             <p className="text-xs text-gray-500">Loading advocates...</p>
//                         </div>
//                     ) : advocates.length === 0 ? (
//                         <div className="flex flex-col items-center justify-center py-16 text-center">
//                             <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 mb-3">
//                                 <User size={24} />
//                             </div>
//                             <p className="text-sm font-medium text-gray-600">No advocates available.</p>
//                             <p className="text-xs text-gray-400 mt-1">Please check back later.</p>
//                         </div>
//                     ) : (
//                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//                             {advocates.map((advocate) => {
//                                 const enrollment = advocate.enrollmentNumber || advocate.enrollment_number || advocate.barRegistration || advocate.bar_registration || 'N/A';
//                                 const photoUrl = advocate.imageUrl || advocate.profile_image || advocate.photo;

//                                 return (
//                                     <div
//                                         key={advocate.id}
//                                         className="flex items-center gap-3.5 p-3 bg-white border border-gray-150 rounded-xl shadow-sm hover:border-gray-300 hover:bg-gray-50/30 transition-all"
//                                     >
//                                         {photoUrl ? (
//                                             <img
//                                                 src={photoUrl}
//                                                 alt={advocate.name}
//                                                 className="w-11 h-11 rounded-full object-cover border border-gray-100 flex-shrink-0"
//                                             />
//                                         ) : (
//                                             <div className="w-11 h-11 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm flex-shrink-0">
//                                                 {advocate.name ? advocate.name.split(' ').filter(n => n.toLowerCase() !== 'adv.').map(n => n[0]).slice(0, 2).join('') : 'A'}
//                                             </div>
//                                         )}
//                                         <div className="min-w-0">
//                                             <h4 className="font-semibold text-gray-900 text-xs truncate">{advocate.name}</h4>
//                                             <p className="text-[10px] text-gray-500 font-medium mt-0.5">Enrollment: {enrollment}</p>
//                                         </div>
//                                     </div>
//                                 );
//                             })}
//                         </div>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default PhotoModal;
