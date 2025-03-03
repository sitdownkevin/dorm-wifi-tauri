use reqwest;
use serde::{Deserialize, Serialize};
use serde_json;
use serde_json::Value;

#[tauri::command]
pub async fn connect(host_url: String, account: String, password: String, network_type: u8) -> Result<bool, String> {
    let url = std::format!("http://{}/drcom/login?callback=dr1003&DDDDD={}&upass={}&0MKKey=123456&R1=0&R2=&R3={}&R6=0&para=00&v6ip=&terminal_type=1&lang=zh-cn&jsVersion=4.1&v=2653&lang=zh", host_url, account, password, network_type.to_string());


    let response = match reqwest::get(&url).await {
        Ok(r) => r,
        Err(_) => return Err(String::from("网络请求失败")),
    };

    let body = match response.text().await {
        Ok(t) => t,
        Err(_) => return Err(String::from("获取响应数据失败")),
    };

    let json_str = body
        .trim()
        .strip_prefix("dr1003(")
        .and_then(|s| s.strip_suffix(")"))
        .unwrap_or(body.as_str());

    println!("json_str: {}", json_str);

    let data: Value = match serde_json::from_str(json_str) {
        Ok(data) => data,
        Err(e) => {
            println!("解析 Json 数据失败: {}", e);
            return Err(String::from("解析 Json 数据失败"));
        }
    };

    match data.get("result").and_then(Value::as_i64) {
        Some(1) => return Ok(true),
        Some(_) => return Err(String::from("登录失败")),
        None => return Err(String::from("登录失败")),
    }
}