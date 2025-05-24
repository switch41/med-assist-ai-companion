
import { supabase } from '@/integrations/supabase/client';

export class StorageService {
  // Upload medical report to the medicalreport bucket
  static async uploadMedicalReport(file: File, userId: string, fileName?: string): Promise<{ data: any; error: any }> {
    const fileExt = file.name.split('.').pop();
    const finalFileName = fileName || `${userId}_${Date.now()}.${fileExt}`;
    const filePath = `${userId}/${finalFileName}`;

    const { data, error } = await supabase.storage
      .from('medicalreport')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    return { data, error };
  }

  // Upload vitals data file to the vitals bucket
  static async uploadVitalsData(file: File, userId: string, fileName?: string): Promise<{ data: any; error: any }> {
    const fileExt = file.name.split('.').pop();
    const finalFileName = fileName || `${userId}_vitals_${Date.now()}.${fileExt}`;
    const filePath = `${userId}/${finalFileName}`;

    const { data, error } = await supabase.storage
      .from('vitals')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    return { data, error };
  }

  // Upload health record to the records bucket
  static async uploadHealthRecord(file: File, userId: string, fileName?: string): Promise<{ data: any; error: any }> {
    const fileExt = file.name.split('.').pop();
    const finalFileName = fileName || `${userId}_record_${Date.now()}.${fileExt}`;
    const filePath = `${userId}/${finalFileName}`;

    const { data, error } = await supabase.storage
      .from('records')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    return { data, error };
  }

  // Get public URL for medical report
  static getMedicalReportUrl(filePath: string): string {
    const { data } = supabase.storage
      .from('medicalreport')
      .getPublicUrl(filePath);
    return data.publicUrl;
  }

  // Get public URL for vitals data
  static getVitalsDataUrl(filePath: string): string {
    const { data } = supabase.storage
      .from('vitals')
      .getPublicUrl(filePath);
    return data.publicUrl;
  }

  // Get public URL for health records
  static getHealthRecordUrl(filePath: string): string {
    const { data } = supabase.storage
      .from('records')
      .getPublicUrl(filePath);
    return data.publicUrl;
  }

  // List medical reports for a user
  static async listMedicalReports(userId: string): Promise<{ data: any; error: any }> {
    const { data, error } = await supabase.storage
      .from('medicalreport')
      .list(userId, {
        limit: 100,
        offset: 0,
        sortBy: { column: 'created_at', order: 'desc' }
      });

    return { data, error };
  }

  // List vitals data files for a user
  static async listVitalsData(userId: string): Promise<{ data: any; error: any }> {
    const { data, error } = await supabase.storage
      .from('vitals')
      .list(userId, {
        limit: 100,
        offset: 0,
        sortBy: { column: 'created_at', order: 'desc' }
      });

    return { data, error };
  }

  // List health records for a user
  static async listHealthRecords(userId: string): Promise<{ data: any; error: any }> {
    const { data, error } = await supabase.storage
      .from('records')
      .list(userId, {
        limit: 100,
        offset: 0,
        sortBy: { column: 'created_at', order: 'desc' }
      });

    return { data, error };
  }

  // Delete medical report
  static async deleteMedicalReport(filePath: string): Promise<{ data: any; error: any }> {
    const { data, error } = await supabase.storage
      .from('medicalreport')
      .remove([filePath]);

    return { data, error };
  }

  // Delete vitals data file
  static async deleteVitalsData(filePath: string): Promise<{ data: any; error: any }> {
    const { data, error } = await supabase.storage
      .from('vitals')
      .remove([filePath]);

    return { data, error };
  }

  // Delete health record
  static async deleteHealthRecord(filePath: string): Promise<{ data: any; error: any }> {
    const { data, error } = await supabase.storage
      .from('records')
      .remove([filePath]);

    return { data, error };
  }
}
