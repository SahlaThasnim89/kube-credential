import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import * as api from "../api/verifyService";
import VerifyCredential from "../pages/VerifyCredential";

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    warning: vi.fn(),
    error: vi.fn(),
  },
}));

import { toast } from "sonner";
import { vi } from "vitest";

describe("VerifyCredential Page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders verify page correctly", () => {
    render(
      <MemoryRouter>
        <VerifyCredential />
      </MemoryRouter>
    );

    expect(screen.getByText(/Verify Employee Credential/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Verify/i })).toBeInTheDocument();
  });

  test("submits credential and shows success toast", async () => {
    const mockResponse = {
      status: "verified",
      message: "Credential is valid!",
      worker: "worker-1",
      issuedAt: new Date().toISOString(),
      verifiedAt: new Date().toISOString(),
    };

    vi.spyOn(api, "verifyCredential").mockResolvedValue(mockResponse);

    render(
      <MemoryRouter>
        <VerifyCredential />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/ID/i), { target: { value: "123" } });
    fireEvent.change(screen.getByLabelText(/NAME/i), { target: { value: "John Doe" } });
    fireEvent.change(screen.getByLabelText(/EMAIL/i), { target: { value: "john@example.com" } });

    fireEvent.click(screen.getByRole("button", { name: /Verify/i }));

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith("Credential is valid!");
    });
  });
});
