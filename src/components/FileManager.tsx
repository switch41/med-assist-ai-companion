
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Activity, Download, Trash2, Eye } from 'lucide-react';
import { StorageService } from '@/services/storage.service';
import { useToast } from '@/hooks/use-toast';

interface FileItem {
  name: string;
  created_at: string;
  updated_at: string;
  size: number;
}

interface FileManagerProps {
  type: 'medical' | 'vitals';
  userId: string;
}

const FileManager: React.FC<FileManagerProps> = ({ type, userId }) => {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const loadFiles = async () => {
    if (!userId) return;

    setLoading(true);
    try {
      const { data, error } = type === 'medical'
        ? await StorageService.listMedicalReports(userId)
        : await StorageService.listVitalsData(userId);

      if (error) {
        throw error;
      }

      setFiles(data || []);
    } catch (error) {
      console.error('Error loading files:', error);
      toast({
        title: "Error",
        description: "Failed to load files",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFiles();
  }, [userId, type]);

  const handleDelete = async (fileName: string) => {
    const filePath = `${userId}/${fileName}`;
    
    try {
      const { error } = type === 'medical'
        ? await StorageService.deleteMedicalReport(filePath)
        : await StorageService.deleteVitalsData(filePath);

      if (error) {
        throw error;
      }

      toast({
        title: "Success",
        description: "File deleted successfully"
      });

      // Reload files
      loadFiles();
    } catch (error) {
      console.error('Error deleting file:', error);
      toast({
        title: "Error",
        description: "Failed to delete file",
        variant: "destructive"
      });
    }
  };

  const handleView = (fileName: string) => {
    const filePath = `${userId}/${fileName}`;
    const url = type === 'medical'
      ? StorageService.getMedicalReportUrl(filePath)
      : StorageService.getVitalsDataUrl(filePath);
    
    window.open(url, '_blank');
  };

  const icon = type === 'medical' ? <FileText className="h-5 w-5" /> : <Activity className="h-5 w-5" />;
  const title = type === 'medical' ? 'Medical Reports' : 'Vitals Data Files';

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {icon}
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Loading files...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {files.length === 0 ? (
          <p className="text-muted-foreground">No files uploaded yet</p>
        ) : (
          <div className="space-y-2">
            {files.map((file) => (
              <div key={file.name} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <p className="font-medium">{file.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(file.created_at).toLocaleDateString()} • {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleView(file.name)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(file.name)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FileManager;
