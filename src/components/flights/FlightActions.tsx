import type { Flight } from "@/api";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Ellipsis } from "lucide-react";
import { toast } from "sonner";

export function FlightActions({
	flight,
	onDialogChange,
}: {
	flight: Flight;
	onDialogChange: (dialog?: "delete" | "update") => void;
}) {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" className="h-8 w-8 p-0">
					<span className="sr-only">Open menu</span>
					<Ellipsis className="h-4 w-4" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuLabel>Actions</DropdownMenuLabel>
				<DropdownMenuItem
					onClick={() => {
						navigator.clipboard.writeText(flight.id.toString());
						toast.success("Copied ID to clipboard");
					}}
				>
					Copy flight ID
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem onClick={() => onDialogChange("update")}>
					Update
				</DropdownMenuItem>
				<DropdownMenuItem
					className="text-red-500"
					onClick={() => onDialogChange("delete")}
				>
					Delete
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}