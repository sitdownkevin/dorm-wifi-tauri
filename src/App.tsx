import { useState, useEffect } from "react";
import "./App.css";
import ConnectCard from "@/components/ele/ConnectCard";
// import LogCard from "@/components/ele/LogCard";
import DeviceInformationCard from "@/components/ele/DeviceInformationCard";
import { invoke } from "@tauri-apps/api/core";
import { Config } from "@/lib/types";

type StatusResponse = {
  online: boolean;
  name: string;
  ip: string;
};

function UserInfo({
  online,
  userInfo,
}: {
  online: boolean;
  userInfo: { name: string; ip: string };
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <div className={`${online ? "text-green-500" : "text-red-500"} text-xs`}>
        {online ? "已连接" : "未连接"}
      </div>
      {online && userInfo.name && (
        <div className="text-xs text-gray-500">您好 {userInfo.name}</div>
      )}
      {online && userInfo.ip && (
        <div className="text-xs text-gray-500">{userInfo.ip}</div>
      )}
    </div>
  );
}

function App() {
  const [userInfo, setUserInfo] = useState({
    name: "",
    ip: "",
  });
  const [online, setOnline] = useState<boolean>(false);
  const [config, setConfig] = useState<Config>(() => {
    // 从 localStorage 读取配置，如果没有则使用默认值
    const savedConfig = localStorage.getItem("networkConfig");
    return savedConfig
      ? JSON.parse(savedConfig)
      : {
          hostUrl: "172.21.0.54",
          account: "",
          password: "",
          networkType: 0,
        };
  });

  // 监听 config 变化，保存到 localStorage
  useEffect(() => {
    localStorage.setItem("networkConfig", JSON.stringify(config));
  }, [config]);

  useEffect(() => {
    handleClick();
    setInterval(() => {
      handleClick();
    }, 60000);
  }, []);

  const handleClick = async () => {
    invoke<StatusResponse>("get_status", {
      hostUrl: config.hostUrl,
    })
      .then((res) => {
        // console.log(res);
        setOnline(res.online);
        setUserInfo({
          name: res.name,
          ip: res.ip,
        });
      })
      .catch((_) => {
        // console.error(e);
        setOnline(false);
      });
  };

  return (
    <main className="w-full h-full p-4 flex flex-col items-center justify-center gap-4">
      <UserInfo online={online} userInfo={userInfo} />
      {/* <Button onClick={handleClick}>Click</Button> */}
      <ConnectCard
        config={config}
        setConfig={setConfig}
        online={online}
        setOnline={setOnline}
      />
      <DeviceInformationCard config={config} />
      {/* <LogCard config={config} /> */}
      <footer className="text-xs text-gray-300 cursor-pointer select-none">
          @sitdownkevin
      </footer>
    </main>
  );
}

export default App;
