import { Config } from "@/lib/types";
import {
  Card,
  CardContent,
  // CardDescription,
  // CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
// import { useState } from "react";
// import { invoke } from "@tauri-apps/api/core";


export default function LogCard({ config }: { config: Config }) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>日志</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2">
          <div className="flex flex-row justify-between">
            <span>地址</span>
            <span>{config.hostUrl}</span>
          </div>
          <div className="flex flex-row justify-between">
            <span>账号</span>
            <span>{config.account}</span>
          </div>
          <div className="flex flex-row justify-between">
            <span>密码</span>
            <span>{config.password}</span>
          </div>
          <div className="flex flex-row justify-between">
            <span>网络类型</span>
            <span>{config.networkType}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
