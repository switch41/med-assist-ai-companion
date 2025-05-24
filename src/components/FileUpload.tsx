
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, FileText, Activity } from 'lucide-react';
import { StorageService } from '@/services/storage.service';
import { useToast } from '@/hooks/use-toast';

interface FileUploadProps {
  type: 'medical' | 'vitals';
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
      const { data, error } = type === 'medical' 
        ? await StorageService.uploadMedicalReport(file, userId)
        : await StorageService.uploadVitalsData(file, userId);

      if (error) {
        throw error;
      }

      toast({
        title: "Success",
        description: `${type === 'medical' ? 'Medical report' : 'Vitals data'} uploaded successfully`,
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

  const icon = type === 'medical' ? <FileText className="h-5 w-5" /> : <Activity className="h-5 w-5" />;
  const title = type === 'medical' ? 'Upload Medical Report' : 'Upload Vitals Data';
  const description = type === 'medical' 
    ? 'Upload medical reports, lab results, or imaging files'
    : 'Upload vitals data files from wearables or manual recordings';

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {icon}
          {title}
        </CardTitle>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          id={`file-input-${type}`}
          type="file"
          onChange={handleFileChange}
          accept={type === 'medical' ? '.pdf,.jpg,.jpeg,.png,.doc,.docx' : '.csv,.json,.txt,.xml'}
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
