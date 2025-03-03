use reqwest;
use serde_json;
use serde_json::Value;

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

    let json_str = body
        .trim()
        .strip_prefix("dr1006(")
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
        Some(_) => return Err(String::from("登出失败")),
        None => return Err(String::from("登出失败")),
    }
}