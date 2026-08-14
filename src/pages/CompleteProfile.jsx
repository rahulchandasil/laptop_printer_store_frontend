import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { AlertCircle, ArrowRight, UserCircle2 } from "lucide-react";
import api from "../services/api";

function CompleteProfile() {
  const navigate = useNavigate();
  const location = useLocation();
  const userId = location.state?.userId;

  const [profileName, setProfileName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userId) {
      navigate("/login");
    }
  }, [userId, navigate]);

  const handleProfileComplete = async (e) => {
    e.preventDefault();
    if (!profileName.trim()) {
      setError("Please enter your name");
      return;
    }

    try {
      setError("");
      setLoading(true);

      const response = await api.post("/auth/complete-profile", {
        userId,
        name: profileName,
      });

      if (response.data.success) {
        localStorage.setItem("user", JSON.stringify(response.data.user));
        if (response.data.token) {
          localStorage.setItem("token", response.data.token);
        }
        navigate("/home");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to complete profile.");
    } finally {
      setLoading(false);
    }
  };

  if (!userId) return null;

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12 font-sans selection:bg-slate-200 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        
        <div className="mb-8 flex flex-col items-center justify-center text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 text-white shadow-lg shadow-slate-900/20">
            <UserCircle2 className="h-6 w-6" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-950">
            Complete your profile
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Tell us what you'd like us to call you.
          </p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
        >
          <div className="p-8">
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                  animate={{ opacity: 1, height: "auto", marginBottom: 24 }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  className="overflow-hidden rounded-xl bg-red-50 ring-1 ring-inset ring-red-200"
                >
                  <div className="flex items-start gap-3 p-4">
                    <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
                    <p className="text-sm font-medium text-red-800">{error}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleProfileComplete} className="space-y-5">
              <div>
                <label htmlFor="profileName" className="mb-1.5 block text-sm font-semibold text-slate-700">
                  Your name
                </label>
                <input
                  type="text"
                  id="profileName"
                  name="profileName"
                  value={profileName}
                  onChange={(e) => {
                    setProfileName(e.target.value);
                    if (error) setError("");
                  }}
                  placeholder="Rahul Sil"
                  required
                  maxLength={50}
                  className="block w-full rounded-xl border-0 bg-slate-50 py-3.5 px-4 text-sm text-slate-900 outline-none ring-1 ring-inset ring-slate-200 transition placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-inset focus:ring-slate-900"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="group relative mt-2 flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-slate-950 py-3.5 text-sm font-semibold text-white transition-all hover:bg-slate-800 disabled:bg-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
              >
                {loading ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    Continue
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default CompleteProfile;
