import { useEffect, useRef, useState } from "react";
import BpmnModeler from "bpmn-js/lib/Modeler";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Download, Save, FileX } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Default BPMN 2.0 XML template
const DEFAULT_BPMN_XML = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" id="Definitions_1" targetNamespace="http://bpmn.io/schema/bpmn" exporter="bpmn-js" exporterVersion="17.11.1">
  <bpmn:process id="Process_1" isExecutable="true">
    <bpmn:startEvent id="StartEvent_1" />
  </bpmn:process>
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1">
      <bpmndi:BPMNShape id="_BPMNShape_StartEvent_2" bpmnElement="StartEvent_1">
        <dc:Bounds x="179" y="79" width="36" height="36" />
      </bpmndi:BPMNShape>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</bpmn:definitions>`;

export default function Modeler() {
  const containerRef = useRef<HTMLDivElement>(null);
  const modelerRef = useRef<BpmnModeler | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize BPMN Modeler
    const modeler = new BpmnModeler({
      container: containerRef.current,
      keyboard: {
        bindTo: window
      }
    });

    modelerRef.current = modeler;

    // Load default diagram
    modeler.importXML(DEFAULT_BPMN_XML).then(() => {
      setIsLoaded(true);
      toast({
        title: "Modeler Ready",
        description: "BPMN 2.0 Modeler has been initialized successfully."
      });
    }).catch((err) => {
      console.error('Error loading default diagram:', err);
      toast({
        title: "Error",
        description: "Failed to initialize the modeler.",
        variant: "destructive"
      });
    });

    return () => {
      modeler.destroy();
    };
  }, [toast]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !modelerRef.current) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const xml = e.target?.result as string;
      modelerRef.current?.importXML(xml).then(() => {
        toast({
          title: "File Loaded",
          description: `Successfully loaded ${file.name}`
        });
      }).catch((err) => {
        console.error('Error importing XML:', err);
        toast({
          title: "Import Error",
          description: "Failed to import the BPMN file. Please check if it's a valid BPMN 2.0 XML.",
          variant: "destructive"
        });
      });
    };
    reader.readAsText(file);
  };

  const handleDownload = async () => {
    if (!modelerRef.current) return;

    try {
      const { xml } = await modelerRef.current.saveXML({ format: true });
      const blob = new Blob([xml], { type: 'application/xml' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'diagram.bpmn';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Downloaded",
        description: "BPMN diagram has been downloaded successfully."
      });
    } catch (err) {
      console.error('Error exporting XML:', err);
      toast({
        title: "Export Error",
        description: "Failed to export the diagram.",
        variant: "destructive"
      });
    }
  };

  const handleSave = async () => {
    if (!modelerRef.current) return;

    try {
      const { xml } = await modelerRef.current.saveXML({ format: true });
      // Here you would typically save to your backend
      console.log('Saving XML:', xml);
      
      toast({
        title: "Saved",
        description: "Diagram has been saved successfully."
      });
    } catch (err) {
      console.error('Error saving:', err);
      toast({
        title: "Save Error",
        description: "Failed to save the diagram.",
        variant: "destructive"
      });
    }
  };

  const handleNewDiagram = () => {
    if (!modelerRef.current) return;

    modelerRef.current.importXML(DEFAULT_BPMN_XML).then(() => {
      toast({
        title: "New Diagram",
        description: "Created a new BPMN diagram."
      });
    }).catch((err) => {
      console.error('Error creating new diagram:', err);
    });
  };

  return (
    <div className="h-full flex flex-col">
      <div className="border-b border-border bg-background p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">BPMN Modeler</h1>
            <p className="text-sm text-muted-foreground">Create and edit BPMN 2.0 diagrams</p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleNewDiagram}
              disabled={!isLoaded}
            >
              <FileX className="w-4 h-4 mr-2" />
              New
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => fileInputRef.current?.click()}
              disabled={!isLoaded}
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleDownload}
              disabled={!isLoaded}
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
            
            <Button 
              size="sm" 
              onClick={handleSave}
              disabled={!isLoaded}
            >
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 relative">
        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-10">
            <Card className="w-96">
              <CardHeader>
                <CardTitle>Loading Modeler</CardTitle>
                <CardDescription>
                  Initializing BPMN 2.0 modeler...
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        
        <div 
          ref={containerRef} 
          className="w-full h-full bg-background"
          style={{ minHeight: '600px' }}
        />
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".bpmn,.xml"
        onChange={handleFileUpload}
        className="hidden"
      />
    </div>
  );
}