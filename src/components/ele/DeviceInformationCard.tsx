import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { invoke } from "@tauri-apps/api/core";
import { useState } from "react";
import { DeviceInfoRaw, DeviceInfo, Config } from "@/lib/types";

export default function DeviceInformationCard({ config }: { config: Config }) {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo[]>([]);
  const [msg, setMsg] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);

  const handleRefresh = async () => {
    setLoading(true);
    setMsg(undefined);
    setDeviceInfo([]);

    invoke("get_device_information_list", {
      hostUrl: config.hostUrl,
      userAccount: config.account,
    })
      .then((res) => {
        setDeviceInfo(
          (res as DeviceInfoRaw[]).map((item) => {
            return {
              mac: item.online_mac,
              ip: item.online_ip,
              upload: Number(item.uplink_bytes),
              download: Number(item.downlink_bytes),
              time: item.online_time,
              account: item.user_account,
            };
          })
        );
      })
      .catch((e) => {
        setMsg(e);
      });

    setLoading(false);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>设备信息</CardTitle>
        {msg && <CardDescription>{msg}</CardDescription>}
      </CardHeader>
      <CardContent className="flex flex-col gap-6 text-sm">
        {deviceInfo.map((device, index) => {
          return (
            <div key={index} className="flex flex flex-col gap-1">
              <div className="flex flex-row items-center justify-between">
                <span className="font-bold">Mac</span>
                <span>{device.mac}</span>
              </div>
              <div className="flex flex-row items-center justify-between">
                <span className="font-bold">IP</span>
                <span>{device.ip}</span>
              </div>
              <div className="flex flex-row items-center justify-between">
                <span className="font-bold">上行/下行 (Mb)</span>
                <span>
                  {device.upload.toFixed(2)}/{device.download.toFixed(2)}
                </span>
              </div>
              <div className="flex flex-row items-center justify-between">
                <span className="font-bold">登录时间</span>
                <span>{device.time}</span>
              </div>
              {device.account && (
                <div className="flex flex-row items-center justify-between">
                  <span className="font-bold">登录账号</span>
                  <span>{device.account}</span>
                </div>
              )}
            </div>
          );
        })}
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          variant="outline"
          onClick={handleRefresh}
          disabled={loading}
        >
          {loading ? "刷新中" : "刷新"}
        </Button>
      </CardFooter>
    </Card>
  );
}
