use reqwest;
use serde_json;
use serde_json::Value;
use regex::Regex;

#[tauri::command]
pub async fn disconnect(host_url: String) -> Result<bool, String> {
    let url = std::format!("http://{}/drcom/logout?callback=dr1006", host_url);


    let response = match reqwest::get(&url).await {
        Ok(r) => r,
        Err(_) => return Err(String::from("网络请求失败")),
    };

    let body = match response.text().await {
        Ok(t) => t,
        Err(_) => return Err(String::from("获取响应数据失败")),
    };


    let re = Regex::new(r"dr1006\((.*?)\)").unwrap();
    let json_str = match re.captures(&body) {
        Some(caps) => caps[1].to_string(),
        None => return Err(String::from("解析 Json 数据失败")),
    };


    let data: Value = match serde_json::from_str(&json_str) {
        Ok(data) => data,
        Err(e) => {
            println!("解析 Json 数据失败: {}", e);
            return Err(String::from("解析 Json 数据失败"));
        }
    };

    match data.get("result").and_then(Value::as_i64) {
        Some(1) => return Ok(true),
        Some(_) => return Err(String::from("登出失败")),
        None => return Err(String::from("登出失败")),
    }
}