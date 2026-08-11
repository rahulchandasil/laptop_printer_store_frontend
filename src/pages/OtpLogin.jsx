import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function OtpLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const sendOtp = async () => {
    if (!email) {
      alert("Please enter your email");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/auth/send-otp", {
        email,
      });

      alert(response.data.message);
      setOtpSent(true);
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to send OTP"
      );
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (e) => {
    e.preventDefault();

    if (!otp) {
      alert("Please enter OTP");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/auth/verify-otp", {
        email,
        otp,
      });

      if (response.data.success) {
        localStorage.setItem(
          "user",
          JSON.stringify(response.data.user)
        );

        alert("Login successful");

        navigate("/home");
      }
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Invalid OTP"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6">
      <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-lg">

        <h1 className="text-3xl font-bold text-center">
          OTP Login
        </h1>

        <p className="text-center text-slate-500 mt-2">
          Login using your email
        </p>

        {!otpSent ? (
          <div className="mt-8">

            <label className="block font-medium mb-2">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              placeholder="Enter your email"
              className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
              onClick={sendOtp}
              disabled={loading}
              className="w-full mt-5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white py-3 rounded-xl font-semibold"
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>

          </div>
        ) : (
          <form
            onSubmit={verifyOtp}
            className="mt-8"
          >

            <p className="text-sm text-slate-500 mb-4">
              OTP sent to{" "}
              <span className="font-semibold">
                {email}
              </span>
            </p>

            <label className="block font-medium mb-2">
              Enter OTP
            </label>

            <input
              type="text"
              maxLength="6"
              value={otp}
              onChange={(e) =>
                setOtp(e.target.value.replace(/\D/g, ""))
              }
              placeholder="Enter 6 digit OTP"
              className="w-full border rounded-xl px-4 py-3 text-center text-xl tracking-[8px] outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white py-3 rounded-xl font-semibold"
            >
              {loading
                ? "Verifying..."
                : "Verify OTP"}
            </button>

            <button
              type="button"
              onClick={() => setOtpSent(false)}
              className="w-full mt-3 text-blue-600"
            >
              Change Email
            </button>

          </form>
        )}

        <button
          onClick={() => navigate("/login")}
          className="w-full mt-6 text-slate-600"
        >
          ← Back to Password Login
        </button>

      </div>
    </div>
  );
}

export default OtpLogin;