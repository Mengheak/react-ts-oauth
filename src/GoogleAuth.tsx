import { useState } from 'react';
import { GoogleOAuthProvider, GoogleLogin, type CredentialResponse } from '@react-oauth/google';
import { User, LogOut, Mail } from 'lucide-react';

interface DecodedToken {
  name: string;
  email: string;
  picture: string;
  sub: string;
  iss?: string;
  aud?: string;
  exp?: number;
  iat?: number;
}

interface UserData {
  name: string;
  email: string;
  picture: string;
  sub: string;
  credential: string;
}

function GoogleAuthComponent() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userData, setUserData] = useState<UserData | null>(null);

  // Decode JWT token to get user info
  const decodeJWT = (token: string): DecodedToken | null => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload) as DecodedToken;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  };

  // Handle successful login
  const handleSuccess = (credentialResponse: CredentialResponse) => {
    console.log('Login Success:', credentialResponse);
    
    if (!credentialResponse.credential) {
      console.error('No credential in response');
      return;
    }

    const decoded = decodeJWT(credentialResponse.credential);
    console.log('Decoded user info:', decoded);
    
    if (decoded) {
      setIsLoggedIn(true);
      setUserData({
        name: decoded.name,
        email: decoded.email,
        picture: decoded.picture,
        sub: decoded.sub,
        credential: credentialResponse.credential
      });
    }
  };

  // Handle login failure
  const handleError = () => {
    console.log('Login Failed');
    alert('Google login failed. Please try again.');
  };

  // Handle logout
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserData(null);
    console.log('Logged out');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
            <User className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Google Login Demo
          </h1>
          <p className="text-gray-600">
            Sign in with your Google account
          </p>
        </div>

        {!isLoggedIn ? (
          <div className="space-y-4">
            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={handleSuccess}
                onError={handleError}
                useOneTap
                theme="outline"
                size="large"
                text="continue_with"
                shape="rectangular"
              />
            </div>
            
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800 mb-2">
                <strong>Setup Instructions:</strong>
              </p>
              <ol className="text-xs text-yellow-700 space-y-1 list-decimal list-inside">
                <li>Install: npm install @react-oauth/google</li>
                <li>Get Client ID from Google Cloud Console</li>
                <li>Add VITE_GOOGLE_CLIENT_ID to .env file</li>
                <li>Configure authorized origins in Google Console</li>
              </ol>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>✓ Works with React 19</strong>
              </p>
              <p className="text-xs text-blue-700 mt-1">
                Official Google Identity Services library with full React support
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
              {userData?.picture && (
                <img
                  src={userData.picture}
                  alt={userData.name}
                  className="w-16 h-16 rounded-full border-2 border-red-500"
                />
              )}
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800 text-lg">
                  {userData?.name}
                </h3>
                <div className="flex items-center space-x-1 text-gray-600 text-sm mt-1">
                  <Mail className="w-4 h-4" />
                  <span>{userData?.email}</span>
                </div>
                <p className="text-gray-500 text-xs mt-1">
                  ID: {userData?.sub}
                </p>
              </div>
            </div>

            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800 font-semibold mb-2">
                ✓ Successfully logged in with Google!
              </p>
              {userData?.credential && (
                <p className="text-xs text-green-700">
                  JWT Token: {userData.credential.substring(0, 30)}...
                </p>
              )}
            </div>

            <button
              onClick={handleLogout}
              className="w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center space-x-2"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-gray-200">
          <h4 className="font-semibold text-gray-700 mb-3 text-sm">What you get:</h4>
          <ul className="text-xs text-gray-600 space-y-1 list-disc list-inside">
            <li>User's full name</li>
            <li>Email address (verified)</li>
            <li>Profile picture</li>
            <li>Google user ID</li>
            <li>JWT credential token</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default function GoogleAuth() {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || ''}>
      <GoogleAuthComponent />
    </GoogleOAuthProvider>
  );
}