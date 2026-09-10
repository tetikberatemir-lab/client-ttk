// core.js - Jarvis Experimental Client Core Framework
(function () {
    'use strict';

    console.log("[Jarvis System] Modüler Çekirdek Başlatılıyor...");

    // Global Ayarlar
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

    // 1. WEBGL / VIEWPORT SEVİYESİNDE DOĞRUDAN KAMERA KANCASI
    function applyDirectZoom() {
        // Starblast'ın ana render bağlamını yakala
        if (!window.WebGLRenderingContext) return;

        // WebGL Viewport Override
        if (!window.__jarvis_viewport_hooked) {
            window.__jarvis_viewport_hooked = true;
            const originalViewport = WebGLRenderingContext.prototype.viewport;

            WebGLRenderingContext.prototype.viewport = function (x, y, width, height) {
                if (window.jarvisConfig.zoom.enabled && window.jarvisConfig.zoom.level !== 1.0) {
                    const zoom = window.jarvisConfig.zoom.level;
                    const newWidth = width * zoom;
                    const newHeight = height * zoom;
                    const offsetX = x - (newWidth - width) / 2;
                    const offsetY = y - (newHeight - height) / 2;

                    return originalViewport.call(this, offsetX, offsetY, newWidth, newHeight);
                }
                return originalViewport.call(this, x, y, width, height);
            };
        }
    }

    // 2. ARAYÜZ (UI) OLUŞTURUCU
    function createJarvisUI() {
        if (document.getElementById("jarvis-menu-root")) return;

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

        const header = document.createElement("div");
        header.style.cssText = `
            padding: 10px;
            background: ${window.jarvisConfig.ui.themeColor}22;
            border-bottom: 1px solid ${window.jarvisConfig.ui.themeColor}55;
            font-weight: bold;
            display: flex;
            justify-content: space-between;
            align-items: center;
        `;
        header.innerHTML = `<span>JARVIS SYSTEM v1.0</span><span>[—]</span>`;

        const content = document.createElement("div");
        content.id = "jarvis-menu-content";
        content.style.padding = "10px";
        content.innerHTML = `
            <div style="margin-bottom: 8px;">
                <label>Kamera Zoom: <span id="jarvis-zoom-val">1.00x</span></label>
            </div>
            <div style="font-size: 10px; color: #888;">
                [Tekerlek İleri] Zoom Uzaklaştır<br>
                [Tekerlek Geri] Zoom Yakınlaştır<br>
                [Alt + A] Menü Gizle / Göster
            </div>
        `;

        menuRoot.appendChild(header);
        menuRoot.appendChild(content);
        document.body.appendChild(menuRoot);
    }

    // 3. GİRDİ YÖNETİCİSİ (INPUT MANAGER)
    function setupInputListeners() {
        window.addEventListener("wheel", function (e) {
            if (!window.jarvisConfig.zoom.enabled) return;

            if (e.deltaY < 0) {
                // İleri çevirince uzaklaşsın
                window.jarvisConfig.zoom.level = Math.max(
                    window.jarvisConfig.zoom.min,
                    window.jarvisConfig.zoom.level - window.jarvisConfig.zoom.step
                );
            } else {
                // Geriye çekince yakınlaşsın
                window.jarvisConfig.zoom.level = Math.min(
                    window.jarvisConfig.zoom.max,
                    window.jarvisConfig.zoom.level + window.jarvisConfig.zoom.step
                );
            }

            const zoomValElem = document.getElementById("jarvis-zoom-val");
            if (zoomValElem) {
                zoomValElem.innerText = window.jarvisConfig.zoom.level.toFixed(2) + "x";
            }
        }, { passive: true });

        window.addEventListener("keydown", function (e) {
            if (e.altKey && (e.key === 'a' || e.key === 'A' || e.code === 'KeyA')) {
                e.preventDefault();
                const menu = document.getElementById("jarvis-menu-root");
                if (menu) {
                    window.jarvisConfig.ui.visible = !window.jarvisConfig.ui.visible;
                    menu.style.display = window.jarvisConfig.ui.visible ? "block" : "none";
                }
            }
        });
    }

    // Başlatıcı
    function init() {
        createJarvisUI();
        setupInputListeners();
        applyDirectZoom();
    }

    if (document.readyState === "complete" || document.readyState === "interactive") {
        init();
    } else {
        window.addEventListener("DOMContentLoaded", init);
    }

})();
