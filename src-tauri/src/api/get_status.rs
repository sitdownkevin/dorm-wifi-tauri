use reqwest;
use serde::{Deserialize, Serialize};
use regex::Regex;

#[derive(Debug, Serialize, Deserialize)]
pub struct StatusResponse {
    pub online: bool,
    pub name: String,
    pub ip: String,
}

#[tauri::command]
pub async fn get_status(host_url: String) -> Result<StatusResponse, String> {
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

    let re = Regex::new(r"<title>(.*?)</title>").unwrap();

    match re.captures(&body) {
        Some(caps) => {
            let title = caps[1].to_string();
            if title == "注销页" {
                let re_name = Regex::new(r"NID\s*=\s*'([^']+)").unwrap();
                let name = match re_name.captures(&body) {
                    Some(caps) => caps[1].to_string(),
                    None => "".to_string(),
                };

                let re_ip = Regex::new(r"v4ip\s*=\s*'([^']+)").unwrap();
                let ip = match re_ip.captures(&body) {
                    Some(caps) => caps[1].to_string(),
                    None => "".to_string(),
                };

                return Ok(StatusResponse {
                    online: true,
                    name,
                    ip,
                });
            } else {
                return Ok(StatusResponse {
                    online: false,
                    name: "".to_string(),
                    ip: "".to_string(),
                });
            }
        }
        None => {
            return Err(String::from("获取标题失败"));
        }
    };

}
