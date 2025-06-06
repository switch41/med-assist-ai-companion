
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Apple, Activity, Smartphone, Wifi, WifiOff, Clock, Battery } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface WearableDevice {
  id: string;
  name: string;
  type: 'apple' | 'google' | 'samsung';
  connected: boolean;
  lastSync: Date | null;
  batteryLevel?: number;
  autoSync: boolean;
}

const WearableIntegration = () => {
  const [devices, setDevices] = useState<WearableDevice[]>([
    {
      id: 'apple-watch',
      name: 'Apple Watch Series 9',
      type: 'apple',
      connected: false,
      lastSync: null,
      batteryLevel: 85,
      autoSync: false
    },
    {
      id: 'google-fit',
      name: 'Google Fit',
      type: 'google',
      connected: false,
      lastSync: null,
      autoSync: false
    },
    {
      id: 'samsung-health',
      name: 'Samsung Health',
      type: 'samsung',
      connected: false,
      lastSync: null,
      autoSync: false
    }
  ]);

  const { toast } = useToast();

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'apple':
        return <Apple className="h-6 w-6" />;
      case 'google':
        return <Activity className="h-6 w-6" />;
      case 'samsung':
        return <Smartphone className="h-6 w-6" />;
      default:
        return <Activity className="h-6 w-6" />;
    }
  };

  const handleConnect = async (deviceId: string) => {
    try {
      setDevices(prev => prev.map(device => 
        device.id === deviceId 
          ? { ...device, connected: true, lastSync: new Date() }
          : device
      ));
      
      toast({
        title: "Device Connected",
        description: "Your wearable device has been successfully connected.",
      });
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Failed to connect to your wearable device. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleDisconnect = (deviceId: string) => {
    setDevices(prev => prev.map(device => 
      device.id === deviceId 
        ? { ...device, connected: false, lastSync: null, autoSync: false }
        : device
    ));
    
    toast({
      title: "Device Disconnected",
      description: "Your wearable device has been disconnected.",
    });
  };

  const handleAutoSyncToggle = (deviceId: string, enabled: boolean) => {
    setDevices(prev => prev.map(device => 
      device.id === deviceId 
        ? { ...device, autoSync: enabled }
        : device
    ));
    
    if (enabled) {
      toast({
        title: "Auto-sync Enabled",
        description: "Your device will now sync data automatically every hour.",
      });
    }
  };

  const handleManualSync = async (deviceId: string) => {
    try {
      setDevices(prev => prev.map(device => 
        device.id === deviceId 
          ? { ...device, lastSync: new Date() }
          : device
      ));
      
      toast({
        title: "Sync Complete",
        description: "Your health data has been successfully synced.",
      });
    } catch (error) {
      toast({
        title: "Sync Failed",
        description: "Failed to sync your health data. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Wearable Devices</h3>
        <Badge variant="outline" className="text-xs">
          <Clock className="h-3 w-3 mr-1" />
          Auto-sync every hour
        </Badge>
      </div>

      {devices.map((device) => (
        <Card key={device.id} className="border-l-4 border-l-medical-primary">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between text-base">
              <div className="flex items-center gap-3">
                {getDeviceIcon(device.type)}
                <div>
                  <span className="font-medium">{device.name}</span>
                  <div className="flex items-center gap-2 mt-1">
                    {device.connected ? (
                      <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                        <Wifi className="h-3 w-3 mr-1" />
                        Connected
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-xs">
                        <WifiOff className="h-3 w-3 mr-1" />
                        Not Connected
                      </Badge>
                    )}
                    {device.batteryLevel && (
                      <Badge variant="outline" className="text-xs">
                        <Battery className="h-3 w-3 mr-1" />
                        {device.batteryLevel}%
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                {device.connected ? (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleManualSync(device.id)}
                    >
                      Sync Now
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDisconnect(device.id)}
                    >
                      Disconnect
                    </Button>
                  </>
                ) : (
                  <Button
                    size="sm"
                    className="bg-medical-primary hover:bg-medical-primary/90"
                    onClick={() => handleConnect(device.id)}
                  >
                    Connect
                  </Button>
                )}
              </div>
            </CardTitle>
          </CardHeader>
          
          {device.connected && (
            <CardContent className="pt-0">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor={`auto-sync-${device.id}`} className="text-sm font-medium">
                      Automatic Sync
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Sync health data every hour automatically
                    </p>
                  </div>
                  <Switch
                    id={`auto-sync-${device.id}`}
                    checked={device.autoSync}
                    onCheckedChange={(checked) => handleAutoSyncToggle(device.id, checked)}
                  />
                </div>
                
                {device.lastSync && (
                  <div className="text-xs text-muted-foreground">
                    Last synced: {device.lastSync.toLocaleString()}
                  </div>
                )}
              </div>
            </CardContent>
          )}
        </Card>
      ))}

      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Activity className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-blue-900">
                AI Health Monitoring Active
              </p>
              <p className="text-xs text-blue-700">
                Your health data is being monitored by our AI system for any unusual patterns or concerning trends. 
                You'll receive alerts if any anomalies are detected.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WearableIntegration;
