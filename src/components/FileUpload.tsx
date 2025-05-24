
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, FileText, Activity, FolderOpen } from 'lucide-react';
import { StorageService } from '@/services/storage.service';
import { useToast } from '@/hooks/use-toast';

interface FileUploadProps {
  type: 'medical' | 'vitals' | 'records';
  userId: string;
  onUploadSuccess?: (filePath: string) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ type, userId, onUploadSuccess }) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file || !userId) {
      toast({
        title: "Error",
        description: "Please select a file and ensure you're logged in",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);

    try {
      let data, error;
      
      if (type === 'medical') {
        ({ data, error } = await StorageService.uploadMedicalReport(file, userId));
      } else if (type === 'vitals') {
        ({ data, error } = await StorageService.uploadVitalsData(file, userId));
      } else {
        ({ data, error } = await StorageService.uploadHealthRecord(file, userId));
      }

      if (error) {
        throw error;
      }

      const fileTypeLabel = type === 'medical' ? 'Medical report' : type === 'vitals' ? 'Vitals data' : 'Health record';
      
      toast({
        title: "Success",
        description: `${fileTypeLabel} uploaded successfully`,
      });

      if (onUploadSuccess && data?.path) {
        onUploadSuccess(data.path);
      }

      setFile(null);
      // Reset the input
      const input = document.getElementById(`file-input-${type}`) as HTMLInputElement;
      if (input) input.value = '';
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload Failed",
        description: "There was an error uploading your file. Please try again.",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const getIcon = () => {
    if (type === 'medical') return <FileText className="h-5 w-5" />;
    if (type === 'vitals') return <Activity className="h-5 w-5" />;
    return <FolderOpen className="h-5 w-5" />;
  };

  const getTitle = () => {
    if (type === 'medical') return 'Upload Medical Report';
    if (type === 'vitals') return 'Upload Vitals Data';
    return 'Upload Health Record';
  };

  const getDescription = () => {
    if (type === 'medical') return 'Upload medical reports, lab results, or imaging files';
    if (type === 'vitals') return 'Upload vitals data files from wearables or manual recordings';
    return 'Upload health records, documents, or reports';
  };

  const getAcceptedFiles = () => {
    if (type === 'vitals') return '.csv,.json,.txt,.xml';
    return '.pdf,.jpg,.jpeg,.png,.doc,.docx';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {getIcon()}
          {getTitle()}
        </CardTitle>
        <p className="text-sm text-muted-foreground">{getDescription()}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          id={`file-input-${type}`}
          type="file"
          onChange={handleFileChange}
          accept={getAcceptedFiles()}
        />
        {file && (
          <p className="text-sm text-muted-foreground">
            Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
          </p>
        )}
        <Button 
          onClick={handleUpload}
          disabled={!file || uploading}
          className="w-full"
        >
          <Upload className="h-4 w-4 mr-2" />
          {uploading ? 'Uploading...' : 'Upload File'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default FileUpload;
