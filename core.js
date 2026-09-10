// core.js - Jarvis Client Core Framework v1.3
(function () {
    'use strict';

    const CORE_VERSION = "v1.3";
    console.log(`[Jarvis Core ${CORE_VERSION}] Kamera Merkezleme Düzeltmesi Aktif.`);

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
            backgroundColor: "rgba(10, 14, 23, 0.92)"
        }
    };

    // 1. TAM EKRAN ORANTILI KAMERA HACK
    function setupCameraHook() {
        if (window.THREE && window.THREE.WebGLRenderer) {
            if (!window.__jarvis_render_hooked) {
                window.__jarvis_render_hooked = true;

                // WebGL render döngüsüne doğrudan sızma
                const originalRender = window.THREE.WebGLRenderer.prototype.render;
                window.THREE.WebGLRenderer.prototype.render = function (scene, camera) {
                    if (camera && window.jarvisConfig.zoom.enabled) {
                        // Merkez ekseni kaydırmadan zoom uygula
                        if (camera.zoom !== undefined) {
                            const targetZoom = 1 / window.jarvisConfig.zoom.level;
                            if (Math.abs(camera.zoom - targetZoom) > 0.001) {
                                camera.zoom = targetZoom;
                                camera.updateProjectionMatrix();
                            }
                        }
                    }
                    return originalRender.apply(this, arguments);
                };
                console.log("[Jarvis System] WebGL Render kancası başarıyla bağlandı.");
            }
        }
    }

    // 2. ARAYÜZ (SOL ÜST PANEL)
    function createJarvisUI() {
        if (document.getElementById("jarvis-menu-root")) return;

        const menuRoot = document.createElement("div");
        menuRoot.id = "jarvis-menu-root";
        menuRoot.style.cssText = `
            position: fixed;
            top: 15px;
            left: 15px;
            width: 260px;
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
        header.innerHTML = `<span>JARVIS SYSTEM [${CORE_VERSION}]</span><span style="color:#00ffcc;">● READY</span>`;

        const content = document.createElement("div");
        content.id = "jarvis-menu-content";
        content.style.padding = "10px";
        content.innerHTML = `
            <div style="margin-bottom: 6px; display:flex; justify-content:space-between;">
                <span>Kamera Zoom:</span>
                <b id="jarvis-zoom-val" style="color:#00ffcc;">1.00x</b>
            </div>
            <div style="font-size: 10px; color: #aaa; border-top: 1px dashed #444; padding-top: 5px; margin-top: 5px;">
                • Tekerlek İleri: Uzaklaş<br>
                • Tekerlek Geri: Yakınlaş<br>
                • Alt + A: Paneli Aç / Kapat
            </div>
        `;

        menuRoot.appendChild(header);
        menuRoot.appendChild(content);
        document.body.appendChild(menuRoot);
    }

    // 3. GİRDİ YÖNETİCİSİ
    function setupInputListeners() {
        window.addEventListener("wheel", function (e) {
            if (!window.jarvisConfig.zoom.enabled) return;

            if (e.deltaY < 0) {
                window.jarvisConfig.zoom.level = Math.min(
                    window.jarvisConfig.zoom.max,
                    window.jarvisConfig.zoom.level + window.jarvisConfig.zoom.step
                );
            } else {
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

    function mainLoop() {
        setupCameraHook();
        requestAnimationFrame(mainLoop);
    }

    function init() {
        createJarvisUI();
        setupInputListeners();
        mainLoop();
    }

    if (document.readyState === "complete" || document.readyState === "interactive") {
        init();
    } else {
        window.addEventListener("DOMContentLoaded", init);
    }

})();
