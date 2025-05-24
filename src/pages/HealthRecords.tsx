
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Plus } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FileUpload from '@/components/FileUpload';
import FileManager from '@/components/FileManager';
import { supabase } from '@/integrations/supabase/client';
import { useEffect, useState } from 'react';

const HealthRecords = () => {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id || null);
    };
    
    getUser();
  }, []);

  return (
    <div className="flex-1 p-6 overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold flex items-center">
            <FileText className="mr-2 h-6 w-6 text-medical-primary" />
            Health Records
          </h1>
          {userId && (
            <Button className="bg-medical-primary hover:bg-medical-primary/90">
              <Plus className="h-4 w-4 mr-2" /> Add Report
            </Button>
          )}
        </div>

        <Tabs defaultValue="documents">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="lab-results">Lab Results</TabsTrigger>
            <TabsTrigger value="imaging">Imaging</TabsTrigger>
            <TabsTrigger value="uploads">File Uploads</TabsTrigger>
          </TabsList>
          
          <TabsContent value="documents" className="mt-4">
            <div className="grid gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Annual Physical Exam</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Date: March 15, 2025</p>
                  <p className="text-sm text-muted-foreground">Provider: Dr. Michael Chen</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Cardiology Consultation</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Date: January 7, 2025</p>
                  <p className="text-sm text-muted-foreground">Provider: Dr. Sarah Johnson</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="lab-results" className="mt-4">
            <div className="grid gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Comprehensive Metabolic Panel</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Date: April 2, 2025</p>
                  <p className="text-sm text-muted-foreground">Status: Completed</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Lipid Panel</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Date: April 2, 2025</p>
                  <p className="text-sm text-muted-foreground">Status: Completed</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="imaging" className="mt-4">
            <Card className="p-8 flex items-center justify-center">
              <p className="text-muted-foreground">No imaging records available</p>
            </Card>
          </TabsContent>

          <TabsContent value="uploads" className="mt-4">
            <div className="space-y-6">
              {userId ? (
                <>
                  <div className="grid md:grid-cols-2 gap-6">
                    <FileUpload 
                      type="medical" 
                      userId={userId}
                      onUploadSuccess={() => window.location.reload()}
                    />
                    <FileUpload 
                      type="vitals" 
                      userId={userId}
                      onUploadSuccess={() => window.location.reload()}
                    />
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <FileManager type="medical" userId={userId} />
                    <FileManager type="vitals" userId={userId} />
                  </div>
                </>
              ) : (
                <Card className="p-8 flex items-center justify-center">
                  <p className="text-muted-foreground">Please log in to upload and manage files</p>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default HealthRecords;
