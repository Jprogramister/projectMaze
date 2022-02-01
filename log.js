
class Log {
    static debug(text) {
        if (Config.enableFullLog) {
            console.log("[DEBUG] " + text);
        }
    }
}