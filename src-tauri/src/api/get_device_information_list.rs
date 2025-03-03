use reqwest;
use serde_json;
use serde_json::Value;

#[tauri::command]
pub async fn get_device_information_list(
    host_url: String,
    user_account: String,
) -> Result<Value, String> {
    let url = std::format!("http://{}:801/eportal/portal/mac/find?callback=dr1002&user_account={}&login_method=0&find_mac=0", host_url, user_account);

    let response = match reqwest::get(&url).await {
        Ok(r) => r,
        Err(_) => return Err(String::from("网络请求失败")),
    };

    let body = match response.text().await {
        Ok(t) => t,
        Err(_) => return Err(String::from("获取响应数据失败")),
    };

    let json_str = body
        .strip_prefix("dr1002(")
        .and_then(|s| s.strip_suffix(");"))
        .unwrap_or(body.as_str());

    let data: Value = match serde_json::from_str(json_str) {
        Ok(data) => data,
        Err(_) => {
            return Err(String::from("解析 Json 数据失败"));
        }
    };

    match data.get("result").and_then(Value::as_i64) {
        Some(1) => match data.get("list") {
            Some(list) => return Ok(list.clone()),
            None => return Err(String::from("No data")),
        },
        Some(_) => return Err(String::from("获取用户在线信息数据为空")),
        None => return Err(String::from("获取数据失败")),
    }
}
