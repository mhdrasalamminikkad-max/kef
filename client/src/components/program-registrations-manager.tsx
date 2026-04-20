import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Trash2, Loader2, Download } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { Program } from "@shared/schema";

interface ProgramRegistration {
  id: string;
  programId: string;
  fullName: string;
  age?: string;
  email: string;
  phone: string;
  countryCode: string;
  company?: string;
  designation?: string;
  isMember: boolean;
  membershipNumber?: string;
  attendeeType: "first-time" | "returning";
  affiliation: "client" | "coworking" | "member" | "not-affiliated";
  expectations?: string;
  createdAt: string;
}

interface ProgramRegistrationsManagerProps {
  programs: Program[];
  selectedProgramId: string | null;
  onSelectProgram: (programId: string | null) => void;
}

export function ProgramRegistrationsManager({
  programs,
  selectedProgramId,
  onSelectProgram,
}: ProgramRegistrationsManagerProps) {
  const { toast } = useToast();
  const [deleteConfirm, setDeleteConfirm] = useState<{
    open: boolean;
    registrationId: string | null;
  }>({ open: false, registrationId: null });

  const registrationsQuery = useQuery({
    queryKey: ["/api/admin/program-registrations", selectedProgramId],
    queryFn: async () => {
      if (!selectedProgramId) return [];
      try {
        const response = await apiRequest(
          "GET",
          `/api/admin/program-registrations/${selectedProgramId}`
        );
        return response.json();
      } catch (error) {
        console.error("Error fetching registrations:", error);
        return [];
      }
    },
    enabled: !!selectedProgramId,
  });

  const deleteRegistration = useMutation({
    mutationFn: async (registrationId: string) => {
      const response = await apiRequest(
        "DELETE",
        `/api/admin/program-registrations/${registrationId}`
      );
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Registration deleted successfully",
      });
      queryClient.invalidateQueries({
        queryKey: ["/api/admin/program-registrations", selectedProgramId],
      });
      setDeleteConfirm({ open: false, registrationId: null });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete registration",
        variant: "destructive",
      });
    },
  });

  const exportToCSV = () => {
    if (!registrationsQuery.data || registrationsQuery.data.length === 0) {
      toast({
        title: "No data",
        description: "No registrations to export",
        variant: "destructive",
      });
      return;
    }

    const headers = [
      "Full Name",
      "Age",
      "Email",
      "Phone",
      "Company",
      "Designation",
      "KEF Member",
      "Membership Number",
      "Attendee Type",
      "Affiliation",
      "Expectations",
      "Registration Date",
    ];

    const rows = registrationsQuery.data.map((reg: ProgramRegistration) => [
      reg.fullName,
      reg.age || "",
      reg.email,
      `${reg.countryCode}${reg.phone}`,
      reg.company || "",
      reg.designation || "",
      reg.isMember ? "Yes" : "No",
      reg.membershipNumber || "",
      reg.attendeeType,
      reg.affiliation,
      reg.expectations || "",
      format(new Date(reg.createdAt), "PPP HH:mm"),
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row: (string | undefined)[]) =>
        row.map((cell: string | undefined) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const program = programs.find((p) => p.id === selectedProgramId);
    a.download = `registrations-${program?.title || "export"}-${Date.now()}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const selectedProgram = programs.find((p) => p.id === selectedProgramId);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Select Program</label>
        <Select value={selectedProgramId || ""} onValueChange={onSelectProgram}>
          <SelectTrigger>
            <SelectValue placeholder="Choose a program to view registrations" />
          </SelectTrigger>
          <SelectContent>
            {programs.map((program) => (
              <SelectItem key={program.id} value={program.id}>
                {program.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedProgramId && (
        <>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <div>
                <CardTitle>{selectedProgram?.title}</CardTitle>
                <CardDescription>
                  {registrationsQuery.data?.length || 0} total registrations
                </CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={exportToCSV}
                disabled={
                  registrationsQuery.isLoading ||
                  !registrationsQuery.data ||
                  registrationsQuery.data.length === 0
                }
              >
                <Download className="mr-2 h-4 w-4" />
                Export CSV
              </Button>
            </CardHeader>
          </Card>

          {registrationsQuery.isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : registrationsQuery.data && registrationsQuery.data.length > 0 ? (
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Age</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Designation</TableHead>
                    <TableHead>KEF Member</TableHead>
                    <TableHead>Membership #</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Affiliation</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="w-12">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {registrationsQuery.data.map((registration: ProgramRegistration) => (
                    <TableRow key={registration.id}>
                      <TableCell className="font-medium">{registration.fullName}</TableCell>
                      <TableCell>{registration.age || "-"}</TableCell>
                      <TableCell>{registration.email}</TableCell>
                      <TableCell>
                        {registration.countryCode}
                        {registration.phone}
                      </TableCell>
                      <TableCell>{registration.company || "-"}</TableCell>
                      <TableCell>{registration.designation || "-"}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          registration.isMember 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {registration.isMember ? "Yes" : "No"}
                        </span>
                      </TableCell>
                      <TableCell>{registration.membershipNumber || "-"}</TableCell>
                      <TableCell>
                        <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                          {registration.attendeeType}
                        </span>
                      </TableCell>
                      <TableCell>{registration.affiliation}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {format(new Date(registration.createdAt), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            setDeleteConfirm({
                              open: true,
                              registrationId: registration.id,
                            })
                          }
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center py-8">
                <p className="text-muted-foreground">No registrations yet</p>
              </CardContent>
            </Card>
          )}
        </>
      )}

      <AlertDialog
        open={deleteConfirm.open}
        onOpenChange={(open) =>
          setDeleteConfirm({ open, registrationId: deleteConfirm.registrationId })
        }
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Registration</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this registration? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteConfirm.registrationId) {
                  deleteRegistration.mutate(deleteConfirm.registrationId);
                }
              }}
              disabled={deleteRegistration.isPending}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteRegistration.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
