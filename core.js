// core.js - Jarvis Experimental Client Core Framework v1.1
(function () {
    'use strict';

    const CORE_VERSION = "v1.1";
    console.log(`[Jarvis Core ${CORE_VERSION}] Çekirdek Yüklendi ve Çalışıyor.`);

    // Global Ayarlar
    window.jarvisConfig = {
        version: CORE_VERSION,
        zoom: {
            level: 1.0,
            min: 0.3,
            max: 3.0,
            step: 0.05,
            enabled: true
        },
        ui: {
            visible: true,
            themeColor: "#00ffcc",
            backgroundColor: "rgba(10, 14, 23, 0.9)"
        }
    };

    // 1. KAMERA VE ZOOM MANTIĞI (STARBLAST HACK)
    function applyCameraZoom() {
        if (!window.jarvisConfig.zoom.enabled) return;

        // Three.js kamerasını ortografik boyuttan yakalama
        if (window.THREE && window.THREE.OrthographicCamera) {
            if (!window.__jarvis_camera_patched) {
                window.__jarvis_camera_patched = true;
                
                const originalUpdate = window.THREE.OrthographicCamera.prototype.updateProjectionMatrix;
                window.THREE.OrthographicCamera.prototype.updateProjectionMatrix = function () {
                    const z = window.jarvisConfig.zoom.level;
                    if (z !== 1.0) {
                        this.left = this.left * z;
                        this.right = this.right * z;
                        this.top = this.top * z;
                        this.bottom = this.bottom * z;
                    }
                    return originalUpdate.apply(this, arguments);
                };
            }
        }

        // Oyun sahnelerindeki mevcut aktif kameralara zorlama
        const canvases = document.querySelectorAll("canvas");
        canvases.forEach(canvas => {
            if (canvas.__three_renderer__ && canvas.__three_renderer__.info) {
                // Canvas üzerindeki sahne tespiti
            }
        });

        requestAnimationFrame(applyCameraZoom);
    }

    // 2. ARAYÜZ (UI) OLUŞTURUCU - ALT PANEL
    function createJarvisUI() {
        if (document.getElementById("jarvis-menu-root")) return;

        const menuRoot = document.createElement("div");
        menuRoot.id = "jarvis-menu-root";
        // Paneli ekranın sağ alt tarafına aldık
        menuRoot.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 290px;
            background: ${window.jarvisConfig.ui.backgroundColor};
            border: 1px solid ${window.jarvisConfig.ui.themeColor};
            border-radius: 8px;
            box-shadow: 0 0 15px ${window.jarvisConfig.ui.themeColor}44;
            color: #ffffff;
            font-family: 'monospace', sans-serif;
            font-size: 11px;
            z-index: 999999;
            backdrop-filter: blur(5px);
            user-select: none;
            overflow: hidden;
        `;

        const header = document.createElement("div");
        header.style.cssText = `
            padding: 8px 12px;
            background: ${window.jarvisConfig.ui.themeColor}22;
            border-bottom: 1px solid ${window.jarvisConfig.ui.themeColor}55;
            font-weight: bold;
            display: flex;
            justify-content: space-between;
            align-items: center;
        `;
        header.innerHTML = `<span>JARVIS SYSTEM [${CORE_VERSION}]</span><span id="jarvis-status" style="color:#00ffcc;">● ACTIVE</span>`;

        const content = document.createElement("div");
        content.id = "jarvis-menu-content";
        content.style.padding = "10px";
        content.innerHTML = `
            <div style="margin-bottom: 6px; display:flex; justify-content:space-between;">
                <span>Kamera Zoom Seviyesi:</span>
                <b id="jarvis-zoom-val" style="color:#00ffcc;">1.00x</b>
            </div>
            <div style="font-size: 10px; color: #aaa; border-top: 1px dashed #444; pt: 5px; margin-top: 5px;">
                • Tekerlek İleri: Uzaklaş<br>
                • Tekerlek Geri: Yakınlaş<br>
                • Alt + A: Paneli Gizle / Aç
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
                // Uzaklaş
                window.jarvisConfig.zoom.level = Math.min(
                    window.jarvisConfig.zoom.max,
                    window.jarvisConfig.zoom.level + window.jarvisConfig.zoom.step
                );
            } else {
                // Yakınlaş
                window.jarvisConfig.zoom.level = Math.max(
                    window.jarvisConfig.zoom.min,
                    window.jarvisConfig.zoom.level - window.jarvisConfig.zoom.step
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
