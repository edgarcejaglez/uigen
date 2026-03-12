import { test, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { ToolInvocationBadge } from "../ToolInvocationBadge";

afterEach(() => {
  cleanup();
});

test("str_replace_editor create shows 'Moseying... creating filename'", () => {
  render(
    <ToolInvocationBadge
      toolInvocation={{
        toolCallId: "1",
        toolName: "str_replace_editor",
        args: { command: "create", path: "/components/Card.jsx" },
        state: "call",
      }}
    />
  );
  expect(screen.getByText("Moseying... creating Card.jsx")).toBeDefined();
});

test("str_replace_editor str_replace shows 'Moseying... editing filename'", () => {
  render(
    <ToolInvocationBadge
      toolInvocation={{
        toolCallId: "2",
        toolName: "str_replace_editor",
        args: { command: "str_replace", path: "/components/Card.jsx" },
        state: "call",
      }}
    />
  );
  expect(screen.getByText("Moseying... editing Card.jsx")).toBeDefined();
});

test("str_replace_editor insert shows 'Moseying... editing filename'", () => {
  render(
    <ToolInvocationBadge
      toolInvocation={{
        toolCallId: "3",
        toolName: "str_replace_editor",
        args: { command: "insert", path: "/components/Card.jsx" },
        state: "call",
      }}
    />
  );
  expect(screen.getByText("Moseying... editing Card.jsx")).toBeDefined();
});

test("str_replace_editor view shows 'Moseying... reading filename'", () => {
  render(
    <ToolInvocationBadge
      toolInvocation={{
        toolCallId: "4",
        toolName: "str_replace_editor",
        args: { command: "view", path: "/components/Card.jsx" },
        state: "call",
      }}
    />
  );
  expect(screen.getByText("Moseying... reading Card.jsx")).toBeDefined();
});

test("file_manager rename shows 'Moseying... renaming filename'", () => {
  render(
    <ToolInvocationBadge
      toolInvocation={{
        toolCallId: "5",
        toolName: "file_manager",
        args: { command: "rename", path: "/components/Old.jsx", new_path: "/components/New.jsx" },
        state: "call",
      }}
    />
  );
  expect(screen.getByText("Moseying... renaming Old.jsx")).toBeDefined();
});

test("file_manager delete shows 'Moseying... deleting filename'", () => {
  render(
    <ToolInvocationBadge
      toolInvocation={{
        toolCallId: "6",
        toolName: "file_manager",
        args: { command: "delete", path: "/components/Card.jsx" },
        state: "call",
      }}
    />
  );
  expect(screen.getByText("Moseying... deleting Card.jsx")).toBeDefined();
});

test("state result with result shows green dot and no spinner", () => {
  const { container } = render(
    <ToolInvocationBadge
      toolInvocation={{
        toolCallId: "7",
        toolName: "str_replace_editor",
        args: { command: "create", path: "/components/Card.jsx" },
        state: "result",
        result: { success: true },
      }}
    />
  );
  expect(screen.getByText("Moseying... creating Card.jsx")).toBeDefined();
  expect(container.querySelector(".animate-spin")).toBeNull();
  expect(container.querySelector(".bg-emerald-500")).toBeDefined();
});

test("unknown tool falls back to tool name", () => {
  render(
    <ToolInvocationBadge
      toolInvocation={{
        toolCallId: "8",
        toolName: "unknown_tool",
        args: {},
        state: "call",
      }}
    />
  );
  expect(screen.getByText("unknown_tool")).toBeDefined();
});
