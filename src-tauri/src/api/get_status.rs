use reqwest;


#[tauri::command]
pub async fn get_status(host_url: String) -> Result<bool, String> {
    let url = std::format!("http://{}/", host_url);
    let response = match reqwest::get(&url).await {
        Ok(r) => r,
        Err(_) => return Err(String::from("网络请求失败")),
    };

    let body = match response.text().await {
        Ok(t) => t,
        Err(_) => return Err(String::from("获取响应数据失败")),
    };

    println!("body: {}", body);

    if body.contains("注销页") {
        Ok(true)
    } else {
        Ok(false)
    }
}
