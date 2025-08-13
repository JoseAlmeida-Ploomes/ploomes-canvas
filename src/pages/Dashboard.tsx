import { useState } from "react";
import { Header } from "@/components/Header";
import { ProjectCard } from "@/components/ProjectCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Activity, 
  TrendingUp, 
  Users, 
  FileText, 
  Filter,
  LayoutGrid,
  List
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// Mock data
const mockProjects = [
  {
    id: "1",
    name: "CRM Onboarding Flow Redesign",
    status: "ready" as const,
    client_alias: "ACME Corp",
    updated_at: "2024-01-15T10:30:00Z",
    created_by: "Sarah Johnson",
    artifacts_count: 3,
    has_asis: true,
    has_tobe: true,
  },
  {
    id: "2", 
    name: "Sales Pipeline Automation",
    status: "processing" as const,
    client_alias: "TechStart Inc",
    updated_at: "2024-01-14T15:45:00Z",
    created_by: "Mike Chen",
    artifacts_count: 2,
    has_asis: true,
    has_tobe: false,
  },
  {
    id: "3",
    name: "Customer Support Integration",
    status: "draft" as const,
    client_alias: "GlobalTech",
    updated_at: "2024-01-13T09:15:00Z", 
    created_by: "Emma Davis",
    artifacts_count: 1,
    has_asis: false,
    has_tobe: false,
  },
  {
    id: "4",
    name: "Lead Qualification Process",
    status: "error" as const,
    client_alias: "InnovateLab",
    updated_at: "2024-01-12T16:20:00Z",
    created_by: "Alex Rivera",
    artifacts_count: 1,
    has_asis: true,
    has_tobe: false,
  }
];

const stats = [
  {
    title: "Active Projects",
    value: "12",
    change: "+2 this week",
    icon: Activity,
    trend: "up"
  },
  {
    title: "Completed Mappings",
    value: "47",
    change: "+8 this month",
    icon: FileText,
    trend: "up"
  },
  {
    title: "Team Members",
    value: "8",
    change: "No change",
    icon: Users,
    trend: "neutral"
  },
  {
    title: "Success Rate",
    value: "94%",
    change: "+3% this month",
    icon: TrendingUp,
    trend: "up"
  }
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("updated");

  const handleNewProject = () => {
    navigate("/projects/new");
  };

  const handleOpenProject = (id: string) => {
    navigate(`/projects/${id}`);
  };

  const filteredProjects = mockProjects.filter(project => 
    statusFilter === "all" || project.status === statusFilter
  );

  return (
    <div className="flex-1 space-y-6 p-6">
      <Header 
        title="Dashboard" 
        onNewProject={handleNewProject}
      />

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="transition-all hover:shadow-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <p className={`text-xs mt-1 ${
                  stat.trend === 'up' ? 'text-success' : 
                  stat.trend === 'down' ? 'text-destructive' : 
                  'text-muted-foreground'
                }`}>
                  {stat.change}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Projects Section */}
      <div className="space-y-4">
        {/* Section Header with Controls */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Recent Projects</h2>
            <p className="text-muted-foreground">
              Manage your BPMN mapping projects and workflows
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Filters */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="ready">Ready</SelectItem>
                <SelectItem value="error">Error</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="updated">Last Updated</SelectItem>
                <SelectItem value="created">Date Created</SelectItem>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="status">Status</SelectItem>
              </SelectContent>
            </Select>

            {/* View Mode Toggle */}
            <div className="flex border rounded-lg">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="rounded-r-none"
              >
                <LayoutGrid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="rounded-l-none"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Status Filter Badges */}
        {statusFilter !== "all" && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Filtered by:</span>
            <Badge variant="secondary" className="capitalize">
              {statusFilter}
              <Button
                variant="ghost"
                size="sm"
                className="ml-1 h-auto p-0 text-xs"
                onClick={() => setStatusFilter("all")}
              >
                ×
              </Button>
            </Badge>
          </div>
        )}

        {/* Projects Grid/List */}
        {filteredProjects.length > 0 ? (
          <div className={
            viewMode === "grid" 
              ? "grid gap-6 md:grid-cols-2 lg:grid-cols-3" 
              : "space-y-4"
          }>
            {filteredProjects.map((project) => (
              <div key={project.id} className="animate-fade-in">
                <ProjectCard
                  project={project}
                  onOpen={handleOpenProject}
                  onEdit={(id) => console.log("Edit project:", id)}
                  onArchive={(id) => console.log("Archive project:", id)}
                />
              </div>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <div className="max-w-md mx-auto">
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No projects found
              </h3>
              <p className="text-muted-foreground mb-4">
                {statusFilter !== "all" 
                  ? `No projects with status "${statusFilter}". Try adjusting your filters.`
                  : "Get started by creating your first BPMN mapping project."
                }
              </p>
              {statusFilter !== "all" ? (
                <Button 
                  variant="outline" 
                  onClick={() => setStatusFilter("all")}
                >
                  Clear Filters
                </Button>
              ) : (
                <Button onClick={handleNewProject}>
                  Create New Project
                </Button>
              )}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}