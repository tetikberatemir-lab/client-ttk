// core.js - Jarvis Experimental Client Core Framework
(function () {
    'use strict';

    console.log("[Jarvis System] Modüler Çekirdek Başlatılıyor...");

    // 1. GLOBAL SİSTEM DURUMU
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

    // 2. KAMERA VE RENDER KANCASI (ZOOM MİMARİSİ)
    function applyCameraZoom() {
        // Three.js veya oyunun kamera matrisini bellekten tarayıp ezme
        if (window.THREE && window.THREE.PerspectiveCamera) {
            // Oyunun mevcut sahnelerindeki kameraları yakala
            const canvases = document.querySelectorAll("canvas");
            canvases.forEach(canvas => {
                // Canvas üzerindeki Three.js veya özel render nesnesine müdahale
                if (canvas.__webglContext || canvas) {
                    // Kamera objesini global çalışma alanından yakalama simülasyonu
                }
            });
        }

        // Oyunun genel scaler değişkenine kancalanma
        if (window.game && window.game.scaler) {
            window.game.scaler = window.jarvisConfig.zoom.level;
        }

        requestAnimationFrame(applyCameraZoom);
    }

    // 3. ARAYÜZ (UI) OLUŞTURUCU
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
            cursor: move;
        `;
        header.innerHTML = `<span>JARVIS SYSTEM v1.0</span><span id="jarvis-toggle-btn" style="cursor:pointer;">[—]</span>`;

        const content = document.createElement("div");
        content.id = "jarvis-menu-content";
        content.style.padding = "10px";
        content.innerHTML = `
            <div style="margin-bottom: 8px;">
                <label>Kamera Zoom: <span id="jarvis-zoom-val">1.00x</span></label>
            </div>
            <div style="font-size: 10px; color: #888;">
                [Tekerlek İleri] Zoom Küçült (Uzaklaş)<br>
                [Tekerlek Geri] Zoom Büyüt (Yakınlaş)<br>
                [Alt + A] Menüyü Gizle / Göster
            </div>
        `;

        menuRoot.appendChild(header);
        menuRoot.appendChild(content);
        document.body.appendChild(menuRoot);
    }

    // 4. GİRDİ VE ETKİNLİK YÖNETİCİSİ (INPUT MANAGER)
    function setupInputListeners() {
        // İstenen Yönde Fare Tekerleği Kontrolü
        window.addEventListener("wheel", function (e) {
            if (!window.jarvisConfig.zoom.enabled) return;

            // e.deltaY < 0 -> İleri Çevirme
            // e.deltaY > 0 -> Geriye Çekme
            if (e.deltaY < 0) {
                // İleri çevirince uzaklaşsın (zoom değeri küçülsün)
                window.jarvisConfig.zoom.level = Math.max(
                    window.jarvisConfig.zoom.min,
                    window.jarvisConfig.zoom.level - window.jarvisConfig.zoom.step
                );
            } else {
                // Geriye çekince yakınlaşsın (zoom değeri büyüsün)
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

        // Alt + A Kısayolu ile Menü Aç/Kapat
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

    // 5. BAŞLATICI
    function init() {
        createJarvisUI();
        setupInputListeners();
        requestAnimationFrame(applyCameraZoom);
    }

    if (document.readyState === "complete" || document.readyState === "interactive") {
        init();
    } else {
        window.addEventListener("DOMContentLoaded", init);
    }

})();
