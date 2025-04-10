
import React, { useState } from "react";
import { BookOpen, X, Palette, Code, Image, FileType, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export interface ColorItem {
  name: string;
  value: string;
  description?: string;
}

export interface FontItem {
  name: string;
  family: string;
  weights: string[];
  source?: string;
}

export interface AssetItem {
  name: string;
  type: "icon" | "image" | "logo";
  source: string;
  description?: string;
}

export interface CodeSnippet {
  title: string;
  language: string;
  code: string;
  description?: string;
}

export interface FrontEndGuideProps {
  title: string;
  description?: string;
  colors: ColorItem[];
  fonts: FontItem[];
  assets: AssetItem[];
  buildSteps: string[];
  codeSnippets?: CodeSnippet[];
  additionalNotes?: string;
}

const FrontEndGuide: React.FC<FrontEndGuideProps> = ({
  title,
  description,
  colors,
  fonts,
  assets,
  buildSteps,
  codeSnippets = [],
  additionalNotes
}) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button 
        onClick={() => setOpen(true)} 
        className="fixed bottom-6 right-6 z-40 shadow-lg"
        size="sm"
      >
        <BookOpen className="mr-2 h-4 w-4" /> Show Front Guide
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <BookOpen className="h-5 w-5 text-primary" />
              Front-End Guide: {title}
            </DialogTitle>
            {description && (
              <DialogDescription className="text-md">
                {description}
              </DialogDescription>
            )}
          </DialogHeader>

          <Tabs defaultValue="colors" className="mt-6">
            <TabsList className="grid grid-cols-5 mb-4">
              <TabsTrigger value="colors" className="flex items-center gap-1">
                <Palette className="h-4 w-4" /> 
                <span className="hidden sm:inline">Colors</span>
              </TabsTrigger>
              <TabsTrigger value="typography" className="flex items-center gap-1">
                <FileType className="h-4 w-4" /> 
                <span className="hidden sm:inline">Typography</span>
              </TabsTrigger>
              <TabsTrigger value="assets" className="flex items-center gap-1">
                <Image className="h-4 w-4" /> 
                <span className="hidden sm:inline">Assets</span>
              </TabsTrigger>
              <TabsTrigger value="code" className="flex items-center gap-1">
                <Code className="h-4 w-4" /> 
                <span className="hidden sm:inline">Code</span>
              </TabsTrigger>
              <TabsTrigger value="steps" className="flex items-center gap-1">
                <Layers className="h-4 w-4" /> 
                <span className="hidden sm:inline">Build Steps</span>
              </TabsTrigger>
            </TabsList>

            {/* Colors Tab */}
            <TabsContent value="colors" className="space-y-4">
              <h3 className="text-lg font-semibold">Color Palette</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {colors.map((color, idx) => (
                  <div key={idx} className="flex items-center space-x-3 border rounded-lg p-3">
                    <div 
                      className="w-12 h-12 rounded-md border" 
                      style={{ backgroundColor: color.value }}
                    ></div>
                    <div>
                      <p className="font-medium">{color.name}</p>
                      <p className="text-sm font-mono">{color.value}</p>
                      {color.description && (
                        <p className="text-xs text-muted-foreground mt-1">{color.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* Typography Tab */}
            <TabsContent value="typography" className="space-y-4">
              <h3 className="text-lg font-semibold">Typography</h3>
              <div className="space-y-6">
                {fonts.map((font, idx) => (
                  <div key={idx} className="border rounded-lg p-4">
                    <h4 className="text-md font-semibold">{font.name}</h4>
                    <p className="text-sm text-muted-foreground">Family: {font.family}</p>
                    <p className="text-sm text-muted-foreground">Weights: {font.weights.join(', ')}</p>
                    {font.source && (
                      <p className="text-sm mt-2">
                        Source: <a href={font.source} target="_blank" rel="noreferrer" className="text-primary hover:underline">{font.source}</a>
                      </p>
                    )}
                    <div className="mt-3 p-3 bg-accent/50 rounded">
                      <p style={{ fontFamily: font.family.split(',')[0] }}>
                        The quick brown fox jumps over the lazy dog
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* Assets Tab */}
            <TabsContent value="assets" className="space-y-4">
              <h3 className="text-lg font-semibold">Assets</h3>
              <div className="space-y-4">
                {assets.map((asset, idx) => (
                  <div key={idx} className="border rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-accent/50 p-2 rounded-md">
                        {asset.type === 'icon' && <Code className="h-5 w-5" />}
                        {asset.type === 'image' && <Image className="h-5 w-5" />}
                        {asset.type === 'logo' && <Layers className="h-5 w-5" />}
                      </div>
                      <div>
                        <h4 className="text-md font-semibold">{asset.name}</h4>
                        <p className="text-sm text-muted-foreground capitalize">{asset.type}</p>
                      </div>
                    </div>
                    <p className="text-sm mt-2">
                      Source: <code className="bg-accent/30 px-1 py-0.5 rounded text-xs">{asset.source}</code>
                    </p>
                    {asset.description && (
                      <p className="text-sm text-muted-foreground mt-1">{asset.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* Code Snippets Tab */}
            <TabsContent value="code" className="space-y-4">
              <h3 className="text-lg font-semibold">Code Examples</h3>
              {codeSnippets.length === 0 ? (
                <p className="text-muted-foreground">No code snippets available for this page.</p>
              ) : (
                <div className="space-y-6">
                  {codeSnippets.map((snippet, idx) => (
                    <div key={idx} className="border rounded-lg p-4">
                      <h4 className="text-md font-semibold">{snippet.title}</h4>
                      {snippet.description && (
                        <p className="text-sm text-muted-foreground mb-2">{snippet.description}</p>
                      )}
                      <div className="bg-card p-3 rounded-md overflow-x-auto">
                        <pre className="text-sm font-mono">
                          <code>{snippet.code}</code>
                        </pre>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Build Steps Tab */}
            <TabsContent value="steps" className="space-y-4">
              <h3 className="text-lg font-semibold">Build Steps</h3>
              <ol className="list-decimal pl-6 space-y-2">
                {buildSteps.map((step, idx) => (
                  <li key={idx} className="text-sm">{step}</li>
                ))}
              </ol>

              {additionalNotes && (
                <>
                  <h4 className="text-md font-semibold mt-6">Additional Notes</h4>
                  <div className="border-l-2 border-primary/50 pl-4 py-1 text-sm">
                    {additionalNotes}
                  </div>
                </>
              )}
            </TabsContent>
          </Tabs>

          <DialogClose className="absolute top-4 right-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FrontEndGuide;
