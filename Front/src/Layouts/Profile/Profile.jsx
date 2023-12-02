import React, { useState, useEffect } from 'react';
import fetch from "../../axiosInterceptor";
import FileUploader from "../Utils/FileUploader";
import SpinnerLoading from "../Utils/SpinnerLoading";
import { useNavigate, useParams } from 'react-router-dom';
import "./profile.css";

function Profile() {
    const [profileData, setProfileData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isCurrentUser, setIsCurrentUser] = useState(false);
    const [fileName, setFileName] = useState("");
    const authToken = localStorage.getItem("authToken");
    const navigate = useNavigate();
    const { uid } = useParams();

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const user = await fetchUserProfileByToken(authToken);
                if (user) {
                    setIsCurrentUser(user.id === uid || !uid);
                    if (user.userType === 1) {
                        const profile = await fetchUserProfileByUid(uid);
                        setProfileData(profile);
                    } else {
                        const profile = await fetchUserProfileByUid(user.id);
                        setProfileData(profile)
                    }
                }
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching profile data:', error);
                setIsLoading(false);
            }
        };

        fetchProfileData();
    }, [authToken, navigate, uid]);

    const fetchUserProfileByToken = async (token) => {
        const response = await fetch('https://localhost:7136/api/Users/get_by_token', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });

        return await response.json();
    };

    const handleFile = async (file) => {
        setFileName(file.name);

        const reader = new FileReader();

        reader.onload = async (event) => {
            try {
                const arrayBuffer = event.target.result;
                const byteArray = new Uint8Array(arrayBuffer);
                setIsLoading(true);
                const response = await fetch(
                    `https://localhost:7136/api/Users/change_image`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/octet-stream",
                            Authorization: `Bearer ${authToken}`,
                        },
                        body: byteArray,
                    }
                    );
                    
                    if (!response.ok) {
                        throw new Error("Image upload failed");
                    }
                    localStorage.setItem('pfp',  await response.text());
                    window.location.reload(true);
                    setIsLoading(false);
            } catch (error) {
                console.error("Error uploading image:", error);
            }
        };
        
        reader.readAsArrayBuffer(file);
    };

    const fetchUserProfileByUid = async (userId) => {
        const response = await fetch(`https://localhost:7136/api/Users/profile?uid=${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${authToken}`,
            },
        });

        return await response.json();
    };

    return (
        <div>
            {isLoading ? (
                <SpinnerLoading />
            ) : profileData ? (
                <div className='profile-box'>
                    <h3>{profileData.userName}</h3>
                    <p>{profileData.userType}</p>
                    <div>
                        <span>
                            {isCurrentUser ? (
                                <>
                                    <FileUploader
                                        handleFile={handleFile}
                                        imageURL={profileData.imageURL}
                                    />
                                    {fileName && <p>Uploaded file: {fileName}</p>}
                                </>
                            ) : (
                                <img
                                    className='profile-pic'
                                    src={profileData.imageURL}
                                    alt='Profile Picture'
                                    referrerPolicy="no-referrer"
                                />
                            )}
                        </span>
                        <p>{profileData.email}</p>
                        <p><b>{profileData.userName}</b> has finished <b>{profileData.finishedSubtasks}</b> {profileData.finishedSubtasks === 1 ? "subtask" : "subtasks"}</p>
                        <p>Part of {profileData.partOfTasks} tasks</p>
                    </div>
                </div>
            ) : (
                <p>No profile data available</p>
            )}
        </div>
    );
}

export default Profile;