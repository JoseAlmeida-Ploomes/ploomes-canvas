import { useState } from "react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Upload, 
  FileText, 
  CheckCircle2, 
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Save
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface ProjectForm {
  name: string;
  client_alias: string;
  description: string;
  template: string;
}

interface UploadedFile {
  id: string;
  name: string;
  type: string;
  size: number;
  status: 'uploading' | 'ready' | 'error';
  required: boolean;
}

const documentTypes = [
  { value: "transcription", label: "Transcription", required: true, description: "Meeting transcription following standard agenda" },
  { value: "scope", label: "Project Scope", required: false, description: "Project scope document (required for To-Be generation)" },
  { value: "proposal", label: "Proposal", required: false, description: "Commercial proposal or project specification" },
  { value: "contract", label: "Contract", required: false, description: "Service contract or agreement" },
  { value: "business_rules", label: "Business Rules", required: false, description: "Business rules and requirements document" },
  { value: "other", label: "Other", required: false, description: "Additional supporting documents" }
];

export default function NewProject() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  
  const [projectForm, setProjectForm] = useState<ProjectForm>({
    name: "",
    client_alias: "",
    description: "",
    template: "standard"
  });

  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

  const handleProjectFormChange = (field: keyof ProjectForm, value: string) => {
    setProjectForm(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (type: string, files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];
    const newFile: UploadedFile = {
      id: `${Date.now()}-${Math.random()}`,
      name: file.name,
      type,
      size: file.size,
      status: 'uploading',
      required: documentTypes.find(dt => dt.value === type)?.required || false
    };

    setUploadedFiles(prev => [...prev, newFile]);

    // Simulate upload
    setTimeout(() => {
      setUploadedFiles(prev => 
        prev.map(f => f.id === newFile.id ? { ...f, status: 'ready' } : f)
      );
    }, 2000);
  };

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const validateStep1 = () => {
    return projectForm.name.trim() !== "" && projectForm.client_alias.trim() !== "";
  };

  const validateStep2 = () => {
    const hasRequiredFiles = documentTypes
      .filter(dt => dt.required)
      .every(dt => uploadedFiles.some(f => f.type === dt.value && f.status === 'ready'));
    
    return hasRequiredFiles;
  };

  const handleNext = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    } else if (currentStep === 2 && validateStep2()) {
      setCurrentStep(3);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleCreateProject = async () => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Project created successfully",
        description: "Your project has been created and is ready for document processing.",
      });
      
      navigate("/projects/1/inputs");
    } catch (error) {
      toast({
        title: "Error creating project",
        description: "There was a problem creating your project. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="flex-1 space-y-6 p-6">
      <Header title="New Project" showSearch={false} />

      <div className="max-w-4xl mx-auto">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-foreground">Create New Project</h2>
            <Badge variant="outline" className="text-sm">
              Step {currentStep} of 3
            </Badge>
          </div>
          <Progress value={(currentStep / 3) * 100} className="h-2" />
          <div className="flex justify-between text-sm text-muted-foreground mt-2">
            <span className={currentStep >= 1 ? "text-primary font-medium" : ""}>
              Project Details
            </span>
            <span className={currentStep >= 2 ? "text-primary font-medium" : ""}>
              Document Upload
            </span>
            <span className={currentStep >= 3 ? "text-primary font-medium" : ""}>
              Review & Create
            </span>
          </div>
        </div>

        {/* Step 1: Project Details */}
        {currentStep === 1 && (
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Project Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Project Name *</Label>
                  <Input
                    id="name"
                    value={projectForm.name}
                    onChange={(e) => handleProjectFormChange("name", e.target.value)}
                    placeholder="e.g., CRM Onboarding Flow Redesign"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="client">Client Alias *</Label>
                  <Input
                    id="client"
                    value={projectForm.client_alias}
                    onChange={(e) => handleProjectFormChange("client_alias", e.target.value)}
                    placeholder="e.g., ACME Corp"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={projectForm.description}
                  onChange={(e) => handleProjectFormChange("description", e.target.value)}
                  placeholder="Brief description of the project goals and scope..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="template">Project Template</Label>
                <Select 
                  value={projectForm.template} 
                  onValueChange={(value) => handleProjectFormChange("template", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard BPMN Mapping</SelectItem>
                    <SelectItem value="sales">Sales Process Optimization</SelectItem>
                    <SelectItem value="support">Support Flow Design</SelectItem>
                    <SelectItem value="onboarding">Customer Onboarding</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Document Upload */}
        {currentStep === 2 && (
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Document Upload
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4">
                {documentTypes.map((docType) => (
                  <div key={docType.value} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Label className="font-medium">{docType.label}</Label>
                          {docType.required && (
                            <Badge variant="destructive" className="text-xs">Required</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{docType.description}</p>
                      </div>
                    </div>

                    {/* File Upload Input */}
                    <div className="mt-3">
                      <input
                        type="file"
                        id={`file-${docType.value}`}
                        className="hidden"
                        onChange={(e) => handleFileUpload(docType.value, e.target.files)}
                        accept=".pdf,.doc,.docx,.txt"
                      />
                      <label
                        htmlFor={`file-${docType.value}`}
                        className="inline-flex items-center gap-2 px-4 py-2 border border-border rounded-md cursor-pointer hover:bg-muted transition-colors"
                      >
                        <Upload className="w-4 h-4" />
                        Choose File
                      </label>
                    </div>

                    {/* Uploaded Files for this type */}
                    <div className="mt-3 space-y-2">
                      {uploadedFiles
                        .filter(f => f.type === docType.value)
                        .map((file) => (
                          <div key={file.id} className="flex items-center justify-between p-2 bg-muted rounded">
                            <div className="flex items-center gap-2">
                              {file.status === 'ready' && <CheckCircle2 className="w-4 h-4 text-success" />}
                              {file.status === 'uploading' && <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />}
                              {file.status === 'error' && <AlertTriangle className="w-4 h-4 text-destructive" />}
                              <span className="text-sm">{file.name}</span>
                              <span className="text-xs text-muted-foreground">
                                ({formatFileSize(file.size)})
                              </span>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFile(file.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              Remove
                            </Button>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Upload Summary */}
              <div className="bg-muted/50 rounded-lg p-4">
                <h4 className="font-medium mb-2">Upload Summary</h4>
                <div className="text-sm space-y-1">
                  <p>Total files: {uploadedFiles.length}</p>
                  <p>Required files: {uploadedFiles.filter(f => f.required && f.status === 'ready').length} / {documentTypes.filter(dt => dt.required).length}</p>
                  <p>Ready for processing: {uploadedFiles.filter(f => f.status === 'ready').length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Review */}
        {currentStep === 3 && (
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                Review & Create
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Project Summary */}
              <div className="space-y-4">
                <h4 className="font-medium text-foreground">Project Details</h4>
                <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Name:</span>
                      <span className="ml-2 font-medium">{projectForm.name}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Client:</span>
                      <span className="ml-2 font-medium">{projectForm.client_alias}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-muted-foreground">Template:</span>
                      <span className="ml-2 font-medium capitalize">{projectForm.template}</span>
                    </div>
                  </div>
                  {projectForm.description && (
                    <div className="text-sm pt-2 border-t">
                      <span className="text-muted-foreground">Description:</span>
                      <p className="mt-1">{projectForm.description}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Files Summary */}
              <div className="space-y-4">
                <h4 className="font-medium text-foreground">Uploaded Documents</h4>
                <div className="space-y-2">
                  {uploadedFiles.map((file) => {
                    const docType = documentTypes.find(dt => dt.value === file.type);
                    return (
                      <div key={file.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <CheckCircle2 className="w-4 h-4 text-success" />
                          <div>
                            <p className="font-medium text-sm">{docType?.label}</p>
                            <p className="text-xs text-muted-foreground">{file.name}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                          {file.required && (
                            <Badge variant="outline" className="text-xs">Required</Badge>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Next Steps */}
              <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                <h4 className="font-medium text-primary mb-2">Next Steps</h4>
                <ul className="text-sm space-y-1 text-primary/80">
                  <li>• Project will be created and documents processed</li>
                  <li>• You'll be redirected to the document preprocessing page</li>
                  <li>• Initial token estimation and chunking will be performed</li>
                  <li>• Ready to generate As-Is BPMN mapping via n8n workflow</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between pt-6">
          <div className="flex gap-3">
            {currentStep > 1 && (
              <Button variant="outline" onClick={handleBack}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            )}
            <Button variant="outline" onClick={() => navigate("/")}>
              Cancel
            </Button>
          </div>

          <div className="flex gap-3">
            {currentStep < 3 ? (
              <Button 
                onClick={handleNext}
                disabled={
                  (currentStep === 1 && !validateStep1()) ||
                  (currentStep === 2 && !validateStep2())
                }
              >
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button 
                onClick={handleCreateProject}
                disabled={isLoading}
                className="min-w-32"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Create Project
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}