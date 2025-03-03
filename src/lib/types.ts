export type Config = {
  hostUrl: string;
  account: string;
  password: string;
  networkType: number;
};

export type DeviceInfoRaw = {
  online_session?: number;
  online_time: string;
  online_ip: string;
  online_mac: string;
  time_long?: string;
  uplink_bytes: string;
  downlink_bytes: string;
  dhcp_host?: string;
  device_alias?: string;
  nas_ip?: string;
  user_account?: string;
  is_owner_ip?: string;
};

export type DeviceInfo = {
  mac: string;
  ip: string;
  upload: number;
  download: number;
  time: string;
  account: string | undefined;
};
