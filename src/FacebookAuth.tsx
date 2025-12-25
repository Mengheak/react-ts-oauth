import { useState } from 'react';
import FacebookLogin, { 
  type FailResponse, 
  type ProfileSuccessResponse, 
  type SuccessResponse 
} from '@greatsumini/react-facebook-login';
import { User, LogOut } from 'lucide-react';

interface UserData extends Partial<SuccessResponse>, Partial<ProfileSuccessResponse> {}

export default function FacebookAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userData, setUserData] = useState<UserData>({});

  const handleSuccess = (response: SuccessResponse) => {
    console.log('Login Success:', response);
    
    if (response.accessToken) {
      setIsLoggedIn(true);
      setUserData((prev) => ({
        ...prev,
        ...response
      }));
    }
  };

  const handleProfileSuccess = (response: ProfileSuccessResponse) => {
    console.log('Profile Success:', response);
    
    setUserData((prev) => ({
      ...prev,
      ...response
    }));
  };

  const handleError = (error: FailResponse) => {
    console.log('Login Failed:', error);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserData({});
    console.log('Logged out from app');
  };

  console.log('Current userData:', userData);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <User className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Facebook Login Demo
          </h1>
          <p className="text-gray-600">
            Sign in with your Facebook account
          </p>
        </div>

        {!isLoggedIn ? (
          <div className="space-y-4">
            <FacebookLogin
              appId={import.meta.env.VITE_FACEBOOK_APP_ID || "2382420858843543"}
              onSuccess={handleSuccess}
              onFail={handleError}
              onProfileSuccess={handleProfileSuccess}
              fields="name,picture"
              scope="public_profile"
              render={({ onClick }) => (
                <button
                  onClick={onClick}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  <span>Continue with Facebook</span>
                </button>
              )}
            />

            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800 mb-2">
                <strong>Setup Instructions:</strong>
              </p>
              <ol className="text-xs text-yellow-700 space-y-1 list-decimal list-inside">
                <li>Install: npm install @greatsumini/react-facebook-login</li>
                <li>Add VITE_FACEBOOK_APP_ID to .env file</li>
                <li>Create Facebook App at developers.facebook.com</li>
                <li>Add yourself as Admin/Developer/Tester in Roles</li>
              </ol>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
              {userData?.picture?.data?.url && (
                <img
                  src={userData.picture.data.url}
                  alt={userData.name || 'User'}
                  className="w-16 h-16 rounded-full border-2 border-blue-500"
                />
              )}
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800 text-lg">
                  {userData?.name || 'User'}
                </h3>
                {userData?.email && (
                  <p className="text-gray-600 text-sm">{userData.email}</p>
                )}
                <p className="text-gray-500 text-xs mt-1">
                  ID: {userData?.userID || userData?.id}
                </p>
              </div>
            </div>

            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800 font-semibold mb-2">
                ✓ Successfully logged in!
              </p>
              {userData?.accessToken && (
                <p className="text-xs text-green-700">
                  Access Token: {userData.accessToken.substring(0, 20)}...
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
          <h4 className="font-semibold text-gray-700 mb-3 text-sm">Package Info:</h4>
          <div className="text-xs text-gray-600 bg-gray-50 p-3 rounded-lg">
            <p className="mb-1">✓ Compatible with React 18+</p>
            <p className="mb-1">✓ TypeScript support</p>
            <p>✓ Maintained and up-to-date</p>
          </div>
        </div>
      </div>
    </div>
  );
}