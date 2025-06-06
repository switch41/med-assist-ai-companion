
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Plus, Upload } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FileUpload from '@/components/FileUpload';
import FileManager from '@/components/FileManager';
import { supabase } from '@/integrations/supabase/client';
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';

const HealthRecords = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id || null);
    };
    
    getUser();
  }, []);

  const handleUploadSuccess = () => {
    toast({
      title: "Success",
      description: "Health record uploaded successfully and will be analyzed by our AI for better care recommendations.",
    });
    // Reload the page to show updated files
    window.location.reload();
  };

  return (
    <div className="flex-1 p-6 overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold flex items-center">
            <FileText className="mr-2 h-6 w-6 text-medical-primary" />
            Health Records
          </h1>
          {userId && (
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add New Record
            </Button>
          )}
        </div>

        {/* Quick Upload Section */}
        {userId && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Quick Upload
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Upload your health records, lab results, medical reports, or any health-related documents
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <FileUpload 
                  type="records" 
                  userId={userId}
                  onUploadSuccess={handleUploadSuccess}
                />
                <FileUpload 
                  type="medical" 
                  userId={userId}
                  onUploadSuccess={handleUploadSuccess}
                />
                <FileUpload 
                  type="vitals" 
                  userId={userId}
                  onUploadSuccess={handleUploadSuccess}
                />
              </div>
            </CardContent>
          </Card>
        )}

        <Tabs defaultValue="documents">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="lab-results">Lab Results</TabsTrigger>
            <TabsTrigger value="imaging">Imaging</TabsTrigger>
            <TabsTrigger value="uploads">My Uploads</TabsTrigger>
            <TabsTrigger value="records">All Records</TabsTrigger>
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
            <Card className="p-8 flex flex-col items-center justify-center">
              <p className="text-muted-foreground mb-4">No imaging records available</p>
              {userId && (
                <FileUpload 
                  type="medical" 
                  userId={userId}
                  onUploadSuccess={handleUploadSuccess}
                />
              )}
            </Card>
          </TabsContent>

          <TabsContent value="uploads" className="mt-4">
            <div className="space-y-6">
              {userId ? (
                <div className="grid gap-6">
                  <FileManager type="records" userId={userId} />
                  <FileManager type="medical" userId={userId} />
                  <FileManager type="vitals" userId={userId} />
                </div>
              ) : (
                <Card className="p-8 flex items-center justify-center">
                  <p className="text-muted-foreground">Please log in to view your uploaded files</p>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="records" className="mt-4">
            <div className="space-y-6">
              {userId ? (
                <div className="grid gap-6">
                  <FileManager type="records" userId={userId} />
                </div>
              ) : (
                <Card className="p-8 flex items-center justify-center">
                  <p className="text-muted-foreground">Please log in to access your health records</p>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>AI Health Monitoring:</strong> All uploaded files are automatically analyzed by our AI system 
            to provide personalized health insights and monitoring. Your data is secure and HIPAA-compliant.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HealthRecords;
