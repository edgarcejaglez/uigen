import { Loader2 } from "lucide-react";

interface ToolInvocation {
  toolCallId: string;
  toolName: string;
  args: Record<string, any>;
  state: string;
  result?: any;
}

interface ToolInvocationBadgeProps {
  toolInvocation: ToolInvocation;
}

function getLabel(toolName: string, args: Record<string, any>): string {
  const filename = args.path ? args.path.split("/").pop() : null;
  const name = filename || args.path || "";

  if (toolName === "str_replace_editor") {
    switch (args.command) {
      case "create":
        return `Moseying... creating ${name}`;
      case "str_replace":
      case "insert":
        return `Moseying... editing ${name}`;
      case "view":
        return `Moseying... reading ${name}`;
      default:
        return `Moseying... ${name}`;
    }
  }

  if (toolName === "file_manager") {
    switch (args.command) {
      case "rename":
        return `Moseying... renaming ${name}`;
      case "delete":
        return `Moseying... deleting ${name}`;
      default:
        return `Moseying... ${name}`;
    }
  }

  return toolName;
}

export function ToolInvocationBadge({ toolInvocation }: ToolInvocationBadgeProps) {
  const { toolName, args, state, result } = toolInvocation;
  const label = getLabel(toolName, args);
  const isDone = state === "result" && result;

  return (
    <div className="inline-flex items-center gap-2 mt-2 px-3 py-1.5 bg-neutral-50 rounded-lg text-xs border border-neutral-200">
      {isDone ? (
        <>
          <div className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="text-neutral-700">{label}</span>
        </>
      ) : (
        <>
          <Loader2 className="w-3 h-3 animate-spin text-blue-600" />
          <span className="text-neutral-700">{label}</span>
        </>
      )}
    </div>
  );
}
