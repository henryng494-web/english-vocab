import Foundation
import Capacitor

/// Next static export is a collection of HTML pages, not one SPA index.html.
/// CapacitorRouter serves root index.html for every extensionless URL, which
/// replays the home redirect after login or a client-router document fallback.
final class JungleBridgeViewController: CAPBridgeViewController {
    override func router() -> Router {
        return ExportedAppRouter()
    }
}

struct ExportedAppRouter: Router {
    var basePath: String = ""

    func route(for path: String) -> String {
        let root = URL(fileURLWithPath: basePath, isDirectory: true).standardizedFileURL
        let relative = path.trimmingCharacters(in: CharacterSet(charactersIn: "/"))
        let requested = root.appendingPathComponent(relative).standardizedFileURL
        guard requested.path == root.path || requested.path.hasPrefix(root.path + "/") else {
            return root.appendingPathComponent("index.html").path
        }

        if requested.pathExtension.isEmpty {
            let page = requested.appendingPathComponent("index.html")
            if FileManager.default.fileExists(atPath: page.path) {
                return page.path
            }
            return root.appendingPathComponent("index.html").path
        }
        return requested.path
    }
}
