"use client";

export default function LogoutButton() {
  return (
    <button 
      onClick={() => {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
      }} 
      className="text-red-400 hover:text-red-300 transition text-sm"
    >
      Logout
    </button>
  );
}
