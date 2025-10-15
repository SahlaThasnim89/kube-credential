import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { verifyCredential } from "../api/verifyService";
import { toast } from "sonner";
import type { IssuedData, VerifiedData } from "@/types/verifyTypes";
import VerifiedCard from "../components/VerifiedCard";

const VerifyCredential: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [form, setForm] = useState({ id: "", name: "", email: "" });
  const [loading, setLoading] = useState(false);
  const [verifiedData, setVerifiedData] = useState<VerifiedData | null>(null);
  const [issuedData, setIssuedData] = useState<IssuedData | null>(null);
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});

  const nameRegex = /^[A-Za-z]+([ '-][A-Za-z]+)*$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  useEffect(() => {
    const id = searchParams.get("id");
    const name = searchParams.get("name");
    const email = searchParams.get("email");
    const worker = searchParams.get("worker");
    const issuedAt = searchParams.get("issuedAt");

    setIssuedData({
      worker: worker || "unknown",
      issuedAt: issuedAt || new Date().toISOString(),
    });

    setForm((prev) => ({
      ...prev,
      ...(id ? { id } : {}),
      ...(name ? { name } : {}),
      ...(email ? { email } : {}),
    }));
  }, [searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validateForm = () => {
    const newErrors: { id?: string; name?: string; email?: string } = {};

    if (!form.id.trim()) {
      newErrors.id = "ID is required";
    } else if (!/^[A-Za-z0-9]+$/.test(form.id.trim())) {
      newErrors.id = "ID can only contain letters and numbers";
    }

    if (!form.name.trim()) {
      newErrors.name = "Name is required";
    } else if (!nameRegex.test(form.name.trim())) {
      newErrors.name = "Name must contain only letters, spaces, hyphens";
    }

    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(form.email.trim())) {
      newErrors.email = "Invalid email format";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
      const data = await verifyCredential(form);

      if (data.status === "verified") {
        toast.success(data.message || "Credential is valid!");
        setVerifiedData({
          verifiedBy: data.worker,
          verifiedAt: data.verifiedAt,
        });

        setIssuedData({
          worker: data.worker || issuedData?.worker || "unknown",
          issuedAt:
            data.issuedAt || issuedData?.issuedAt || new Date().toISOString(),
        });
      } else {
        toast.warning(data.message || "Credential not verified");
        setVerifiedData(null);
      }
    } catch (err: any) {
      const resData = err.response?.data;
      if (resData?.status === "not_found") {
        toast.warning(
          resData.message || "Credential not found or has not been issued"
        );
      } else {
        toast.error(resData?.error || "Error verifying credential");
      }
      setVerifiedData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {verifiedData ? (
        <VerifiedCard
          id={form.id}
          name={form.name}
          email={form.email}
          worker={issuedData?.worker || "unknown"}
          issuedAt={issuedData?.issuedAt || new Date().toISOString()}
          verifiedBy={verifiedData.verifiedBy ?? ""}
          verifiedAt={verifiedData.verifiedAt}
        />
      ) : (
        <>
          <h2 className="text-xl font-semibold my-6 text-green-600">
            Verify Employee Credential
          </h2>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-3 align-middle"
          >
            {["id", "name", "email"].map((field) => (
              <div key={field} className="flex flex-col gap-1">
                <label className="text-gray-400 text-start">
                  {field.toUpperCase()} :
                </label>
                <input
                  type={field === "email" ? "email" : "text"}
                  name={field}
                  placeholder={field}
                  value={form[field as keyof typeof form]}
                  onChange={handleChange}
                  className="border border-gray-300 p-2 rounded-md shadow-md text-gray-400"
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
              Don't have any credential?
              <Link to="/issue" className="underline cursor-pointer pl-1">
                <span className="text-green-600">Create New</span>
              </Link>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-green-600 text-white py-2 rounded-md mt-2"
            >
              {loading ? "Verifying..." : "Verify"}
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default VerifyCredential;
