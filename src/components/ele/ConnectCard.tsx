import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Config } from "@/lib/types";
import { useState } from "react";

import { invoke } from "@tauri-apps/api/core";

const networkTypeLabels = {
  0: "校园网",
  2: "中国移动",
  3: "中国联通",
  4: "中国电信",
};

export default function ConnectCard({
  config,
  setConfig,
  online,
  setOnline,
}: {
  config: Config;
  setConfig: (config: Config) => void;
  online: boolean;
  setOnline: (online: boolean) => void;
}) {
  const [connecting, setConnecting] = useState<boolean>(false);
  const [msg, setMsg] = useState<string | undefined>(undefined);

  const handleConnect = async () => {
    setMsg(undefined);
    setConnecting(true);

    const disconnect = async () => {
      try {
        await invoke("disconnect", {
          hostUrl: config.hostUrl,
        });
        setMsg('断开成功');
        setOnline(false);
      } catch (e) {
        setMsg(e as string);
        setOnline(true);
      } finally {
        setConnecting(false);
      }
    };

    const connect = async () => {
      try {
        await invoke("connect", {
          hostUrl: config.hostUrl,
          account: config.account,
          password: config.password,
          networkType: config.networkType,
        });
        setMsg('连接成功');
        setOnline(true);
      } catch (e) {
        setMsg(e as string);
        setOnline(false);
      } finally {
        setConnecting(false);
      }
    };

    if (online) {
      disconnect();
    } else {
      connect();
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>连接</CardTitle>
        {msg && (
          <CardDescription className="text-green-500">
            {msg}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <Label>地址</Label>
          <Input
            type="text"
            placeholder="172.21.0.54"
            value={config.hostUrl}
            onChange={(e) => setConfig({ ...config, hostUrl: e.target.value })}
          />
          <Label>账号</Label>
          <Input
            type="text"
            placeholder="账号"
            value={config.account}
            onChange={(e) => setConfig({ ...config, account: e.target.value })}
          />
          <Label>密码</Label>
          <Input
            type="password"
            placeholder="密码"
            value={config.password}
            onChange={(e) => setConfig({ ...config, password: e.target.value })}
          />
          <Label>网络类型</Label>
          <Select
            value={config.networkType.toString()}
            onValueChange={(value) =>
              setConfig({ ...config, networkType: parseInt(value) })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="选择网络类型" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(networkTypeLabels).map(([key, label]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          variant={online ? "destructive" : "default"}
          onClick={handleConnect}
          disabled={connecting}
        >
          {connecting ? "连接中" : online ? "断开" : "连接"}
        </Button>
      </CardFooter>
    </Card>
  );
}
