import React, { useState } from "react";
import { Link } from "react-router-dom";
import { issueCredential } from "../api/issueService";
import CredentialCard from "../components/CredentialCard";
import { toast } from "sonner";

const IssueCredential: React.FC = () => {
  const [form, setForm] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(false);
  const [credential, setCredential] = useState<any>(null);
  const [worker, setWorker] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});

  const nameRegex = /^[A-Za-z]+([ '-][A-Za-z]+)*$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validateForm = () => {
    const newErrors: { name?: string; email?: string } = {};

    if (!form.name.trim()) {
      newErrors.name = "Name is required";
    } else if (!nameRegex.test(form.name)) {
      newErrors.name = "Name must contain only letters, spaces, hyphens";
    }

    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(form.email)) {
      newErrors.email = "Invalid email format";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    setCredential(null);
    setMessage("");

    try {
      const res = await issueCredential(form);

      switch (res.status) {
        case "issued":
          setCredential(res.credential);
          setWorker(res.worker);
          setMessage(res.message || "Credential issued successfully!");
          toast.success(res.message || "Credential issued successfully!");
          break;

        case "exists":
          setCredential(res.credential);
          setWorker(res.existing?.worker || "worker-n");
          setMessage(res.message || "Credential already exists");
          toast.info(res.message || "Credential already exists");
          break;

        case "email_conflict":
          setCredential(null);
          setWorker("");
          setMessage(res.message || "Email already used with another name");
          toast.warning(res.message || "Email already used with another name");
          break;

        default:
          setMessage("Unexpected response from server");
          toast.error("Unexpected response from server");
      }
    } catch (err: any) {
      const errData = err.response?.data;
      setCredential(null);
      setWorker("");
      setMessage(errData?.message || "Failed to issue credential");
      toast.error(errData?.message || "Failed to issue credential");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      {!credential && (
        <>
          <h2 className="text-xl font-semibold my-6 text-green-600">
            Issue Employee Credential
          </h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            {["name", "email"].map((field) => (
              <div key={field} className="flex flex-col gap-1">
                <label className="text-gray-400 text-start">
                  {field.toUpperCase()} :
                </label>
                <input
                  name={field}
                  placeholder={field}
                  value={form[field as keyof typeof form]}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-md p-2 shadow-md text-gray-400"
                  required
                />
                {errors[field as keyof typeof errors] && (
                  <span className="text-red-500 text-sm">
                    {errors[field as keyof typeof errors]}
                  </span>
                )}
              </div>
            ))}
            <div className="text-gray-500">
              Already issued?
              <Link to="/verify" className="underline cursor-pointer pl-1">
                <span className="text-green-600">Verify Now</span>
              </Link>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-green-600 text-white py-2 rounded-md mt-2"
            >
              {loading ? "Issuing..." : "Issue"}
            </button>
          </form>
        </>
      )}

      {message && (
        <div className="mt-4 p-2 bg-gray-100 rounded text-gray-700">
          {message}
        </div>
      )}

      {credential && worker && (
        <CredentialCard
          id={credential.id}
          name={credential.name}
          email={credential.email}
          worker={worker}
          issuedAt={credential.issuedAt}
        />
      )}
    </div>
  );
};

export default IssueCredential;
