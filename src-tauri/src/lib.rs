mod api;

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}


#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            greet,
            api::get_device_information_list::get_device_information_list,
            api::connect::connect,
            api::disconnect::disconnect,
            api::get_status::get_status,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
