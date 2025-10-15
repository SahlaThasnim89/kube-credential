import { CopySimple } from "@phosphor-icons/react";

interface CredentialCardProps {
  id: string;
  name: string;
  email: string;
  worker: string;
  issuedAt: string;
  verifiedBy: string;
  verifiedAt: string;
}

const VerifiedCard: React.FC<CredentialCardProps> = ({
  id,
  name,
  email,
  worker,
  issuedAt,
  verifiedBy,
  verifiedAt,
}) => {
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

      <div className="mt-4 text-gray-400 bg-green-50 p-4 rounded-md">
        ✅ Verified
        <br />
        Verified by: {verifiedBy}
        <br />
        Verified at: {new Date(verifiedAt).toLocaleString()}
      </div>
    </div>
  );
};

export default VerifiedCard;
