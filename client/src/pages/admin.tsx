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
  Image,
  Layers,
  Plus,
  Pencil,
  BellRing,
  Save,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ImageUpload } from "@/components/ui/image-upload";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Bootcamp, Membership, Contact, Program, Partner, PopupSettings } from "@shared/schema";
import { Handshake } from "lucide-react";
import bootcampPoster from "@assets/kef_bootcamp.png";

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
    type: "bootcamp" | "membership" | "contact" | "program" | "partner";
    id: string;
  }>({ open: false, type: "bootcamp", id: "" });
  const [showPoster, setShowPoster] = useState(false);
  const [programDialog, setProgramDialog] = useState<{
    open: boolean;
    mode: "add" | "edit";
    program?: Program;
  }>({ open: false, mode: "add" });
  const [programForm, setProgramForm] = useState({
    title: "",
    description: "",
    icon: "Rocket",
    gradient: "purple" as "purple" | "blue" | "teal" | "orange",
    isActive: true,
    order: "0",
    bannerImage: "",
    features: "",
  });
  const [partnerDialog, setPartnerDialog] = useState<{
    open: boolean;
    mode: "add" | "edit";
    partner?: Partner;
  }>({ open: false, mode: "add" });
  const [partnerForm, setPartnerForm] = useState({
    name: "",
    logo: "",
    website: "",
    order: "0",
    isActive: true,
  });
  const [popupForm, setPopupForm] = useState({
    isEnabled: true,
    title: "Startup Boot Camp",
    bannerImage: "",
    buttonText: "Register Now",
    buttonLink: "/register",
    delaySeconds: "1",
    showOnce: false,
  });

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

  const programsQuery = useQuery<Program[]>({
    queryKey: ["/api/admin/programs"],
    enabled: !!sessionQuery.data?.authenticated,
  });

  const partnersQuery = useQuery<Partner[]>({
    queryKey: ["/api/admin/partners"],
    enabled: !!sessionQuery.data?.authenticated,
  });

  const popupSettingsQuery = useQuery<PopupSettings>({
    queryKey: ["/api/admin/popup-settings"],
    enabled: !!sessionQuery.data?.authenticated,
  });

  useEffect(() => {
    if (popupSettingsQuery.data) {
      setPopupForm({
        isEnabled: popupSettingsQuery.data.isEnabled,
        title: popupSettingsQuery.data.title,
        bannerImage: popupSettingsQuery.data.bannerImage,
        buttonText: popupSettingsQuery.data.buttonText,
        buttonLink: popupSettingsQuery.data.buttonLink,
        delaySeconds: popupSettingsQuery.data.delaySeconds,
        showOnce: popupSettingsQuery.data.showOnce,
      });
    }
  }, [popupSettingsQuery.data]);

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

  const createProgram = useMutation({
    mutationFn: async (data: typeof programForm) => {
      const response = await apiRequest("POST", "/api/admin/programs", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/programs"] });
      setProgramDialog({ open: false, mode: "add" });
      resetProgramForm();
      toast({
        title: "Program Created",
        description: "New program has been added successfully",
      });
    },
  });

  const updateProgram = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: typeof programForm }) => {
      const response = await apiRequest("PATCH", `/api/admin/programs/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/programs"] });
      setProgramDialog({ open: false, mode: "add" });
      resetProgramForm();
      toast({
        title: "Program Updated",
        description: "Program has been updated successfully",
      });
    },
  });

  const deleteProgram = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiRequest("DELETE", `/api/admin/programs/${id}`, {});
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/programs"] });
      toast({
        title: "Deleted",
        description: "Program has been deleted",
      });
    },
  });

  const createPartner = useMutation({
    mutationFn: async (data: typeof partnerForm) => {
      const response = await apiRequest("POST", "/api/admin/partners", {
        ...data,
        order: parseInt(data.order) || 0,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/partners"] });
      setPartnerDialog({ open: false, mode: "add" });
      resetPartnerForm();
      toast({
        title: "Partner Created",
        description: "New partner has been added successfully",
      });
    },
  });

  const updatePartner = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: typeof partnerForm }) => {
      const response = await apiRequest("PATCH", `/api/admin/partners/${id}`, {
        ...data,
        order: parseInt(data.order) || 0,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/partners"] });
      setPartnerDialog({ open: false, mode: "add" });
      resetPartnerForm();
      toast({
        title: "Partner Updated",
        description: "Partner has been updated successfully",
      });
    },
  });

  const deletePartner = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiRequest("DELETE", `/api/admin/partners/${id}`, {});
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/partners"] });
      toast({
        title: "Deleted",
        description: "Partner has been deleted",
      });
    },
  });

  const updatePopupSettings = useMutation({
    mutationFn: async (data: typeof popupForm) => {
      const response = await apiRequest("PATCH", "/api/admin/popup-settings", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/popup-settings"] });
      toast({
        title: "Settings Updated",
        description: "Popup banner settings have been updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update popup settings",
        variant: "destructive",
      });
    },
  });

  const resetProgramForm = () => {
    setProgramForm({
      title: "",
      description: "",
      icon: "Rocket",
      gradient: "purple",
      isActive: true,
      order: "0",
      bannerImage: "",
      features: "",
    });
  };

  const resetPartnerForm = () => {
    setPartnerForm({
      name: "",
      logo: "",
      website: "",
      order: "0",
      isActive: true,
    });
  };

  const openEditProgram = (program: Program) => {
    setProgramForm({
      title: program.title,
      description: program.description,
      icon: program.icon,
      gradient: program.gradient as "purple" | "blue" | "teal" | "orange",
      isActive: program.isActive,
      order: program.order,
      bannerImage: program.bannerImage || "",
      features: program.features?.join(", ") || "",
    });
    setProgramDialog({ open: true, mode: "edit", program });
  };

  const openEditPartner = (partner: Partner) => {
    setPartnerForm({
      name: partner.name,
      logo: partner.logo || "",
      website: partner.website || "",
      order: String(partner.order),
      isActive: partner.isActive,
    });
    setPartnerDialog({ open: true, mode: "edit", partner });
  };

  const handleProgramSubmit = () => {
    const submitData = {
      ...programForm,
      features: programForm.features.split(",").map(f => f.trim()).filter(f => f.length > 0),
    };
    if (programDialog.mode === "add") {
      createProgram.mutate(submitData);
    } else if (programDialog.program) {
      updateProgram.mutate({ id: programDialog.program.id, data: submitData });
    }
  };

  const handlePartnerSubmit = () => {
    if (partnerDialog.mode === "add") {
      createPartner.mutate(partnerForm);
    } else if (partnerDialog.partner) {
      updatePartner.mutate({ id: partnerDialog.partner.id, data: partnerForm });
    }
  };

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
    } else if (deleteDialog.type === "program") {
      deleteProgram.mutate(deleteDialog.id);
    } else if (deleteDialog.type === "partner") {
      deletePartner.mutate(deleteDialog.id);
    }
    setDeleteDialog({ open: false, type: "bootcamp", id: "" });
  };

  const refreshAllData = () => {
    queryClient.invalidateQueries({ queryKey: ["/api/admin/dashboard"] });
    queryClient.invalidateQueries({ queryKey: ["/api/admin/bootcamp"] });
    queryClient.invalidateQueries({ queryKey: ["/api/admin/membership"] });
    queryClient.invalidateQueries({ queryKey: ["/api/admin/contact"] });
    queryClient.invalidateQueries({ queryKey: ["/api/admin/programs"] });
    queryClient.invalidateQueries({ queryKey: ["/api/admin/partners"] });
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
          <TabsList className="mb-6 grid w-full grid-cols-4 sm:grid-cols-7 lg:w-auto lg:inline-grid">
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
            <TabsTrigger value="programs" data-testid="tab-programs">
              <Layers className="mr-2 h-4 w-4" />
              Programs
            </TabsTrigger>
            <TabsTrigger value="partners" data-testid="tab-partners">
              <Handshake className="mr-2 h-4 w-4" />
              Partners
            </TabsTrigger>
            <TabsTrigger value="popup" data-testid="tab-popup">
              <BellRing className="mr-2 h-4 w-4" />
              Popup
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

            <div className="mt-6">
              <Card data-testid="card-bootcamp-poster">
                <CardHeader className="flex flex-row items-center justify-between gap-2">
                  <div>
                    <CardTitle>Bootcamp Event Poster</CardTitle>
                    <CardDescription>Current Startup Boot Camp promotional material</CardDescription>
                  </div>
                  <Image className="h-5 w-5 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div 
                    className="cursor-pointer hover-elevate rounded-lg overflow-hidden border border-border"
                    onClick={() => setShowPoster(true)}
                    data-testid="button-view-poster"
                  >
                    <img 
                      src={bootcampPoster} 
                      alt="Startup Boot Camp Poster" 
                      className="w-full h-auto max-h-[400px] object-contain bg-muted"
                    />
                  </div>
                  <p className="text-sm text-muted-foreground mt-3 text-center">
                    Click to view full size
                  </p>
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

          <TabsContent value="programs">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between gap-2">
                <div>
                  <CardTitle>Programs Management</CardTitle>
                  <CardDescription>
                    Add, edit, or remove programs displayed on the website
                  </CardDescription>
                </div>
                <Button
                  onClick={() => {
                    resetProgramForm();
                    setProgramDialog({ open: true, mode: "add" });
                  }}
                  data-testid="button-add-program"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Program
                </Button>
              </CardHeader>
              <CardContent>
                {programsQuery.isLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                ) : programsQuery.data?.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No programs yet. Add your first program!
                  </div>
                ) : (
                  <ScrollArea className="h-[500px]">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Order</TableHead>
                          <TableHead>Title</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead>Icon</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {programsQuery.data?.map((program) => (
                          <TableRow key={program.id} data-testid={`row-program-${program.id}`}>
                            <TableCell>{program.order}</TableCell>
                            <TableCell className="font-medium">{program.title}</TableCell>
                            <TableCell className="max-w-[250px] truncate">{program.description}</TableCell>
                            <TableCell>{program.icon}</TableCell>
                            <TableCell>
                              {program.isActive ? (
                                <Badge className="bg-green-500/20 text-green-600 dark:text-green-400">Active</Badge>
                              ) : (
                                <Badge className="bg-gray-500/20 text-gray-600 dark:text-gray-400">Inactive</Badge>
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => openEditProgram(program)}
                                  data-testid={`button-edit-program-${program.id}`}
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => setDeleteDialog({ open: true, type: "program", id: program.id })}
                                  data-testid={`button-delete-program-${program.id}`}
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

          <TabsContent value="partners">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between gap-2">
                <div>
                  <CardTitle>Partner Organizations</CardTitle>
                  <CardDescription>
                    Manage partner logos and display order
                  </CardDescription>
                </div>
                <Button
                  onClick={() => {
                    resetPartnerForm();
                    setPartnerDialog({ open: true, mode: "add" });
                  }}
                  data-testid="button-add-partner"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Partner
                </Button>
              </CardHeader>
              <CardContent>
                {partnersQuery.isLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                ) : partnersQuery.data?.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No partners yet. Add your first partner!
                  </div>
                ) : (
                  <ScrollArea className="h-[500px]">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Order</TableHead>
                          <TableHead>Logo</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Website</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {partnersQuery.data?.map((partner) => (
                          <TableRow key={partner.id} data-testid={`row-partner-${partner.id}`}>
                            <TableCell>{partner.order}</TableCell>
                            <TableCell>
                              {partner.logo ? (
                                <img 
                                  src={partner.logo} 
                                  alt={partner.name} 
                                  className="h-10 w-auto object-contain"
                                />
                              ) : (
                                <span className="text-muted-foreground text-sm">No logo</span>
                              )}
                            </TableCell>
                            <TableCell className="font-medium">{partner.name}</TableCell>
                            <TableCell className="max-w-[200px] truncate">
                              {partner.website || "—"}
                            </TableCell>
                            <TableCell>
                              {partner.isActive ? (
                                <Badge className="bg-green-500/20 text-green-600 dark:text-green-400">Active</Badge>
                              ) : (
                                <Badge className="bg-gray-500/20 text-gray-600 dark:text-gray-400">Inactive</Badge>
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => openEditPartner(partner)}
                                  data-testid={`button-edit-partner-${partner.id}`}
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => setDeleteDialog({ open: true, type: "partner", id: partner.id })}
                                  data-testid={`button-delete-partner-${partner.id}`}
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

          <TabsContent value="popup">
            <Card>
              <CardHeader>
                <CardTitle>Popup Banner Settings</CardTitle>
                <CardDescription>
                  Control the popup banner that appears when visitors open the website
                </CardDescription>
              </CardHeader>
              <CardContent>
                {popupSettingsQuery.isLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <Label className="text-base font-medium">Enable Popup</Label>
                        <p className="text-sm text-muted-foreground">
                          Show the popup banner when visitors open the website
                        </p>
                      </div>
                      <Switch
                        checked={popupForm.isEnabled}
                        onCheckedChange={(checked) => setPopupForm({ ...popupForm, isEnabled: checked })}
                        data-testid="switch-popup-enabled"
                      />
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="popup-title">Popup Title</Label>
                        <Input
                          id="popup-title"
                          value={popupForm.title}
                          onChange={(e) => setPopupForm({ ...popupForm, title: e.target.value })}
                          placeholder="Startup Boot Camp"
                          data-testid="input-popup-title"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="popup-delay">Delay (seconds)</Label>
                        <Input
                          id="popup-delay"
                          type="number"
                          min="0"
                          max="30"
                          value={popupForm.delaySeconds}
                          onChange={(e) => setPopupForm({ ...popupForm, delaySeconds: e.target.value })}
                          placeholder="1"
                          data-testid="input-popup-delay"
                        />
                        <p className="text-xs text-muted-foreground">
                          How many seconds to wait before showing the popup
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="popup-button-text">Button Text</Label>
                        <Input
                          id="popup-button-text"
                          value={popupForm.buttonText}
                          onChange={(e) => setPopupForm({ ...popupForm, buttonText: e.target.value })}
                          placeholder="Register Now"
                          data-testid="input-popup-button-text"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="popup-button-link">Button Link</Label>
                        <Input
                          id="popup-button-link"
                          value={popupForm.buttonLink}
                          onChange={(e) => setPopupForm({ ...popupForm, buttonLink: e.target.value })}
                          placeholder="/register"
                          data-testid="input-popup-button-link"
                        />
                      </div>
                    </div>

                    <ImageUpload
                      value={popupForm.bannerImage}
                      onChange={(url) => setPopupForm({ ...popupForm, bannerImage: url })}
                      label="Banner Image"
                      placeholder="Upload or enter image URL"
                      data-testid="input-popup-banner-image"
                    />

                    <div className="flex items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <Label className="text-base font-medium">Show Once Per Session</Label>
                        <p className="text-sm text-muted-foreground">
                          Only show the popup once per browser session (won't show again until browser is closed)
                        </p>
                      </div>
                      <Switch
                        checked={popupForm.showOnce}
                        onCheckedChange={(checked) => setPopupForm({ ...popupForm, showOnce: checked })}
                        data-testid="switch-popup-show-once"
                      />
                    </div>

                    <Button 
                      onClick={() => updatePopupSettings.mutate(popupForm)}
                      disabled={updatePopupSettings.isPending}
                      className="w-full sm:w-auto"
                      data-testid="button-save-popup-settings"
                    >
                      {updatePopupSettings.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Save Settings
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <Dialog open={!!selectedBootcamp} onOpenChange={() => setSelectedBootcamp(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Bootcamp Registration Details</DialogTitle>
            <DialogDescription>
              Full details of the bootcamp registration
            </DialogDescription>
          </DialogHeader>
          {selectedBootcamp && (
            <ScrollArea className="flex-1 pr-4">
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
              {selectedBootcamp.paymentProof && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Payment Proof / Source Document</p>
                  <div className="border rounded-lg overflow-hidden bg-muted/30">
                    <img 
                      src={selectedBootcamp.paymentProof} 
                      alt="Payment Proof" 
                      className="w-full max-h-96 object-contain"
                      data-testid="img-payment-proof"
                    />
                  </div>
                  <a 
                    href={selectedBootcamp.paymentProof} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 mt-2"
                    data-testid="link-view-full-image"
                  >
                    <Eye className="h-4 w-4" />
                    View Full Image
                  </a>
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-muted-foreground">Registration Date</p>
                <p className="text-base" data-testid="text-detail-date">
                  {format(new Date(selectedBootcamp.createdAt), "MMMM d, yyyy 'at' h:mm a")}
                </p>
              </div>
            </div>
            </ScrollArea>
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

      <Dialog open={showPoster} onOpenChange={setShowPoster}>
        <DialogContent className="max-w-3xl p-2">
          <DialogHeader className="sr-only">
            <DialogTitle>Bootcamp Event Poster</DialogTitle>
            <DialogDescription>Full size view of the Startup Boot Camp poster</DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-center">
            <img 
              src={bootcampPoster} 
              alt="Startup Boot Camp Poster" 
              className="w-full h-auto max-h-[85vh] object-contain rounded-lg"
              data-testid="img-poster-fullsize"
            />
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={programDialog.open} onOpenChange={(open) => {
        if (!open) {
          setProgramDialog({ open: false, mode: "add" });
          resetProgramForm();
        }
      }}>
        <DialogContent className="max-w-lg max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>{programDialog.mode === "add" ? "Add New Program" : "Edit Program"}</DialogTitle>
            <DialogDescription>
              {programDialog.mode === "add" 
                ? "Create a new program to display on the website"
                : "Update the program details"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4 overflow-y-auto flex-1 pr-2">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={programForm.title}
                onChange={(e) => setProgramForm({ ...programForm, title: e.target.value })}
                placeholder="e.g., Startup Boot Camp"
                data-testid="input-program-title"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={programForm.description}
                onChange={(e) => setProgramForm({ ...programForm, description: e.target.value })}
                placeholder="Brief description of the program..."
                data-testid="input-program-description"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="icon">Icon</Label>
                <Select
                  value={programForm.icon}
                  onValueChange={(value) => setProgramForm({ ...programForm, icon: value })}
                >
                  <SelectTrigger data-testid="select-program-icon">
                    <SelectValue placeholder="Select icon" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Rocket">Rocket</SelectItem>
                    <SelectItem value="Building2">Building</SelectItem>
                    <SelectItem value="Users">Users</SelectItem>
                    <SelectItem value="Briefcase">Briefcase</SelectItem>
                    <SelectItem value="GraduationCap">Graduation Cap</SelectItem>
                    <SelectItem value="Lightbulb">Lightbulb</SelectItem>
                    <SelectItem value="Target">Target</SelectItem>
                    <SelectItem value="Award">Award</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="gradient">Color Theme</Label>
                <Select
                  value={programForm.gradient}
                  onValueChange={(value: "purple" | "blue" | "teal" | "orange") => setProgramForm({ ...programForm, gradient: value })}
                >
                  <SelectTrigger data-testid="select-program-gradient">
                    <SelectValue placeholder="Select color" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="purple">Purple</SelectItem>
                    <SelectItem value="blue">Blue</SelectItem>
                    <SelectItem value="teal">Teal</SelectItem>
                    <SelectItem value="orange">Orange</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="order">Display Order</Label>
              <Input
                id="order"
                type="number"
                value={programForm.order}
                onChange={(e) => setProgramForm({ ...programForm, order: e.target.value })}
                placeholder="0"
                data-testid="input-program-order"
              />
            </div>
            <ImageUpload
              value={programForm.bannerImage}
              onChange={(url) => setProgramForm({ ...programForm, bannerImage: url })}
              label="Banner Image (optional)"
              placeholder="Upload or enter image URL"
              data-testid="input-program-banner"
            />
            <div className="grid gap-2">
              <Label htmlFor="features">Features (comma-separated, optional)</Label>
              <Input
                id="features"
                value={programForm.features}
                onChange={(e) => setProgramForm({ ...programForm, features: e.target.value })}
                placeholder="Feature 1, Feature 2, Feature 3"
                data-testid="input-program-features"
              />
            </div>
            <div className="flex items-center gap-2">
              <Switch
                id="isActive"
                checked={programForm.isActive}
                onCheckedChange={(checked) => setProgramForm({ ...programForm, isActive: checked })}
                data-testid="switch-program-active"
              />
              <Label htmlFor="isActive">Active (visible on website)</Label>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setProgramDialog({ open: false, mode: "add" });
                resetProgramForm();
              }}
              data-testid="button-cancel-program"
            >
              Cancel
            </Button>
            <Button
              onClick={handleProgramSubmit}
              disabled={!programForm.title || !programForm.description || createProgram.isPending || updateProgram.isPending}
              data-testid="button-save-program"
            >
              {(createProgram.isPending || updateProgram.isPending) && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {programDialog.mode === "add" ? "Create Program" : "Save Changes"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={partnerDialog.open} onOpenChange={(open) => {
        if (!open) {
          setPartnerDialog({ open: false, mode: "add" });
          resetPartnerForm();
        }
      }}>
        <DialogContent className="max-w-lg max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>{partnerDialog.mode === "add" ? "Add New Partner" : "Edit Partner"}</DialogTitle>
            <DialogDescription>
              {partnerDialog.mode === "add" 
                ? "Add a new partner organization"
                : "Update the partner details"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4 overflow-y-auto flex-1 pr-2">
            <div className="grid gap-2">
              <Label htmlFor="partnerName">Name</Label>
              <Input
                id="partnerName"
                value={partnerForm.name}
                onChange={(e) => setPartnerForm({ ...partnerForm, name: e.target.value })}
                placeholder="Partner Organization Name"
                data-testid="input-partner-name"
              />
            </div>
            <ImageUpload
              value={partnerForm.logo}
              onChange={(url) => setPartnerForm({ ...partnerForm, logo: url })}
              label="Logo"
              placeholder="Upload or enter logo URL"
              data-testid="input-partner-logo"
            />
            <div className="grid gap-2">
              <Label htmlFor="partnerWebsite">Website URL (optional)</Label>
              <Input
                id="partnerWebsite"
                value={partnerForm.website}
                onChange={(e) => setPartnerForm({ ...partnerForm, website: e.target.value })}
                placeholder="https://example.com"
                data-testid="input-partner-website"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="partnerOrder">Display Order (lower = first)</Label>
              <Input
                id="partnerOrder"
                type="number"
                value={partnerForm.order}
                onChange={(e) => setPartnerForm({ ...partnerForm, order: e.target.value })}
                placeholder="0"
                data-testid="input-partner-order"
              />
            </div>
            <div className="flex items-center gap-2">
              <Switch
                id="partnerIsActive"
                checked={partnerForm.isActive}
                onCheckedChange={(checked) => setPartnerForm({ ...partnerForm, isActive: checked })}
                data-testid="switch-partner-active"
              />
              <Label htmlFor="partnerIsActive">Active (visible on website)</Label>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setPartnerDialog({ open: false, mode: "add" });
                resetPartnerForm();
              }}
              data-testid="button-cancel-partner"
            >
              Cancel
            </Button>
            <Button
              onClick={handlePartnerSubmit}
              disabled={!partnerForm.name || createPartner.isPending || updatePartner.isPending}
              data-testid="button-save-partner"
            >
              {(createPartner.isPending || updatePartner.isPending) && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {partnerDialog.mode === "add" ? "Add Partner" : "Save Changes"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
