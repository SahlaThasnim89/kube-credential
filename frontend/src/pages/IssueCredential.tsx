import React, { useState } from "react";
import { Link } from "react-router-dom";
import { issueCredential } from "../api/issueService";
import CredentialCard from "../components/CredentialCard";
import { toast } from "sonner";

const IssueCredential: React.FC = () => {
  const [form, setForm] = useState({ name: "", email: "" });
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [credential, setCredential] = useState<any>(null);
  const [worker, setWorker] = useState<string>("");
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
    setResult(null);
    setCredential(null);

    try {
      const res = await issueCredential(form);
      console.log(res);

      if (res.status === "issued") {
        toast.success(res.message || "Credential issued successfully!");
      } else if (res.status === "exists") {
        toast.warning(
          res.message || "Credential already exists for this name and email!"
        );
      } else {
        toast.info(res.message || "Unknown response from server");
      }

      if (res.status === "issued" || res.status === "exists") {
        setCredential(res.credential);
        setWorker(res.worker || res.existing?.worker);
      }
    } catch (err: any) {
      const errData = err.response?.data;

      if (errData?.status === "email_conflict") {
        toast.warning(
          errData.message ||
            "A credential with this email already exists under a different name."
        );
      } else if (errData?.message) {
        toast.error(errData.message);
      } else {
        toast.error("Failed to issue credential. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
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
              Already issued ?
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

      {credential && (
        <CredentialCard
          id={credential.id}
          name={credential.name}
          email={credential.email}
          worker={worker || "worker-n"}
          issuedAt={credential.issuedAt}
        />
      )}
    </div>
  );
};

export default IssueCredential;
