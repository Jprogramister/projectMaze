
class Log {
    static debug(text) {
        if (Config.isDebug) {
            console.log("[DEBUG] " + text);
        }
    }
}