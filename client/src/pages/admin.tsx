import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import {
  Shield,
  LogOut,
  Users,
  UserPlus,
  MessageSquare,
  LayoutDashboard,
  Check,
  X,
  Trash2,
  Eye,
  Loader2,
  RefreshCw,
} from "lucide-react";
import type { Bootcamp, Membership, Contact } from "@shared/schema";

interface DashboardStats {
  totalBootcampRegistrations: number;
  totalMembershipApplications: number;
  totalContactSubmissions: number;
  pendingBootcamp: number;
  pendingMembership: number;
}

interface SessionData {
  authenticated: boolean;
  admin?: {
    id: string;
    username: string;
  };
}

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedBootcamp, setSelectedBootcamp] = useState<Bootcamp | null>(null);
  const [selectedMembership, setSelectedMembership] = useState<Membership | null>(null);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    type: "bootcamp" | "membership" | "contact";
    id: string;
  }>({ open: false, type: "bootcamp", id: "" });

  const sessionQuery = useQuery<SessionData>({
    queryKey: ["/api/admin/session"],
  });

  const statsQuery = useQuery<DashboardStats>({
    queryKey: ["/api/admin/dashboard"],
    enabled: !!sessionQuery.data?.authenticated,
  });

  const bootcampQuery = useQuery<Bootcamp[]>({
    queryKey: ["/api/admin/bootcamp"],
    enabled: !!sessionQuery.data?.authenticated,
  });

  const membershipQuery = useQuery<Membership[]>({
    queryKey: ["/api/admin/membership"],
    enabled: !!sessionQuery.data?.authenticated,
  });

  const contactQuery = useQuery<Contact[]>({
    queryKey: ["/api/admin/contact"],
    enabled: !!sessionQuery.data?.authenticated,
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/admin/logout", {});
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/session"] });
      setLocation("/admin/login");
      toast({
        title: "Logged Out",
        description: "You have been logged out successfully",
      });
    },
  });

  const updateBootcampStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const response = await apiRequest("PATCH", `/api/admin/bootcamp/${id}`, { status });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/bootcamp"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/dashboard"] });
      toast({
        title: "Status Updated",
        description: "Bootcamp registration status has been updated",
      });
    },
  });

  const updateMembershipStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const response = await apiRequest("PATCH", `/api/admin/membership/${id}`, { status });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/membership"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/dashboard"] });
      toast({
        title: "Status Updated",
        description: "Membership application status has been updated",
      });
    },
  });

  const deleteBootcamp = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiRequest("DELETE", `/api/admin/bootcamp/${id}`, {});
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/bootcamp"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/dashboard"] });
      toast({
        title: "Deleted",
        description: "Bootcamp registration has been deleted",
      });
    },
  });

  const deleteMembership = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiRequest("DELETE", `/api/admin/membership/${id}`, {});
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/membership"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/dashboard"] });
      toast({
        title: "Deleted",
        description: "Membership application has been deleted",
      });
    },
  });

  const deleteContact = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiRequest("DELETE", `/api/admin/contact/${id}`, {});
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/contact"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/dashboard"] });
      toast({
        title: "Deleted",
        description: "Contact submission has been deleted",
      });
    },
  });

  useEffect(() => {
    if (sessionQuery.data && !sessionQuery.data.authenticated) {
      setLocation("/admin/login");
    }
  }, [sessionQuery.data, setLocation]);

  const handleDelete = () => {
    if (deleteDialog.type === "bootcamp") {
      deleteBootcamp.mutate(deleteDialog.id);
    } else if (deleteDialog.type === "membership") {
      deleteMembership.mutate(deleteDialog.id);
    } else if (deleteDialog.type === "contact") {
      deleteContact.mutate(deleteDialog.id);
    }
    setDeleteDialog({ open: false, type: "bootcamp", id: "" });
  };

  const refreshAllData = () => {
    queryClient.invalidateQueries({ queryKey: ["/api/admin/dashboard"] });
    queryClient.invalidateQueries({ queryKey: ["/api/admin/bootcamp"] });
    queryClient.invalidateQueries({ queryKey: ["/api/admin/membership"] });
    queryClient.invalidateQueries({ queryKey: ["/api/admin/contact"] });
    toast({
      title: "Refreshed",
      description: "All data has been refreshed",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-500/20 text-green-600 dark:text-green-400">Approved</Badge>;
      case "rejected":
        return <Badge className="bg-red-500/20 text-red-600 dark:text-red-400">Rejected</Badge>;
      default:
        return <Badge className="bg-yellow-500/20 text-yellow-600 dark:text-yellow-400">Pending</Badge>;
    }
  };

  if (sessionQuery.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!sessionQuery.data?.authenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Shield className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">KEF Admin Panel</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={refreshAllData} data-testid="button-refresh-data">
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              onClick={() => logoutMutation.mutate()}
              disabled={logoutMutation.isPending}
              data-testid="button-admin-logout"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6 grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
            <TabsTrigger value="dashboard" data-testid="tab-dashboard">
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="bootcamp" data-testid="tab-bootcamp">
              <UserPlus className="mr-2 h-4 w-4" />
              Bootcamp
            </TabsTrigger>
            <TabsTrigger value="membership" data-testid="tab-membership">
              <Users className="mr-2 h-4 w-4" />
              Membership
            </TabsTrigger>
            <TabsTrigger value="contact" data-testid="tab-contact">
              <MessageSquare className="mr-2 h-4 w-4" />
              Contact
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card data-testid="card-stat-bootcamp">
                <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
                  <CardTitle className="text-sm font-medium">Bootcamp Registrations</CardTitle>
                  <UserPlus className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold" data-testid="text-bootcamp-count">
                    {statsQuery.data?.totalBootcampRegistrations ?? 0}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {statsQuery.data?.pendingBootcamp ?? 0} pending review
                  </p>
                </CardContent>
              </Card>

              <Card data-testid="card-stat-membership">
                <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
                  <CardTitle className="text-sm font-medium">Membership Applications</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold" data-testid="text-membership-count">
                    {statsQuery.data?.totalMembershipApplications ?? 0}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {statsQuery.data?.pendingMembership ?? 0} pending review
                  </p>
                </CardContent>
              </Card>

              <Card data-testid="card-stat-contact">
                <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
                  <CardTitle className="text-sm font-medium">Contact Submissions</CardTitle>
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold" data-testid="text-contact-count">
                    {statsQuery.data?.totalContactSubmissions ?? 0}
                  </div>
                  <p className="text-xs text-muted-foreground">Total messages received</p>
                </CardContent>
              </Card>

              <Card data-testid="card-stat-pending">
                <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
                  <CardTitle className="text-sm font-medium">Pending Actions</CardTitle>
                  <Shield className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold" data-testid="text-pending-count">
                    {(statsQuery.data?.pendingBootcamp ?? 0) + (statsQuery.data?.pendingMembership ?? 0)}
                  </div>
                  <p className="text-xs text-muted-foreground">Items need review</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="bootcamp">
            <Card>
              <CardHeader>
                <CardTitle>Bootcamp Registrations</CardTitle>
                <CardDescription>
                  View and manage all Startup Boot Camp registrations
                </CardDescription>
              </CardHeader>
              <CardContent>
                {bootcampQuery.isLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                ) : bootcampQuery.data?.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No bootcamp registrations yet
                  </div>
                ) : (
                  <ScrollArea className="h-[500px]">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Phone</TableHead>
                          <TableHead>Age</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {bootcampQuery.data?.map((registration) => (
                          <TableRow key={registration.id} data-testid={`row-bootcamp-${registration.id}`}>
                            <TableCell className="font-medium">{registration.fullName}</TableCell>
                            <TableCell>{registration.email}</TableCell>
                            <TableCell>{registration.phone}</TableCell>
                            <TableCell>{registration.age}</TableCell>
                            <TableCell>
                              {format(new Date(registration.createdAt), "MMM d, yyyy")}
                            </TableCell>
                            <TableCell>{getStatusBadge(registration.status)}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => setSelectedBootcamp(registration)}
                                  data-testid={`button-view-bootcamp-${registration.id}`}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => updateBootcampStatus.mutate({ id: registration.id, status: "approved" })}
                                  disabled={registration.status === "approved"}
                                  data-testid={`button-approve-bootcamp-${registration.id}`}
                                >
                                  <Check className="h-4 w-4 text-green-600" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => updateBootcampStatus.mutate({ id: registration.id, status: "rejected" })}
                                  disabled={registration.status === "rejected"}
                                  data-testid={`button-reject-bootcamp-${registration.id}`}
                                >
                                  <X className="h-4 w-4 text-red-600" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => setDeleteDialog({ open: true, type: "bootcamp", id: registration.id })}
                                  data-testid={`button-delete-bootcamp-${registration.id}`}
                                >
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="membership">
            <Card>
              <CardHeader>
                <CardTitle>Membership Applications</CardTitle>
                <CardDescription>
                  View and manage all membership applications
                </CardDescription>
              </CardHeader>
              <CardContent>
                {membershipQuery.isLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                ) : membershipQuery.data?.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No membership applications yet
                  </div>
                ) : (
                  <ScrollArea className="h-[500px]">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Phone</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {membershipQuery.data?.map((application) => (
                          <TableRow key={application.id} data-testid={`row-membership-${application.id}`}>
                            <TableCell className="font-medium">{application.fullName}</TableCell>
                            <TableCell>{application.email}</TableCell>
                            <TableCell>{application.phone}</TableCell>
                            <TableCell className="capitalize">{application.membershipType}</TableCell>
                            <TableCell>
                              {format(new Date(application.createdAt), "MMM d, yyyy")}
                            </TableCell>
                            <TableCell>{getStatusBadge(application.status)}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => setSelectedMembership(application)}
                                  data-testid={`button-view-membership-${application.id}`}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => updateMembershipStatus.mutate({ id: application.id, status: "approved" })}
                                  disabled={application.status === "approved"}
                                  data-testid={`button-approve-membership-${application.id}`}
                                >
                                  <Check className="h-4 w-4 text-green-600" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => updateMembershipStatus.mutate({ id: application.id, status: "rejected" })}
                                  disabled={application.status === "rejected"}
                                  data-testid={`button-reject-membership-${application.id}`}
                                >
                                  <X className="h-4 w-4 text-red-600" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => setDeleteDialog({ open: true, type: "membership", id: application.id })}
                                  data-testid={`button-delete-membership-${application.id}`}
                                >
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contact">
            <Card>
              <CardHeader>
                <CardTitle>Contact Submissions</CardTitle>
                <CardDescription>
                  View all contact form submissions
                </CardDescription>
              </CardHeader>
              <CardContent>
                {contactQuery.isLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                ) : contactQuery.data?.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No contact submissions yet
                  </div>
                ) : (
                  <ScrollArea className="h-[500px]">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Subject</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {contactQuery.data?.map((contact) => (
                          <TableRow key={contact.id} data-testid={`row-contact-${contact.id}`}>
                            <TableCell className="font-medium">{contact.name}</TableCell>
                            <TableCell>{contact.email}</TableCell>
                            <TableCell className="max-w-[200px] truncate">{contact.subject}</TableCell>
                            <TableCell>
                              {format(new Date(contact.createdAt), "MMM d, yyyy")}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => setSelectedContact(contact)}
                                  data-testid={`button-view-contact-${contact.id}`}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => setDeleteDialog({ open: true, type: "contact", id: contact.id })}
                                  data-testid={`button-delete-contact-${contact.id}`}
                                >
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <Dialog open={!!selectedBootcamp} onOpenChange={() => setSelectedBootcamp(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Bootcamp Registration Details</DialogTitle>
            <DialogDescription>
              Full details of the bootcamp registration
            </DialogDescription>
          </DialogHeader>
          {selectedBootcamp && (
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Full Name</p>
                  <p className="text-base" data-testid="text-detail-fullname">{selectedBootcamp.fullName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Email</p>
                  <p className="text-base" data-testid="text-detail-email">{selectedBootcamp.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Phone</p>
                  <p className="text-base" data-testid="text-detail-phone">{selectedBootcamp.phone}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Age</p>
                  <p className="text-base" data-testid="text-detail-age">{selectedBootcamp.age}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Organization</p>
                  <p className="text-base" data-testid="text-detail-org">{selectedBootcamp.organization || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">District</p>
                  <p className="text-base" data-testid="text-detail-district">{selectedBootcamp.district || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Experience</p>
                  <p className="text-base" data-testid="text-detail-experience">{selectedBootcamp.experience || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Status</p>
                  <div data-testid="text-detail-status">{getStatusBadge(selectedBootcamp.status)}</div>
                </div>
              </div>
              {selectedBootcamp.expectations && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Expectations</p>
                  <p className="text-base" data-testid="text-detail-expectations">{selectedBootcamp.expectations}</p>
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-muted-foreground">Registration Date</p>
                <p className="text-base" data-testid="text-detail-date">
                  {format(new Date(selectedBootcamp.createdAt), "MMMM d, yyyy 'at' h:mm a")}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={!!selectedMembership} onOpenChange={() => setSelectedMembership(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Membership Application Details</DialogTitle>
            <DialogDescription>
              Full details of the membership application
            </DialogDescription>
          </DialogHeader>
          {selectedMembership && (
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Full Name</p>
                  <p className="text-base">{selectedMembership.fullName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Email</p>
                  <p className="text-base">{selectedMembership.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Phone</p>
                  <p className="text-base">{selectedMembership.phone}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Membership Type</p>
                  <p className="text-base capitalize">{selectedMembership.membershipType}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Organization</p>
                  <p className="text-base">{selectedMembership.organization || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Designation</p>
                  <p className="text-base">{selectedMembership.designation || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Interests</p>
                  <p className="text-base">{selectedMembership.interests}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Status</p>
                  <div>{getStatusBadge(selectedMembership.status)}</div>
                </div>
              </div>
              {selectedMembership.message && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Message</p>
                  <p className="text-base">{selectedMembership.message}</p>
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-muted-foreground">Application Date</p>
                <p className="text-base">
                  {format(new Date(selectedMembership.createdAt), "MMMM d, yyyy 'at' h:mm a")}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={!!selectedContact} onOpenChange={() => setSelectedContact(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Contact Submission Details</DialogTitle>
            <DialogDescription>
              Full details of the contact submission
            </DialogDescription>
          </DialogHeader>
          {selectedContact && (
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Name</p>
                  <p className="text-base">{selectedContact.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Email</p>
                  <p className="text-base">{selectedContact.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Phone</p>
                  <p className="text-base">{selectedContact.phone || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Subject</p>
                  <p className="text-base">{selectedContact.subject}</p>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Message</p>
                <p className="text-base whitespace-pre-wrap">{selectedContact.message}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Submission Date</p>
                <p className="text-base">
                  {format(new Date(selectedContact.createdAt), "MMMM d, yyyy 'at' h:mm a")}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ ...deleteDialog, open })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this {deleteDialog.type} entry.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-cancel-delete">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} data-testid="button-confirm-delete">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
