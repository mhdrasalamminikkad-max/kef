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
import { Trash2, Loader2, Download, Check, X, Eye, Image as ImageIcon } from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  paymentScreenshot?: string | null;
  status?: "pending" | "approved" | "rejected";
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

  const [viewScreenshotUrl, setViewScreenshotUrl] = useState<string | null>(null);

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

  const updateStatusMutation = useMutation({
    mutationFn: async ({ registrationId, status }: { registrationId: string; status: "approved" | "rejected" }) => {
      const response = await apiRequest(
        "PATCH",
        `/api/admin/program-registrations/${registrationId}/status`,
        { status }
      );
      return response.json();
    },
    onMutate: async ({ registrationId, status }: { registrationId: string; status: "approved" | "rejected" }) => {
      await queryClient.cancelQueries({ queryKey: ["/api/admin/program-registrations", selectedProgramId] });
      const previousRegistrations = queryClient.getQueryData<ProgramRegistration[]>(["/api/admin/program-registrations", selectedProgramId]);
      if (previousRegistrations) {
        queryClient.setQueryData<ProgramRegistration[]>(
          ["/api/admin/program-registrations", selectedProgramId],
          previousRegistrations.map((reg) => (reg.id === registrationId ? { ...reg, status } : reg))
        );
      }
      return { previousRegistrations };
    },
    onSuccess: (_: unknown, variables: { registrationId: string; status: "approved" | "rejected" }) => {
      toast({
        title: variables.status === "approved" ? "Registration Approved" : "Registration Denied",
        description: `Status updated to ${variables.status}. Email notification sent to participant.`,
      });
      queryClient.invalidateQueries({
        queryKey: ["/api/admin/program-registrations", selectedProgramId],
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Status Update Failed",
        description: error.message || "Failed to update registration status",
        variant: "destructive",
      });
    },
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
      "Status",
      "Payment Proof URL",
      "KEF Member",
      "Membership Number",
      "Registration Date",
    ];

    const rows = registrationsQuery.data.map((reg: ProgramRegistration) => [
      reg.fullName,
      reg.age || "",
      reg.email,
      `${reg.countryCode}${reg.phone}`,
      reg.company || "",
      reg.designation || "",
      reg.status || "pending",
      reg.paymentScreenshot || "N/A",
      reg.isMember ? "Yes" : "No",
      reg.membershipNumber || "",
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
            <div className="border rounded-lg overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Status</TableHead>
                    <TableHead>Payment Proof</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email / Phone</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>KEF Member</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {registrationsQuery.data.map((registration: ProgramRegistration) => (
                    <TableRow key={registration.id}>
                      {/* Status Badge */}
                      <TableCell>
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                          registration.status === 'approved' 
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300' 
                            : registration.status === 'rejected'
                            ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border border-rose-300'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300'
                        }`}>
                          {registration.status || "pending"}
                        </span>
                      </TableCell>

                      {/* Payment Proof Screenshot */}
                      <TableCell>
                        {registration.paymentScreenshot ? (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setViewScreenshotUrl(registration.paymentScreenshot!)}
                            className="h-8 gap-1 text-xs border-primary/40 text-primary hover:bg-primary/10"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            View Proof
                          </Button>
                        ) : (
                          <span className="text-xs text-muted-foreground italic flex items-center gap-1">
                            <ImageIcon className="h-3.5 w-3.5" /> No file
                          </span>
                        )}
                      </TableCell>

                      {/* Name & Details */}
                      <TableCell className="font-medium">
                        <div>{registration.fullName}</div>
                        {registration.designation && (
                          <div className="text-xs text-muted-foreground">{registration.designation}</div>
                        )}
                      </TableCell>

                      {/* Email & Phone */}
                      <TableCell className="text-xs space-y-0.5">
                        <div>{registration.email}</div>
                        <div className="text-muted-foreground">{registration.countryCode} {registration.phone}</div>
                      </TableCell>

                      {/* Company */}
                      <TableCell className="text-xs">{registration.company || "-"}</TableCell>

                      {/* KEF Member */}
                      <TableCell>
                        <span className={`px-2 py-0.5 rounded-full text-xs ${
                          registration.isMember 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {registration.isMember ? "Yes" : "No"}
                        </span>
                      </TableCell>

                      {/* Date */}
                      <TableCell className="text-xs text-muted-foreground">
                        {format(new Date(registration.createdAt), "MMM d, yyyy")}
                      </TableCell>

                      {/* Actions (Approve, Deny, Delete) */}
                      <TableCell className="text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            size="sm"
                            variant="default"
                            onClick={() => updateStatusMutation.mutate({ registrationId: registration.id, status: "approved" })}
                            disabled={updateStatusMutation.isPending || registration.status === "approved"}
                            className="h-8 bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-2.5 gap-1"
                          >
                            <Check className="h-3.5 w-3.5" /> Approve
                          </Button>

                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => updateStatusMutation.mutate({ registrationId: registration.id, status: "rejected" })}
                            disabled={updateStatusMutation.isPending || registration.status === "rejected"}
                            className="h-8 text-xs px-2.5 gap-1"
                          >
                            <X className="h-3.5 w-3.5" /> Deny
                          </Button>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              setDeleteConfirm({
                                open: true,
                                registrationId: registration.id,
                              })
                            }
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
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

      {/* PAYMENT SCREENSHOT MODAL */}
      <Dialog open={!!viewScreenshotUrl} onOpenChange={(open: boolean) => !open && setViewScreenshotUrl(null)}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5 text-primary" />
              Uploaded Payment Screenshot Proof
            </DialogTitle>
          </DialogHeader>
          <div className="flex justify-center p-2 bg-slate-950 rounded-lg overflow-hidden max-h-[70vh]">
            {viewScreenshotUrl && (
              <img
                src={viewScreenshotUrl}
                alt="Payment Proof"
                className="max-h-[65vh] w-auto object-contain rounded"
              />
            )}
          </div>
          <div className="flex justify-end">
            <Button variant="outline" onClick={() => setViewScreenshotUrl(null)}>
              Close Preview
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* DELETE CONFIRMATION DIALOG */}
      <AlertDialog
        open={deleteConfirm.open}
        onOpenChange={(open: boolean) =>
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

