
import { useNavigate } from "react-router-dom";
import { CopySimple } from "@phosphor-icons/react";

interface CredentialCardProps {
  id: string;
  name: string;
  email: string;
  worker: string;
  issuedAt: string;
}

const CredentialCard: React.FC<CredentialCardProps> = ({
  id,
  name,
  email,
  worker,
  issuedAt,
}) => {
  const navigate = useNavigate();

  const handleVerify = () => {
    const params = new URLSearchParams({
      id,
      name,
      email,
      worker,
      issuedAt,
    }).toString();

    navigate(`/verify?${params}`);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("ID copied to clipboard!");
  };

  const rows = [
    { label: "ID", value: id, copyable: true },
    { label: "Name", value: name },
    { label: "Email", value: email },
    { label: "Issued By", value: worker },
    { label: "Issued At", value: new Date(issuedAt).toLocaleString() },
  ];

  return (
    <div className="m-4 p-4 text-gray-700">
      {rows.map((row) => (
        <div className="flex justify-between mb-2 items-center" key={row.label}>
          <span
            className={`w-1/2 text-left ${
              row.label === "ID" ? "font-semibold" : "font-normal"
            }`}
          >
            {row.label}
          </span>
          <span
            className={`w-1/2 text-left ${
              row.label === "ID" ? "font-semibold" : "font-normal"
            }`}
          >
            {row.value}
          </span>
          {row.copyable && (
            <span
              onClick={() => handleCopy(row.value)}
              className="cursor-pointer bg-gray-100 rounded-md hover:bg-gray-200 p-1"
              title="Copy ID"
            >
              <CopySimple color={"#7D7D7D"} size={20} />
            </span>
          )}
        </div>
      ))}
        <button
          onClick={handleVerify}
          className="bg-green-600 text-white rounded-md mt-6 py-2 px-4"
        >
          Verify Now
        </button>
    </div>
  );
};

export default CredentialCard;
