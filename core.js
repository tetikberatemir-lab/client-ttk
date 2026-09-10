// core.js - Jarvis Experimental Client Core Framework
(function () {
    'use strict';

    console.log("[Jarvis System] Modüler Çekirdek Başlatılıyor...");

    // 1. GLOBAL SİSTEM DURUMU (STATE MANAGEMENT)
    window.jarvisConfig = {
        zoom: {
            level: 1.0,
            min: 0.2,
            max: 3.0,
            step: 0.05,
            enabled: true
        },
        ui: {
            visible: true,
            themeColor: "#00ffcc",
            backgroundColor: "rgba(10, 14, 23, 0.85)"
        }
    };

    // 2. ARAYÜZ (UI) OLUŞTURUCU
    function createJarvisUI() {
        if (document.getElementById("jarvis-menu-root")) return;

        // Container
        const menuRoot = document.createElement("div");
        menuRoot.id = "jarvis-menu-root";
        menuRoot.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            width: 280px;
            background: ${window.jarvisConfig.ui.backgroundColor};
            border: 1px solid ${window.jarvisConfig.ui.themeColor};
            border-radius: 8px;
            box-shadow: 0 0 15px ${window.jarvisConfig.ui.themeColor}44;
            color: #ffffff;
            font-family: 'monospace', sans-serif;
            font-size: 12px;
            z-index: 999999;
            backdrop-filter: blur(5px);
            user-select: none;
            overflow: hidden;
        `;

        // Header
        const header = document.createElement("div");
        header.style.cssText = `
            padding: 10px;
            background: ${window.jarvisConfig.ui.themeColor}22;
            border-bottom: 1px solid ${window.jarvisConfig.ui.themeColor}55;
            font-weight: bold;
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: move;
        `;
        header.innerHTML = `<span>JARVIS SYSTEM v1.0</span><span id="jarvis-toggle-btn" style="cursor:pointer;">[—]</span>`;

        // Content Area
        const content = document.createElement("div");
        content.id = "jarvis-menu-content";
        content.style.padding = "10px";
        content.innerHTML = `
            <div style="margin-bottom: 8px;">
                <label>Kamera Zoom: <span id="jarvis-zoom-val">1.0x</span></label>
            </div>
            <div style="font-size: 10px; color: #888;">
                [Fare Tekerleği] Zoom In / Out<br>
                [K] Menüyü Gizle / Göster
            </div>
        `;

        menuRoot.appendChild(header);
        menuRoot.appendChild(content);
        document.body.appendChild(menuRoot);

        console.log("[Jarvis System] Arayüz başarıyla enjekte edildi.");
    }

    // 3. GİRDİ VE ETKİNLİK YÖNETİCİSİ (INPUT MANAGER)
    function setupInputListeners() {
        // Fare Tekerleği ile Zoom Kontrolü
        window.addEventListener("wheel", function (e) {
            if (!window.jarvisConfig.zoom.enabled) return;

            if (e.deltaY < 0) {
                // Zoom In
                window.jarvisConfig.zoom.level = Math.min(
                    window.jarvisConfig.zoom.max,
                    window.jarvisConfig.zoom.level + window.jarvisConfig.zoom.step
                );
            } else {
                // Zoom Out
                window.jarvisConfig.zoom.level = Math.max(
                    window.jarvisConfig.zoom.min,
                    window.jarvisConfig.zoom.level - window.jarvisConfig.zoom.step
                );
            }

            // UI Güncelle
            const zoomValElem = document.getElementById("jarvis-zoom-val");
            if (zoomValElem) {
                zoomValElem.innerText = window.jarvisConfig.zoom.level.toFixed(2) + "x";
            }
        }, { passive: true });

        // Klavye Kısayolları (Menü Aç/Kapat)
        window.addEventListener("keydown", function (e) {
            if (e.key.toLowerCase() === 'k') {
                const menu = document.getElementById("jarvis-menu-root");
                if (menu) {
                    window.jarvisConfig.ui.visible = !window.jarvisConfig.ui.visible;
                    menu.style.display = window.jarvisConfig.ui.visible ? "block" : "none";
                }
            }
        });
    }

    // 4. BAŞLATICI (INITIALIZER)
    function init() {
        createJarvisUI();
        setupInputListeners();
    }

    // DOM Hazır Olduğunda Çalıştır
    if (document.readyState === "complete" || document.readyState === "interactive") {
        init();
    } else {
        window.addEventListener("DOMContentLoaded", init);
    }

})();
