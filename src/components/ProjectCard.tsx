import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { 
  Calendar, 
  User, 
  MoreVertical, 
  GitBranch, 
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader2
} from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

interface ProjectCardProps {
  project: {
    id: string;
    name: string;
    status: 'draft' | 'processing' | 'ready' | 'error';
    client_alias: string;
    updated_at: string;
    created_by: string;
    artifacts_count: number;
    has_asis: boolean;
    has_tobe: boolean;
  };
  onOpen: (id: string) => void;
  onEdit?: (id: string) => void;
  onArchive?: (id: string) => void;
}

const statusConfig = {
  draft: {
    label: "Draft",
    icon: FileText,
    variant: "secondary" as const,
    className: "text-muted-foreground"
  },
  processing: {
    label: "Processing",
    icon: Loader2,
    variant: "default" as const,
    className: "text-warning animate-spin"
  },
  ready: {
    label: "Ready",
    icon: CheckCircle2,
    variant: "default" as const,
    className: "text-success"
  },
  error: {
    label: "Error",
    icon: AlertCircle,
    variant: "destructive" as const,
    className: "text-destructive"
  }
};

export function ProjectCard({ project, onOpen, onEdit, onArchive }: ProjectCardProps) {
  const status = statusConfig[project.status];
  const StatusIcon = status.icon;

  return (
    <Card className="group hover:shadow-card transition-all duration-300 cursor-pointer bg-gradient-subtle border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">
              {project.name}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant={status.variant} className="text-xs">
                <StatusIcon className={`w-3 h-3 mr-1 ${status.className}`} />
                {status.label}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {project.client_alias}
              </span>
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onOpen(project.id)}>
                Open Project
              </DropdownMenuItem>
              {onEdit && (
                <DropdownMenuItem onClick={() => onEdit(project.id)}>
                  Edit Details
                </DropdownMenuItem>
              )}
              {onArchive && (
                <DropdownMenuItem 
                  onClick={() => onArchive(project.id)}
                  className="text-destructive"
                >
                  Archive
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="py-3">
        <div className="space-y-3">
          {/* Artifacts Info */}
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <GitBranch className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">
                {project.artifacts_count} versions
              </span>
            </div>
            <div className="flex gap-2">
              {project.has_asis && (
                <Badge variant="outline" className="text-xs">As-Is</Badge>
              )}
              {project.has_tobe && (
                <Badge variant="outline" className="text-xs">To-Be</Badge>
              )}
            </div>
          </div>

          {/* Metadata */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <User className="w-3 h-3" />
              <span>{project.created_by}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{new Date(project.updated_at).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-3">
        <Button 
          onClick={() => onOpen(project.id)}
          className="w-full"
          variant={project.status === 'ready' ? 'default' : 'outline'}
        >
          {project.status === 'ready' ? 'Open Project' : 'Continue Work'}
        </Button>
      </CardFooter>
    </Card>
  );
}