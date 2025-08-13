import { useRef, useState } from "react";
import BpmnModeler from "bpmn-js/lib/Modeler";
import { useToast } from "@/hooks/use-toast";
import { BpmnPalette } from "@/components/modeler/BpmnPalette";
import { BpmnToolbar } from "@/components/modeler/BpmnToolbar";
import { BpmnCanvas } from "@/components/modeler/BpmnCanvas";

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
  const modelerRef = useRef<BpmnModeler | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const { toast } = useToast();

  const handleModelerLoad = () => {
    setIsLoaded(true);
    toast({
      title: "Modeler Ready",
      description: "BPMN 2.0 Modeler has been initialized successfully."
    });
  };

  const handleModelerError = (error: string) => {
    toast({
      title: "Error",
      description: error,
      variant: "destructive"
    });
  };

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

  const handleValidate = () => {
    if (!modelerRef.current) return;
    
    // Basic BPMN validation
    modelerRef.current.saveXML({ format: true }).then(({ xml }) => {
      // Check for basic BPMN structure
      const hasDefinitions = xml.includes('<bpmn:definitions');
      const hasProcess = xml.includes('<bpmn:process');
      const hasStartEvent = xml.includes('startEvent');
      const hasEndEvent = xml.includes('endEvent');
      
      if (hasDefinitions && hasProcess && hasStartEvent && hasEndEvent) {
        toast({
          title: "Validation Successful",
          description: "BPMN diagram structure is valid."
        });
      } else {
        toast({
          title: "Validation Failed",
          description: "BPMN diagram is missing required elements.",
          variant: "destructive"
        });
      }
    }).catch(() => {
      toast({
        title: "Validation Error",
        description: "Failed to validate the diagram.",
        variant: "destructive"
      });
    });
  };

  return (
    <div className="h-full flex flex-col">
      <BpmnToolbar
        isLoaded={isLoaded}
        onNew={handleNewDiagram}
        onUpload={() => fileInputRef.current?.click()}
        onDownload={handleDownload}
        onSave={handleSave}
        onValidate={handleValidate}
      />

      <div className="flex-1 flex">
        <BpmnPalette />
        
        <BpmnCanvas
          isLoaded={isLoaded}
          modelerRef={modelerRef}
          onLoad={handleModelerLoad}
          onError={handleModelerError}
          defaultXml={DEFAULT_BPMN_XML}
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