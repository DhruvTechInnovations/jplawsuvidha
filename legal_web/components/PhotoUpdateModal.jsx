import React, { useState, useRef } from "react";
import Webcam from "react-webcam";
import { X } from "lucide-react";

export const PhotoUpdateModal = ({ onClose, onImageSelect, colors }) => {
    const [preview, setPreview] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [showWebcam, setShowWebcam] = useState(false);
    const webcamRef = useRef(null);

    // Handle file input: store the File object AND generate a data-URL preview
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setSelectedFile(file);
        const reader = new FileReader();
        reader.onload = () => setPreview(reader.result);
        reader.readAsDataURL(file);
    };

    // Handle webcam capture: screenshot produces a data-URL; convert it to a File
    const handleCapture = () => {
        const imageSrc = webcamRef.current.getScreenshot();
        setPreview(imageSrc);
        setShowWebcam(false);

        // Convert base64 data-URL to a File so we can upload it
        fetch(imageSrc)
            .then((res) => res.blob())
            .then((blob) => {
                const file = new File([blob], `webcam-capture-${Date.now()}.jpg`, {
                    type: "image/jpeg",
                });
                setSelectedFile(file);
            });
    };

    const handleSave = () => {
        if (!selectedFile || !preview) return;
        // Pass both the raw File (for S3 upload) and the preview URL (for instant UI update)
        onImageSelect(selectedFile, preview);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur bg-white/90">
            <div
                className="bg-white rounded-xl shadow-lg p-6 w-96 relative border-t-8"
                style={{ borderTopColor: colors.gold }}
            >
                <button
                    className="absolute top-2 right-2 text-gray-400 hover:text-gray-800"
                    onClick={onClose}
                    aria-label="Close photo modal"
                >
                    <X size={20} />
                </button>
                <h2 className="text-lg font-bold mb-4 text-gray-900">Update Profile Photo</h2>

                {!showWebcam ? (
                    <>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <span className="bg-blue-600 text-white px-3 py-1 rounded mb-4">
                                Upload Image
                            </span>
                            <span className="text-gray-500 text-sm mb-4">
                                {selectedFile ? selectedFile.name : "No file chosen"}
                            </span>
                            <input
                                type="file"
                                accept="image/*"
                                capture="environment"
                                className="hidden"
                                onChange={handleFileChange}
                            />
                        </label>
                        <button
                            type="button"
                            className="bg-[#228be6] text-white px-4 py-2 rounded-full w-full mb-3 font-bold"
                            onClick={() => setShowWebcam(true)}
                        >
                            Use Webcam
                        </button>
                        <p className="text-sm text-gray-400 mb-2">
                            <b>Mobile:</b> Tap to use the camera.<br />
                            <b>Laptop:</b> Use webcam or pick a file.
                        </p>
                        {preview && (
                            <img
                                src={preview}
                                alt="Preview"
                                className="mb-3 w-32 h-32 object-cover rounded-full mx-auto border-4"
                                style={{ borderColor: colors.gold }}
                            />
                        )}
                        <button
                            className="bg-[#228be6] text-white px-5 py-2 rounded-full w-full mt-2 disabled:bg-gray-400 font-bold"
                            onClick={handleSave}
                            disabled={!selectedFile}
                        >
                            Save Photo
                        </button>
                    </>
                ) : (
                    <>
                        <Webcam
                            audio={false}
                            ref={webcamRef}
                            screenshotFormat="image/jpeg"
                            className="mb-3 w-full rounded"
                            videoConstraints={{ facingMode: "user" }}
                        />
                        <div className="flex justify-between">
                            <button
                                className="bg-[#ffd600] text-[#16161a] px-4 py-2 rounded-full font-bold"
                                onClick={handleCapture}
                            >
                                Capture
                            </button>
                            <button
                                className="bg-[#228be6] text-white px-4 py-2 rounded-full font-bold"
                                onClick={() => setShowWebcam(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};
