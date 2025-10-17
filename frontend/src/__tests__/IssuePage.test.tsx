import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import IssueCredential from "../pages/IssueCredential";
import * as api from "../api/issueService";
import { vi } from "vitest";


vi.mock("sonner", () => {
  return {
    toast: {
      success: vi.fn(),
      warning: vi.fn(),
      info: vi.fn(),
      error: vi.fn(),
    },
  };
});

describe("IssueCredential Page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders form correctly", () => {
    render(
      <MemoryRouter>
        <IssueCredential />
      </MemoryRouter>
    );

    expect(screen.getByText(/Issue Employee Credential/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText("name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("email")).toBeInTheDocument();
  });

  test("submits credential and shows success toast", async () => {
    const mockResponse = {
      status: "issued",
      message: "Credential issued by worker-1",
      credential: {
        id: "1",
        name: "John Doe",
        email: "john@example.com",
        issuedAt: new Date().toISOString(),
      },
      worker: "worker-1",
      existing: null,
    };

    vi.spyOn(api, "issueCredential").mockResolvedValue(mockResponse);

    const { toast } = await import("sonner");

    render(
      <MemoryRouter>
        <IssueCredential />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText("name"), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByPlaceholderText("email"), {
      target: { value: "john@example.com" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Issue/i }));

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith("Credential issued by worker-1");
    });
  });
});
