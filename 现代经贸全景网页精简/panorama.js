class PanoramaViewer {
    constructor() {
        // 检查是否允许调试（只允许在本地文件访问时调试）
        this.isDebugAllowed = window.location.protocol === 'file:';
        
        // 标记配置
        this.defaultMarkers = [
            { x: "50.79", y: "94.88", text: "校门口", sceneId: "scene1" },
            { x: "53.09", y: "69.14", text: "操场", sceneId: "scene2" },
            { x: "64.39", y: "70.36", text: "教学楼", sceneId: "scene3" },
            { x: "67.89", y: "43.48", text: "餐厅门口", sceneId: "scene4" },
            { x: "52.19", y: "24.35", text: "水果店", sceneId: "scene5" },
            { x: "67.44", y: "27.73", text: "餐厅", sceneId: "scene6" },
            { x: "31.73", y: "71.98", text: "实训室", sceneId: "scene7" },
            { x: "36.31", y: "55.67", text: "美容实训室", sceneId: "scene8" },
            { x: "26.80", y: "56.47", text: "画室", sceneId: "scene9" }
];

        this.container = document.getElementById('container');
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1100);
        this.scene = new THREE.Scene();
        
        // 渲染器设置
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: true,
            powerPreference: "high-performance",
            alpha: true
        });
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.container.appendChild(this.renderer.domElement);

        // 场景选择器
        this.sceneSelector = document.getElementById('sceneSelector');
        
        // 加载界面元素
        this.loadingScreen = document.getElementById('loadingScreen');
        this.loadingProgressBar = document.querySelector('.loading-progress-bar');
        this.loadingText = document.querySelector('.loading-text');
        this.loadingScene = document.querySelector('.loading-scene');
        this.isLoading = true;

        // 创建纹理加载器
        this.textureLoader = new THREE.TextureLoader();
        this.textureCache = new Map();
        
        // 创建球体几何体
        const geometry = new THREE.SphereGeometry(500, 60, 40);
        geometry.scale(-1, 1, 1);
        
        // 创建初始材质
        const material = new THREE.MeshBasicMaterial({ color: 0x000000 });
        const mesh = new THREE.Mesh(geometry, material);
        this.scene.add(mesh);

        // 初始化场景配置
        this.initializeScenes();
        
        // 初始化其他属性
        this.initializeProperties();

        // 创建右键菜单
        this.createContextMenu();

        // 添加事件监听
        this.initEventListeners();

        // 设置全屏按钮
        this.setupFullscreen();
        
        // 开始动画循环
        this.animate();
        
        // 开始预加载
        this.startPreloading();

        this.initMap();
    }

    // 初始化场景配置
    initializeScenes() {
        this.scenes = { 
            'scene1': {//校门口
                image: './cj/1.jpg',
                arrows: [
                    {
                        position: { x: -140, y: -110, z: 10 },
                        rotation: { 
                            x: 0.00,
                            y: 0.07,
                            z: 1.50
                        },
                        scale: {
                            x: 1.30,
                            y: 1.80,
                            z: 1.30
                        },
                        text: '进入学校',
                        target: 'scene2',
                        arrowStyle: '1',  // 使用 1.png
                        fontSize: {  // 添加字体大小配置
                            pc: 255,
                            mobile: 100
                        }
                    },
                ]
            },
            'scene2': {//操场
                image: './cj/2.jpg',
                arrows: [
                    {
                        position: { x: -450, y: -160, z: -15 },
                        rotation: { x: 0.00, y: -2.77, z: -1.60 },
                        scale: {
                            x: 1.00,
                            y: 0.80,
                            z: 1.00
                        },
                        text: '教学楼',
                        target: 'scene3',
                        arrowStyle: '1',  // 使用 1.png
                        fontSize: {  // 添加字体大小配置
                            pc: 255,
                            mobile: 100
                        }
                    },
                    {
                        position: { x: -280, y: -145, z: 335 },
                        rotation: { x: -0.10, y: 3.15, z: 3.80 },
                        scale: {
                            x: 0.90,
                            y: 1.00,
                            z: 0.90
                        },
                        text: '餐厅门口',
                        target: 'scene4',
                        arrowStyle: '1',  // 使用 1.png
                        fontSize: {  // 添加字体大小配置
                            pc: 255,
                            mobile: 100
                        }
                    },
                    {
                        position: { x: -5, y: -165, z: -440 },
                        rotation: { x: 0.10, y: 3.15, z: 0.00 },
                        scale: {
                            x: 0.70,
                            y: 0.80,
                            z: 0.70
                        },
                        text: '校门口',
                        target: 'scene1',
                        arrowStyle: '1',  // 使用 1.png
                        fontSize: {  // 添加字体大小配置
                            pc: 255,
                            mobile: 100
                        }
                    },
                    {
                        position: { x: 385, y: -120, z: -110 },
                        rotation: { 
                            x: 0.10,
                            y: -0.33,
                            z: 4.80
                        },
                        scale: {
                            x: 0.80,
                            y: 0.70,
                            z: 0.80
                        },
                        text: '实训室',
                        target: 'scene7',
                        arrowStyle: '1',  // 使用 1.png
                        fontSize: {  // 添加字体大小配置
                            pc: 255,
                            mobile: 100
                        }
                    },
                    {
                        position: { x: 405, y: -55, z: 280 },
                        rotation: { x: 1.50, y: -1.35, z: -0.20 },
                        scale: {
                            x: 1.00,
                            y: 0.30,
                            z: 1.00
                        },
                        text: '快递柜',
                        target: 'scene2',
                        arrowStyle: '3',  // 使用 1.png
                        fontSize: {  // 添加字体大小配置
                            pc: 255,
                            mobile: 100
                        }
                    }
                ]
            },
            'scene3': {//教学楼
                image: './cj/3.jpg',
                arrows: [
                    {
                        position: { x: -235, y: -115, z: 120 },
                        rotation: { x: 0.00, y: -0.05, z: -3.20 },
                        scale: {
                            x: 1.00,
                            y: 1.00,
                            z: 1.00
                        },
                        text: '招办',
                        target: 'scene2',
                        arrowStyle: '1',  // 使用 1.png
                        fontSize: {  // 添加字体大小配置
                            pc: 255,
                            mobile: 100
                        }
                    },
                    {
                        position: { x: 210, y: -115, z: 15 },
                        rotation: { x: 0.00, y: -0.05, z: -1.60 },
                        scale: {
                            x: 1.00,
                            y: 1.00,
                            z: 1.00
                        },
                        text: '操场',
                        target: 'scene2',
                        arrowStyle: '1',  // 使用 1.png
                        fontSize: {  // 添加字体大小配置
                            pc: 255,
                            mobile: 100
                        }
                    }
                ]
            },
            'scene4': {//餐厅门口
                image: './cj/4.jpg',  
                arrows: [
                    {
                        position: { x: 85, y: -75, z: 340 },
                        rotation: { x: -0.20, y: 0.05, z: 3.80 },
                        scale: {
                            x: 1.00,
                            y: 1.00,
                            z: 1.00
                        },
                        text: '操场',
                        target: 'scene2',
                        arrowStyle: '1',  // 使用 1.png
                        fontSize: {  // 添加字体大小配置
                            pc: 137,
                            mobile: 100  // 调整水果店/超市/澡堂的字体大小
                        }
                    },
                    {
                        position: { x: -5, y: -80, z: 445 },
                        rotation: { x: -0.10, y: 3.09, z: -2.30 },
                        scale: {
                            x: 1.00,
                            y: 1.00,
                            z: 1.00
                        },
                        text: '水果店/超市/澡堂',
                        target: 'scene5',
                        arrowStyle: '1',  // 使用 1.png
                        fontSize: {  // 添加字体大小配置
                            pc: 137,
                            mobile: 100  // 所有其他场景的字体大小
                        }
                    },
                    {
                        position: { x: -235, y: -110, z: 85 },
                        rotation: { 
                            x: 0.00,
                            y: 0.07,
                            z: 1.50
                        },
                        scale: {
                            x: 1.00,
                            y: 1.00,
                            z: 1.00
                        },
                        text: '餐厅',
                        target: 'scene6',
                        arrowStyle: '1',  // 使用 1.png
                        fontSize: {  // 添加字体大小配置
                            pc: 255,
                            mobile: 100
                        }
                    },
                    {
                        position: { x: -70, y: -115, z: -395},
                        rotation:{
                            x: 0.40,
                            y: 0.07,
                            z: 0.10
                        },
                        scale: {
                            x: 1.00,
                            y: 1.00,
                            z: 1.00
                        },
                        text: '上操场',
                        target:'scene13',
                        arrowStyls: '1',
                        fontSize: {
                            pc: 255,
                            mobile: 100
                        }
                    }
                ]
            },
            'scene5': {//水果店
                image: './cj/5.jpg',
                arrows: [
                    {
                        position: { x: -400, y: -190, z: -20 },
                        rotation: { x: 0.00, y: 3.19, z: -1.60 },
                        scale: {
                            x: 1.60,
                            y: 1.90,
                            z: 1.60
                        },
                        text: '返回',
                        target: 'scene4',
                        arrowStyle: '1',  // 使用 1.png
                        fontSize: {  // 添加字体大小配置
                            pc: 255,
                            mobile: 100
                        }
                    },
                    {
                        position: { x: 225, y: -110, z: -30 },
                        rotation: { 
                            x: 0.00,
                            y: -0.03,
                            z: 0.00
                        },
                        scale: {
                            x: 1.00,
                            y: 1.00,
                            z: 1.00
                        },
                        text: '超市',
                        target: 'scene5',
                        arrowStyle: '1',  // 使用 1.png
                        fontSize: {  // 添加字体大小配置
                            pc: 255,
                            mobile: 100
                        }
                    }
                ]
            },
            'scene6': {//餐厅
                image: './cj/6.jpg',
                arrows: [
                    {
                        position: { x: -215, y: -110, z: -115 },
                        rotation: { 
                            x: 0.00,
                            y: 0.07,
                            z: -0.00
                        },
                        scale: {
                            x: 1.00,
                            y: 1.00,
                            z: 1.00
                        },
                        text: '上操场',
                        target: 'scene13',
                        arrowStyle: '1',  // 使用 1.png
                        fontSize: {  // 添加字体大小配置
                            pc: 255,
                            mobile: 100
                        }
                    },
                    {
                        position: { x: 170, y: -110, z: 45 },
                        rotation: { 
                            x: 0.00,
                            y: 0.13,
                            z: 4.60
                        },
                        scale: {
                            x: 1.00,
                            y: 1.00,
                            z: 1.00
                        },
                        text: '出口',
                        target: 'scene4',
                        arrowStyle: '1',  // 使用 1.png
                        fontSize: {  // 添加字体大小配置
                            pc: 255,
                            mobile: 100
                        }
                    }
                ]
            },
            'scene7': {//实训室
                image: './cj/7.jpg',
                arrows: [
                    {
                        position: { x: -280, y: -120, z:-145 },
                        rotation: { 
                            x: 0.10,
                            y: 0.17,
                            z: 7.80
                        },
                        scale: {
                            x: 1.00,
                            y: 1.00,
                            z: 1.00
                        },
                        text: '返回',
                        target: 'scene2',
                        arrowStyle: '1',  // 使用 1.png
                        fontSize: {  // 添加字体大小配置
                            pc: 255,
                            mobile: 100
                        }
                    },
                    {
                        position: { x: -290, y: -120, z:70 },
                        rotation: { 
                            x: -0.10,
                            y: 0.17,
                            z: 1.60,
                        },
                        scale: {
                            x: 0.80,
                            y: 0.80,
                            z: 0.80
                        },
                        text: '美容实训室',
                        target: 'scene8',
                        arrowStyle: '1',  // 使用 1.png
                        fontSize: {  // 添加字体大小配置
                            pc: 255,
                            mobile: 100
                        }
                    },
                    {
                        position: { x: -360, y: -155, z:260 },
                        rotation: { 
                            x: -0.20,
                            y: 0.17,
                            z: 1.70
                        },
                        scale: {
                            x: 1.00,
                            y: 1.00,
                            z: 1.00
                        },
                        text: '画室',
                        target: 'scene9',
                        arrowStyle: '1',  // 使用 1.png
                        fontSize: {  // 添加字体大小配置
                            pc: 255,
                            mobile: 100
                        }
                    },
                    {
                        position: { x: 345, y: -175, z:20 },
                        rotation: { 
                            x: -0.10,
                            y: -0.23,
                            z: 4.70
                        },
                        scale: {
                            x: 1.00,
                            y: 1.00,
                            z: 1.00
                        },
                        text: '汽修实训室',
                        target: 'scene10',
                        arrowStyle: '1',  // 使用 1.png
                        fontSize: {  // 添加字体大小配置
                            pc: 255,
                            mobile: 100
                        }
                    },
                    {
                        position: { x: 300, y: -175, z:325 },
                        rotation: { 
                            x: -0.20,
                            y: -0.23,
                            z: 3.20
                        },
                        scale: {
                            x: 1.00,
                            y: 1.00,
                            z: 1.00
                        },
                        text: '前往2区',
                        target: 'scene11',
                        arrowStyle: '1',  // 使用 1.png
                        fontSize: {  // 添加字体大小配置
                            pc: 255,
                            mobile: 100
                        }
                    }
                ]
            },
            'scene8': {//美容实训室
                image: './cj/8.jpg',
                arrows: [
                    {
                        position: { x: 410, y: -120, z:5 },
                        rotation: { 
                            x: 0.00,
                            y: -0.23,
                            z: 4.70
                        },
                        scale: {
                            x: 1.00,
                            y: 1.00,
                            z: 1.00
                        },
                        text: '返回',
                        target: 'scene7',
                        arrowStyle: '1',  // 使用 1.png
                        fontSize: {  // 添加字体大小配置
                            pc: 255,
                            mobile: 100
                        }
                    }
                ]
            },
            'scene9': {//画室
                image: './cj/9.jpg',
                arrows: [
                    {
                        position: { x: 370, y: -150, z:-185 },
                        rotation: { 
                            x: 0.10,
                            y: -0.13,
                            z: 4.70
                        },
                        scale: {
                            x: 1.00,
                            y: 1.00,
                            z: 1.00
                        },
                        text: '返回',
                        target: 'scene7',
                        arrowStyle: '1',  // 使用 1.png
                        fontSize: {  // 添加字体大小配置
                            pc: 255,
                            mobile: 100
                        }
                    }
                ]
            },
            'scene10': {//汽修
                image: './cj/10.jpg',
                arrows: [
                    {
                        position: { x: 370, y: -150, z:-185 },
                        rotation: {
                            x: 0.10,
                            y: -0.13,
                            z: 4.70
                        },
                        scale: {
                            x: 1.00,
                            y: 1.00,
                            z: 1.00
                        },
                        text: '返回',
                        target:'scene7',
                        arrowStyle: '1',  // 使用 1.png
                        fontSize: {  // 添加字体大小配置
                            pc: 255,
                            mobile: 100
                        }
                    }
                ]
            },
            'scene11': {//实训室后场景
                image: './cj/11.jpg',
                arrows: [
                    {
                        position: { x: 370, y: -150, z:-185 },
                        rotation: {
                            x: 0.10,
                            y: -0.13,
                            z: 4.70
                        },
                        scale: {
                            x: 1.00,
                            y: 1.00,
                            z: 1.00
                        },
                        text: '返回',
                        target: 'scene7',
                        arrowStyle: '1',  // 使用 1.png
                        fontSize: {  // 添加字体大小配置
                            pc: 255,
                            mobile: 100
                        }
                    },
                    {
                        position: { x: -300, y: -120, z:-330 },
                        rotation: { 
                            x: 0.40,
                            y: 0.17,
                            z: 0.10
                        },
                        scale: {
                            x: 1.00,
                            y: 1.00,
                            z: 1.00
                        },
                        text: '中餐实训室',
                        target: 'scene12',
                        arrowStyle: '1',  // 使用 1.png
                        fontSize: {  // 添加字体大小配置
                            pc: 255,
                            mobile: 100
                        }
                    },
                ]
            },
            'scene12': {//中餐实训室
                image: './cj/12.jpg',
                arrows: [
                    {
                        position: { x: 295, y: -175, z:330 },
                        rotation: { 
                            x: -0.30,
                            y: -0.23,
                            z: 3.20
                        },
                        scale: {
                            x: 1.00,
                            y: 1.00,
                            z: 1.00
                        },
                        text: '返回',
                        target: 'scene11',
                        arrowStyle: '1',  // 使用 1.png
                        fontSize: {  // 添加字体大小配置
                            pc: 255,
                            mobile: 100
                        }
                    }
                ]
            },
            'scene13':{//上操场
                image:'./cj/13.jpg',
                arrows:[
                    {
                        position:{ x: 435, y: -160, z: -85 },
                        rotation:{
                            x: -0.00,
                            y: -0.33,
                            z: -1.60
                        },
                        scale:{
                            x: 1.00,
                            y: 1.00,
                            z: 1.00
                        },
                        text: '返回',
                        target: 'scene4',
                        arrowStyle: '1',
                        fontSize:{
                            pc: 225,
                            mobile: 100
                        }
                    }
                ]
            }
        };
        this.currentScene = 'scene1';
    }

    // 开始预加载
    startPreloading() {
        const totalScenes = Object.keys(this.scenes).length;
        let loadedScenes = 0;
        let totalProgress = 0;

        // 获取开场动画的进度条元素
        const introProgressFill = document.querySelector('.intro-progress-fill');
        const introProgressText = document.querySelector('.intro-progress-text');

        // 更新加载界面
        this.loadingText.textContent = '正在加载场景...';
        this.loadingScene.textContent = '准备加载';
        this.loadingProgressBar.style.width = '0%';

        // 预加载所有场景
        for (const [sceneId, scene] of Object.entries(this.scenes)) {
            // 更新当前加载的场景名称
            this.loadingScene.textContent = `正在加载: ${scene.arrows[0]?.text || sceneId}`;
            
            this.textureLoader.load(
                scene.image,
                (texture) => {
                    // 缓存纹理
                    this.textureCache.set(scene.image, texture);
                    loadedScenes++;
                    
                    // 更新总进度
                    totalProgress = (loadedScenes / totalScenes) * 100;
                    
                    // 更新两个进度条
                    this.loadingProgressBar.style.width = `${totalProgress}%`;
                    introProgressFill.style.width = `${totalProgress}%`;
                    
                    // 更新两个进度文本
                    this.loadingText.textContent = `加载进度: ${Math.round(totalProgress)}%`;
                    introProgressText.textContent = `正在加载场景... ${Math.round(totalProgress)}%`;

                    // 如果是当前场景，立即显示
                    if (sceneId === this.currentScene) {
                        this.updateSceneTexture(texture);
                    }

                    // 所有场景加载完成
                    if (loadedScenes === totalScenes) {
                        introProgressText.textContent = '加载完成';
                        this.onLoadComplete();
                    }
                },
                // 加载进度
                (xhr) => {
                    if (xhr.lengthComputable) {
                        const sceneProgress = (xhr.loaded / xhr.total) * (100 / totalScenes);
                        const currentTotal = totalProgress + sceneProgress;
                        
                        // 更新两个进度条
                        this.loadingProgressBar.style.width = `${currentTotal}%`;
                        introProgressFill.style.width = `${currentTotal}%`;
                        
                        // 更新两个进度文本
                        this.loadingText.textContent = `加载进度: ${Math.round(currentTotal)}%`;
                        introProgressText.textContent = `正在加载场景... ${Math.round(currentTotal)}%`;
                    }
                },
                // 错误处理
                (error) => {
                    console.error(`Error loading texture for scene ${sceneId}:`, error);
                    loadedScenes++;
                    if (loadedScenes === totalScenes) {
                        introProgressText.textContent = '加载完成';
                        this.onLoadComplete();
                    }
                }
            );
        }
    }

    // 加载完成处理
    onLoadComplete() {
        this.isLoading = false;
        this.loadingText.textContent = '加载完成';
        
        // 延迟隐藏加载界面，让用户看到100%
        setTimeout(() => {
            this.loadingScreen.style.display = 'none';
            
            // 显示开场动画
            const introAnimation = document.getElementById('introAnimation');
            
            // 3.5秒后淡出开场动画
            setTimeout(() => {
                introAnimation.classList.add('intro-hidden');
                
                // 动画结束后加载场景
                setTimeout(() => {
                    introAnimation.style.display = 'none'; // 完全移除动画层
                    // 加载当前场景
                    this.loadScene(this.currentScene);
                    // 确保相机位置正确
                    this.camera.position.set(0, 0, 0.1);
                    this.camera.updateProjectionMatrix();
                    // 开始自动旋转
                    this.isUserInteracting = false;
                }, 1500);
            }, 3500);
        }, 500);
    }

    // 更新场景纹理
    updateSceneTexture(texture) {
        if (this.scene.children[0]) {
            if (this.scene.children[0].material) {
                this.scene.children[0].material.dispose();
            }
            const material = new THREE.MeshBasicMaterial({ 
                map: texture,
                side: THREE.DoubleSide // 确保球体内外都能看到纹理
            });
            this.scene.children[0].material = material;
        }
    }

    // 修改场景加载方法
    loadScene(sceneId) {
        if (this.isLoading) return;

        const scene = this.scenes[sceneId];
        const cachedTexture = this.textureCache.get(scene.image);

        if (!cachedTexture) {
            console.error(`Texture for scene ${sceneId} not found in cache`);
            return;
        }

        // 更新当前场景ID
        this.currentScene = sceneId;

        // 更新场景选择器中的活动状态
        const items = this.sceneSelector.getElementsByClassName('scene-item');
        Array.from(items).forEach(item => {
            item.classList.remove('active');
            if (item.dataset.sceneId === sceneId) {
                item.classList.add('active');
                // 平滑滚动到当前场景
                item.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
            }
        });

        // 创建过渡动画
        const transition = document.createElement('div');
        transition.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            opacity: 0;
            transition: opacity 0.3s ease;
            pointer-events: none;
            z-index: 999;
        `;
        document.body.appendChild(transition);

        // 淡入过渡
        requestAnimationFrame(() => {
            transition.style.opacity = '1';
            
            setTimeout(() => {
                // 更新场景
                this.updateSceneTexture(cachedTexture);
                
                // 清除旧箭头
                for (let i = this.scene.children.length - 1; i > 0; i--) {
                    const child = this.scene.children[i];
                    if (child.material) {
                        child.material.dispose();
                    }
                    if (child.geometry) {
                        child.geometry.dispose();
                    }
                    this.scene.remove(child);
                }
                
                // 添加新箭头
                scene.arrows.forEach(arrowConfig => {
                    this.addArrow(arrowConfig);
                });

                // 淡出过渡
                transition.style.opacity = '0';
                setTimeout(() => {
                    document.body.removeChild(transition);
                }, 300);
            }, 300);
        });
    }

    initializeProperties() {
        // 修改初始化相机位置和控制参数
        this.lon = 180;
        this.lat = 0;
        this.phi = 0;
        this.theta = 0;
        this.isUserInteracting = false;
        this.onPointerDownPointerX = 0;
        this.onPointerDownPointerY = 0;
        this.onPointerDownLon = 180;
        this.onPointerDownLat = 0;
        
        // 优化移动端旋转速度
        this.rotateSpeed = this.isMobile() ? 0.3 : 0.1;
        
        // 设置初始相机位置
        this.camera.position.set(0, 0, 0.1);

        // 添加触摸控制参数
        this.touchStartX = 0;
        this.touchStartY = 0;
        this.touchStartLon = 0;
        this.touchStartLat = 0;
        this.lastTouchDistance = 0;
        
        // 箭头点击相关
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.touchTimeout = null;
        
        // 添加右键菜单状态
        this.selectedArrow = null;
        this.isAdjusting = false;
        
        // 添加调节速度和缩放速度
        this.adjustSpeed = 5;
        this.scaleSpeed = 0.1;
        
        // 描边大小控制
        this.outlineSize = 2;
        
        // 字体大小控制
        this.fontSize = {
            pc: 32,
            mobile: 24  // 减小默认字体大小
        };
        
        // 文字颜色控制
        this.textColors = {
            fill: '#FFFFFF',    // 文字颜色
            stroke: '#000000'   // 描边颜色
        };

        // 初始化场景选择器
        this.initSceneSelector();
    }

    // 修改场景选择器初始化方法
    initSceneSelector() {
        // 清空现有内容
        this.sceneSelector.innerHTML = '';
        
        // 场景名称映射(下方场景选择栏)
        const sceneNames = {
            'scene1': '校门口',
            'scene2': '操场',
            'scene3': '教学楼',
            'scene4': '餐厅门口',
            'scene5': '水果店',
            'scene6': '餐厅',
            'scene7': '实训室',
            'scene8': '美容实训室',
            'scene9': '画室',
            'scene10': '汽修实训室',
            'scene11': '实训室2区',
            'scene12':'中餐实训室',
            'scene13':'上操场'
        };

        // 为每个场景创建缩略图
        Object.entries(this.scenes).forEach(([sceneId, scene]) => {
            const item = document.createElement('div');
            item.className = 'scene-item';
            // 添加场景ID作为数据属性
            item.dataset.sceneId = sceneId;
            
            if (sceneId === this.currentScene) {
                item.classList.add('active');
                // 将当前场景滚动到可见区域
                setTimeout(() => {
                    item.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
                }, 100);
            }
            
            // 创建缩略图
            const img = document.createElement('img');
            img.src = scene.image;
            img.alt = sceneNames[sceneId];
            img.loading = 'lazy'; // 延迟加载图片
            
            // 创建场景名称标签
            const name = document.createElement('div');
            name.className = 'scene-name';
            name.textContent = sceneNames[sceneId];
            
            // 添加点击事件
            const handleClick = () => {
                if (sceneId !== this.currentScene) {
                    // 移除所有active类
                    Array.from(this.sceneSelector.children).forEach(child => {
                        child.classList.remove('active');
                    });
                    // 添加active类到当前项
                    item.classList.add('active');
                    // 加载新场景
                    this.loadScene(sceneId);
                }
            };
            
            // 同时支持点击和触摸
            item.addEventListener('click', handleClick);
            item.addEventListener('touchend', (e) => {
                e.preventDefault();
                handleClick();
            });
            
            item.appendChild(img);
            item.appendChild(name);
            this.sceneSelector.appendChild(item);
        });
    }

    setupFullscreen() {
        const fullscreenButton = document.getElementById('fullscreenButton');
        fullscreenButton.addEventListener('click', () => {
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen().catch(err => {
                    console.log(`Error attempting to enable full-screen mode: ${err.message}`);
                });
            } else {
                document.exitFullscreen();
            }
        });
    }

    isMobile() {
        return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    }

    initEventListeners() {
        // 移动端事件
        if (this.isMobile()) {
            this.renderer.domElement.addEventListener('touchstart', this.onTouchStart.bind(this), { passive: false });
            this.renderer.domElement.addEventListener('touchmove', this.onTouchMove.bind(this), { passive: false });
            this.renderer.domElement.addEventListener('touchend', this.onTouchEnd.bind(this));
            
            // 允许场景选择器自然滚动
            const sceneSelector = document.getElementById('sceneSelector');
            sceneSelector.addEventListener('touchmove', (e) => {
                e.stopPropagation();
            }, { passive: true });
        } else {
            // PC端事件
            this.renderer.domElement.addEventListener('mousedown', this.onMouseDown.bind(this));
            this.renderer.domElement.addEventListener('mousemove', this.onMouseMove.bind(this));
            this.renderer.domElement.addEventListener('mouseup', this.onMouseUp.bind(this));
            this.renderer.domElement.addEventListener('contextmenu', this.onContextMenu.bind(this));
            document.addEventListener('keydown', this.onKeyDown.bind(this));
            document.addEventListener('wheel', this.onDocumentMouseWheel.bind(this));
        }

        // 通用事件
        window.addEventListener('resize', this.onWindowResize.bind(this));
        
        // 阻止默认的触摸行为
        document.addEventListener('touchmove', function(e) {
            e.preventDefault();
        }, { passive: false });
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    onMouseDown(event) {
        event.preventDefault();
        
        if (event.button === 0) { // 左键
            this.isUserInteracting = true;
            this.onPointerDownPointerX = event.clientX;
            this.onPointerDownPointerY = event.clientY;
            this.onPointerDownLon = this.lon;
            this.onPointerDownLat = this.lat;

            // 检查箭头点击
            this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
            this.checkArrowClick();
        }
    }

    onMouseMove(event) {
        if (this.isUserInteracting) {
            this.lon = (this.onPointerDownPointerX - event.clientX) * this.rotateSpeed + this.onPointerDownLon;
            this.lat = (event.clientY - this.onPointerDownPointerY) * this.rotateSpeed + this.onPointerDownLat;
        }
    }

    onMouseUp() {
        this.isUserInteracting = false;
    }

    onDocumentMouseWheel(event) {
        const fov = this.camera.fov + event.deltaY * 0.05;
        this.camera.fov = THREE.MathUtils.clamp(fov, 10, 75);
        this.camera.updateProjectionMatrix();
    }

    onContextMenu(event) {
        // 如果不允许调试，直接返回
        if (!this.isDebugAllowed) {
            event.preventDefault();
            return;
        }
        
        event.preventDefault();
        
        // 检查是否点击到箭头
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        
        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects(this.scene.children, true);
        
        if (intersects.length > 0) {
            const clicked = intersects[0].object;
            const targetObject = clicked.userData.target ? clicked : clicked.parent;
            
            if (targetObject && targetObject.userData.target) {
                this.selectedArrow = targetObject;
                this.isAdjusting = true;
                this.contextMenu.style.display = 'block';
                this.contextMenu.style.left = event.clientX + 'px';
                this.contextMenu.style.top = event.clientY + 'px';
                this.updatePositionDisplay();
            }
        } else {
            this.selectedArrow = null;
            this.isAdjusting = false;
            this.contextMenu.style.display = 'none';
        }
    }

    onKeyDown(event) {
        // 如果不允许调试，直接返回
        if (!this.isDebugAllowed) return;
        
        if (!this.selectedArrow || !this.isAdjusting) return;

        const arrow = this.selectedArrow;
        const speed = this.adjustSpeed;
        const scaleSpeed = this.scaleSpeed;

        switch(event.key.toLowerCase()) {
            case 'w': // 前移
                arrow.position.z -= speed;
                break;
            case 's': // 后移
                arrow.position.z += speed;
                break;
            case 'a': // 左移
                arrow.position.x -= speed;
                break;
            case 'd': // 右移
                arrow.position.x += speed;
                break;
            case 'arrowup': // 上移
                arrow.position.y += speed;
                break;
            case 'arrowdown': // 下移
                arrow.position.y -= speed;
                break;
            case 'q': // 左旋转
                arrow.userData.rotationY -= 0.1;
                break;
            case 'e': // 右旋转
                arrow.userData.rotationY += 0.1;
                break;
            case 'r': // 前倾
                arrow.userData.rotationX += 0.1;
                break;
            case 'f': // 后倾
                arrow.userData.rotationX -= 0.1;
                break;
            case 'z': // 左倾斜
                arrow.userData.rotationZ -= 0.1;
                break;
            case 'c': // 右倾斜
                arrow.userData.rotationZ += 0.1;
                break;
            case '1': // 整体放大
                arrow.scale.x += scaleSpeed;
                arrow.scale.y += scaleSpeed;
                break;
            case '2': // 整体缩小
                arrow.scale.x -= scaleSpeed;
                arrow.scale.y -= scaleSpeed;
                break;
            case '3': // 增加长度
                arrow.scale.y += scaleSpeed;
                break;
            case '4': // 减少长度
                arrow.scale.y -= scaleSpeed;
                break;
            case '5': // 增大字体
                this.fontSize.pc += 2;
                this.fontSize.mobile += 2;
                break;
            case '6': // 减小字体
                this.fontSize.pc -= 2;
                this.fontSize.mobile -= 2;
                break;
            case '7': // 下一个文字颜色
                this.textColors.fill = this.getNextColor(this.textColors.fill);
                break;
            case '8': // 上一个文字颜色
                this.textColors.fill = this.getPreviousColor(this.textColors.fill);
                break;
            case '9': // 下一个描边颜色
                this.textColors.stroke = this.getNextColor(this.textColors.stroke);
                break;
            case '0': // 上一个描边颜色
                this.textColors.stroke = this.getPreviousColor(this.textColors.stroke);
                break;
        }

        // 更新箭头旋转
        this.updateArrowRotation();
        // 更新文字精灵
        this.updateTextSprite(arrow);
        // 更新位置显示
        this.updatePositionDisplay();
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));
        this.update();
    }

    update() {
        if (!this.isUserInteracting) {
            // 旋转速度(不要乱改.(♯｀∧´)
            this.lon += 0.00;
        }

        // 限制垂直视角范围，防止把脖子扭断
        this.lat = Math.max(-85, Math.min(85, this.lat));
        
        // 将角度转换为弧度
        this.phi = THREE.MathUtils.degToRad(90 - this.lat);
        this.theta = THREE.MathUtils.degToRad(this.lon);

        // 计算相机目标点
        const targetX = Math.sin(this.phi) * Math.cos(this.theta);
        const targetY = Math.cos(this.phi);
        const targetZ = Math.sin(this.phi) * Math.sin(this.theta);

        // 更新相机朝向
        this.camera.lookAt(new THREE.Vector3(targetX, targetY, targetZ));
        
        this.renderer.render(this.scene, this.camera);
    }

    render() {
        this.renderer.render(this.scene, this.camera);
    }

    // 修改箭头创建方法
    addArrow(config) {
        const isMobile = this.isMobile();
        // 减小移动端箭头尺寸
        const arrowSize = isMobile ? 50 : 100;

        const geometry = new THREE.PlaneGeometry(arrowSize, arrowSize);
        const texture = new THREE.TextureLoader().load(`./ZS/${config.arrowStyle || '1'}.png`);
        const material = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true,
            side: THREE.DoubleSide,
            depthWrite: false,
            opacity: 0.9 // 稍微降低透明度使箭头更明显
        });

        const arrow = new THREE.Mesh(geometry, material);
        
        // 增大箭头的点击区域
        const hitboxGeometry = new THREE.PlaneGeometry(arrowSize * 1.5, arrowSize * 1.5);
        const hitboxMaterial = new THREE.MeshBasicMaterial({
            transparent: true,
            opacity: 0,
            side: THREE.DoubleSide
        });
        const hitbox = new THREE.Mesh(hitboxGeometry, hitboxMaterial);
        
        arrow.add(hitbox);
        
        // 设置位置和旋转
        arrow.position.set(config.position.x, config.position.y, config.position.z);
        arrow.rotation.set(
            -Math.PI/2 + (config.rotation.x || 0),
            config.rotation.y,
            config.rotation.z || 0
        );
        
        // 应用缩放
        if (config.scale) {
            arrow.scale.set(
                arrowSize * config.scale.x / 100,
                arrowSize * config.scale.y / 100,
                1
            );
        }
        
        // 创建更大的文字
        const textSprite = this.createTextSprite(config.text);
        textSprite.position.set(config.position.x, config.position.y + 0.1, config.position.z);
        textSprite.rotation.x = -Math.PI/2;
        
        arrow.userData = { 
            target: config.target,
            textSprite: textSprite,
            text: config.text,
            rotationX: config.rotation.x || 0,
            rotationY: config.rotation.y,
            rotationZ: config.rotation.z || 0
        };
        
        this.scene.add(arrow);
        this.scene.add(textSprite);
    }

    // 修改文本创建方法
    createTextSprite(text) {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        const isMobile = this.isMobile();
        
        // 增加画布大小以支持更大的文字
        canvas.width = 2048;
        canvas.height = 512;

        context.fillStyle = 'rgba(0, 0, 0, 0)';
        context.fillRect(0, 0, canvas.width, canvas.height);

        // 使用场景配置中的字体大小
        const currentScene = this.scenes[this.currentScene];
        const arrowConfig = currentScene.arrows.find(arrow => arrow.text === text);
        
        // 确保使用正确的字体大小配置
        let fontSize;
        if (isMobile && arrowConfig?.fontSize?.mobile) {
            fontSize = arrowConfig.fontSize.mobile;
        } else if (!isMobile && arrowConfig?.fontSize?.pc) {
            fontSize = arrowConfig.fontSize.pc;
        } else {
            fontSize = isMobile ? 24 : 32; // 减小移动端默认字体大小
        }

        context.font = `bold ${fontSize}px Arial`;
        context.fillStyle = '#FFFFFF';
        context.strokeStyle = '#000000';
        context.lineWidth = isMobile ? 8 : 4; // 减小移动端描边宽度
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        
        // 增强文字阴影效果
        context.shadowColor = 'rgba(0, 0, 0, 0.8)';
        context.shadowBlur = 8;
        context.shadowOffsetX = 4;
        context.shadowOffsetY = 4;
        
        // 绘制描边
        context.strokeText(text, canvas.width/2, canvas.height/2);
        // 绘制文字
        context.fillText(text, canvas.width/2, canvas.height/2);

        const texture = new THREE.CanvasTexture(canvas);
        texture.minFilter = THREE.LinearFilter;
        const spriteMaterial = new THREE.SpriteMaterial({ 
            map: texture,
            transparent: true,
            depthTest: false
        });
        const sprite = new THREE.Sprite(spriteMaterial);
        
        // 根据字体大小动态调整精灵大小
        const scale = isMobile ? Math.max(120, fontSize * 2) : Math.max(40, fontSize * 0.8);
        sprite.scale.set(scale, scale/4, 1);

        return sprite;
    }

    // 修改右键菜单
    createContextMenu() {
        // 如果不允许调试，不创建右键菜单
        if (!this.isDebugAllowed) return;
        
        const menu = document.createElement('div');
        menu.style.cssText = `
            position: fixed;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 15px;
            border-radius: 10px;
            display: none;
            z-index: 1000;
            font-size: 14px;
            max-width: 80vw;
            word-break: break-word;
            box-shadow: 0 2px 10px rgba(0,0,0,0.5);
        `;
        menu.innerHTML = `
            <div style="font-weight: bold;">箭头位置调节</div>
            <div style="margin-top: 10px; line-height: 1.5;">
                WASD: 前后左右移动<br>
                方向键: 上下移动<br>
                Q/E: 左右旋转<br>
                R/F: 前后倾斜<br>
                Z/C: 左右倾斜<br>
                1/2: 整体缩放<br>
                3/4: 长度调节<br>
                5/6: 字体大小调节<br>
                7/8: 文字颜色切换<br>
                9/0: 描边颜色切换<br>
                当前位置和状态:<br>
                <span id="arrowPos" style="font-family: monospace;"></span>
            </div>
        `;
        document.body.appendChild(menu);
        this.contextMenu = menu;
        this.positionDisplay = menu.querySelector('#arrowPos');
    }

    // 修改位置显示方法
    updatePositionDisplay() {
        if (this.selectedArrow) {
            const pos = this.selectedArrow.position;
            const rot = this.selectedArrow.userData;
            const scale = this.selectedArrow.scale;
            const isMobile = this.isMobile();
            const currentFontSize = isMobile ? this.fontSize.mobile : this.fontSize.pc;
            
            this.positionDisplay.textContent = 
                `x:${Math.round(pos.x)} y:${Math.round(pos.y)} z:${Math.round(pos.z)} ` +
                `rotX:${rot.rotationX.toFixed(2)} rotY:${rot.rotationY.toFixed(2)} rotZ:${rot.rotationZ.toFixed(2)} ` +
                `scaleX:${scale.x.toFixed(2)} scaleY:${scale.y.toFixed(2)} ` +
                `fontSize:${currentFontSize}px ` +
                `fillColor:${this.textColors.fill} strokeColor:${this.textColors.stroke}`;
        }
    }

    // 添加触摸事件处理方法
    onTouchStart(event) {
        event.preventDefault();
        
        if (event.touches.length === 1) {
            // 单指触摸 - 旋转
            const touch = event.touches[0];
            
            // 检查是否点击在场景选择器上
            if (touch.target.closest('#sceneSelector')) {
                return;
            }
            
            this.isUserInteracting = true;
            this.touchStartX = touch.clientX;
            this.touchStartY = touch.clientY;
            this.touchStartLon = this.lon;
            this.touchStartLat = this.lat;

            // 检测箭头点击
            this.mouse.x = (touch.clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = -(touch.clientY / window.innerHeight) * 2 + 1;
            this.checkArrowClick();
        } else if (event.touches.length === 2) {
            // 双指触摸 - 缩放
            this.lastTouchDistance = Math.hypot(
                event.touches[0].clientX - event.touches[1].clientX,
                event.touches[0].clientY - event.touches[1].clientY
            );
        }
    }

    onTouchMove(event) {
        if (event.touches[0].target.closest('#sceneSelector')) {
            return;
        }
        event.preventDefault();
        
        if (event.touches.length === 1 && this.isUserInteracting) {
            // 单指移动 - 旋转
            const touch = event.touches[0];
            // 增加移动端的旋转灵敏度
            const sensitivity = 1.5;
            this.lon = (this.touchStartX - touch.clientX) * this.rotateSpeed * sensitivity + this.touchStartLon;
            this.lat = (touch.clientY - this.touchStartY) * this.rotateSpeed * sensitivity + this.touchStartLat;
        } else if (event.touches.length === 2) {
            // 双指移动 - 缩放
            const currentDistance = Math.hypot(
                event.touches[0].clientX - event.touches[1].clientX,
                event.touches[0].clientY - event.touches[1].clientY
            );
            
            const delta = this.lastTouchDistance - currentDistance;
            this.camera.fov = THREE.MathUtils.clamp(
                this.camera.fov + delta * 0.05,
                30,
                90
            );
            this.camera.updateProjectionMatrix();
            this.lastTouchDistance = currentDistance;
        }
    }

    onTouchEnd(event) {
        this.isUserInteracting = false;
    }

    checkArrowClick() {
        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects(this.scene.children, true);
        
        if (intersects.length > 0) {
            const clicked = intersects[0].object;
            const targetObject = clicked.userData.target ? clicked : clicked.parent;
            if (targetObject && targetObject.userData.target) {
                this.loadScene(targetObject.userData.target);
            }
        }
    }

    // 修改箭头旋转更新方法
    updateArrowRotation() {
        const arrow = this.selectedArrow;
        arrow.rotation.set(
            -Math.PI/2 + arrow.userData.rotationX,
            arrow.userData.rotationY,
            arrow.userData.rotationZ
        );
    }

    // 修改更新文字精灵方法
    updateTextSprite(arrow) {
        if (arrow.userData.textSprite) {
            // 保存文字内容和当前位置/旋转信息
            const text = arrow.userData.text || '';
            const position = arrow.position.clone();
            const rotationX = arrow.userData.rotationX || 0;
            const rotationY = arrow.userData.rotationY || 0;
            const rotationZ = arrow.userData.rotationZ || 0;
            
            // 移除旧的文字精灵
            this.scene.remove(arrow.userData.textSprite);
            
            // 创建新的文字精灵
            const textSprite = this.createTextSprite(text);
            
            // 设置正确的位置和旋转
            textSprite.position.copy(position);
            textSprite.position.y += 0.1;
            textSprite.rotation.set(
                -Math.PI/2 + rotationX,
                rotationY,
                rotationZ
            );
            
            // 更新引用
            arrow.userData.textSprite = textSprite;
            arrow.userData.text = text;
            this.scene.add(textSprite);
        }
    }

    // 添加颜色切换辅助方法
    getNextColor(currentColor) {
        const colors = ['#FFFFFF', '#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF'];
        const index = colors.indexOf(currentColor);
        return colors[(index + 1) % colors.length];
    }

    getPreviousColor(currentColor) {
        const colors = ['#FFFFFF', '#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF'];
        const index = colors.indexOf(currentColor);
        return colors[(index - 1 + colors.length) % colors.length];
    }

    // 初始化平面图
    initMap() {
        // 初始化相关元素
        this.mapContainer = document.getElementById('mapContainer');
        this.mapImage = document.getElementById('mapImage');
        this.closeMapBtn = document.getElementById('closeMapBtn');
        this.markerForm = document.getElementById('markerForm');
        
        // 检查是否为调试模式
        this.isDebugMode = this.isDebugAllowed;
        
        // 从localStorage加载已保存的标记，如果没有则使用默认标记
        if (this.isDebugMode && localStorage.getItem('mapMarkers')) {
            try {
                this.markers = JSON.parse(localStorage.getItem('mapMarkers'));
            } catch (e) {
                console.error('无法解析保存的标记数据');
                this.markers = [];
            }
        } else {
            // 在非调试模式下使用默认标记
            this.markers = [...this.defaultMarkers];
        }
        
        // 渲染标记
        this.renderMarkers();
        
        // 点击展开地图
        const expandMap = (e) => {
            e.stopPropagation();
            this.mapContainer.classList.toggle('expanded');
            
            // 如果展开了，设置一个延迟重新渲染标记，确保在过渡完成后计算
            if (this.mapContainer.classList.contains('expanded')) {
                setTimeout(() => {
                    this.renderMarkers();
                }, 400);
            }
        };
        
        // 处理标记点击事件
        const handleMarkerClick = (e) => {
            if (!e.target.classList.contains('map-marker')) return;
            e.stopPropagation();
            
            const sceneId = e.target.dataset.sceneId;
            
            // 如果地图已经展开，并且标记有场景ID，则加载该场景
            if (this.mapContainer.classList.contains('expanded') && sceneId) {
                this.loadScene(sceneId);
                
                // 添加双击检测：如果是第二次点击，则收起地图
                if (e.target._lastClickTime && 
                    (new Date().getTime() - e.target._lastClickTime < 300)) {
                    this.mapContainer.classList.remove('expanded');
                }
                
                e.target._lastClickTime = new Date().getTime();
            } else if (!this.mapContainer.classList.contains('expanded')) {
                // 如果地图未展开，点击标记会展开地图
                expandMap(e);
            }
        };
        
        // 地图点击事件，如果没展开则展开
        this.mapContainer.addEventListener('click', (e) => {
            if (e.target.closest('.map-marker')) {
                handleMarkerClick(e);
            } else if (e.target !== this.closeMapBtn) {
                expandMap(e);
            }
        });
        
        // 关闭按钮事件
        this.closeMapBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.mapContainer.classList.remove('expanded');
        });
        
        // 触摸事件优化
        if (this.isMobile()) {
            // 移动端防止快速点击多次触发
            let touchTimeout = null;
            let touchStarted = false;
            let touchMoved = false;
            
            // 为关闭按钮单独添加触摸事件监听
            this.closeMapBtn.addEventListener('touchstart', (e) => {
                e.stopPropagation(); // 阻止事件冒泡
            }, { passive: false });
            
            this.closeMapBtn.addEventListener('touchend', (e) => {
                e.stopPropagation(); // 阻止事件冒泡
                if (!touchMoved) {
                    this.mapContainer.classList.remove('expanded');
                }
                touchMoved = false;
            }, { passive: false });
            
            // 地图容器的触摸事件
            this.mapContainer.addEventListener('touchstart', (e) => {
                touchStarted = true;
                touchMoved = false;
                
                if (touchTimeout) clearTimeout(touchTimeout);
                
                // 检查是否点击的是关闭按钮
                const touch = e.touches[0];
                const target = document.elementFromPoint(touch.clientX, touch.clientY);
                
                if (target === this.closeMapBtn || target.closest('#closeMapBtn')) {
                    e.stopPropagation();
                    return;
                }
                
                touchTimeout = setTimeout(() => {
                    if (!touchMoved) {
                        const target = document.elementFromPoint(touch.clientX, touch.clientY);
                        
                        if (target && target.classList.contains('map-marker')) {
                            handleMarkerClick({
                                target: target,
                                stopPropagation: () => e.stopPropagation()
                            });
                        } else if (target !== this.closeMapBtn && !target.closest('#closeMapBtn')) {
                            expandMap(e);
                        }
                    }
                }, 100);
            }, { passive: true });
            
            this.mapContainer.addEventListener('touchmove', (e) => {
                touchMoved = true;
                
                if (this.mapContainer.classList.contains('expanded')) {
                    const touch = e.touches[0];
                    const target = document.elementFromPoint(touch.clientX, touch.clientY);
                    
                    // 如果触摸移动到关闭按钮上，不执行其他操作
                    if (target === this.closeMapBtn || target.closest('#closeMapBtn')) {
                        return;
                    }
                    
                    // 阻止页面滚动
                    if (e.cancelable) {
                        e.preventDefault();
                    }
                }
            }, { passive: false });
            
            this.mapContainer.addEventListener('touchend', (e) => {
                touchStarted = false;
                clearTimeout(touchTimeout);
                
                // 检查是否点击的是关闭按钮
                if (e.changedTouches.length > 0) {
                    const touch = e.changedTouches[0];
                    const target = document.elementFromPoint(touch.clientX, touch.clientY);
                    
                    if ((target === this.closeMapBtn || target.closest('#closeMapBtn')) && !touchMoved) {
                        e.stopPropagation();
                        this.mapContainer.classList.remove('expanded');
                    }
                }
            }, { passive: false });
            
            // 单独处理关闭按钮的点击，确保它在任何情况下都能正常工作
            this.closeMapBtn.style.pointerEvents = 'auto'; // 确保按钮可点击
            this.closeMapBtn.style.zIndex = '1010'; // 确保按钮在最上层
        }
        
        // 在调试模式下初始化调试功能
        if (this.isDebugMode) {
            this.initDebugMapFeatures();
        }
        
        // 添加窗口大小改变事件监听
        window.addEventListener('resize', () => {
            if (this.mapContainer.classList.contains('expanded')) {
                this.renderMarkers();
            }
        });
    }

    // 渲染标记
    renderMarkers() {
        // 清除现有标记
        const existingMarkers = this.mapContainer.getElementsByClassName('map-marker');
        while (existingMarkers.length > 0) {
            existingMarkers[0].remove();
        }

        if (!this.mapImage || !this.mapImage.complete) {
            // 如果图片未加载完成，等待加载后再渲染
            this.mapImage.onload = () => this.renderMarkers();
            return;
        }

        // 获取地图图片的真实尺寸
        const naturalWidth = this.mapImage.naturalWidth;
        const naturalHeight = this.mapImage.naturalHeight;
        
        // 获取地图容器的当前尺寸
        const containerRect = this.mapContainer.getBoundingClientRect();
        const containerWidth = containerRect.width;
        const containerHeight = containerRect.height;
        
        // 计算地图图片实际显示的尺寸和位置
        const imageRatio = naturalWidth / naturalHeight;
        const containerRatio = containerWidth / containerHeight;
        
        let displayWidth, displayHeight, offsetX, offsetY;
        
        if (imageRatio > containerRatio) {
            // 图片比容器更宽
            displayWidth = containerWidth;
            displayHeight = containerWidth / imageRatio;
            offsetX = 0;
            offsetY = (containerHeight - displayHeight) / 2;
        } else {
            // 图片比容器更高
            displayHeight = containerHeight;
            displayWidth = containerHeight * imageRatio;
            offsetX = (containerWidth - displayWidth) / 2;
            offsetY = 0;
        }
        
        // 渲染所有标记
        this.markers.forEach(marker => {
            // 仅渲染有效的标记（必须有百分比坐标）
            if (marker.x === undefined || marker.y === undefined) return;
            
            // 将百分比转换为像素坐标
            const percentX = parseFloat(marker.x) / 100;
            const percentY = parseFloat(marker.y) / 100;
            
            // 计算相对于实际显示图片的像素位置
            const pixelX = percentX * displayWidth + offsetX;
            const pixelY = percentY * displayHeight + offsetY;
            
            // 创建标记元素
            const markerElement = document.createElement('div');
            markerElement.className = 'map-marker';
            markerElement.textContent = marker.text;
            markerElement.dataset.sceneId = marker.sceneId || '';
            
            // 存储原始百分比位置（用于反向计算和响应式调整）
            markerElement.dataset.percentX = marker.x;
            markerElement.dataset.percentY = marker.y;
            
            // 设置标记位置（相对于容器）
            markerElement.style.left = `${pixelX}px`;
            markerElement.style.top = `${pixelY}px`;
            
            // 添加标记到容器
            this.mapContainer.appendChild(markerElement);
        });
        
        // 调整边界
        this.adjustMarkersBoundaries();
    }
    
    // 调整标记边界，确保不超出容器
    adjustMarkersBoundaries() {
        const markers = this.mapContainer.getElementsByClassName('map-marker');
        const containerRect = this.mapContainer.getBoundingClientRect();
        const margin = 5; // 与边界保持的最小距离
        
        Array.from(markers).forEach(marker => {
            // 使用setTimeout确保在DOM完全渲染后计算尺寸
            setTimeout(() => {
                const markerRect = marker.getBoundingClientRect();
                
                // 检查并调整水平位置
                if (markerRect.right > containerRect.right - margin) {
                    const rightEdge = containerRect.right - markerRect.width - margin;
                    marker.style.left = `${rightEdge - containerRect.left}px`;
                }
                if (markerRect.left < containerRect.left + margin) {
                    marker.style.left = `${margin}px`;
                }
                
                // 检查并调整垂直位置
                if (markerRect.bottom > containerRect.bottom - margin) {
                    const bottomEdge = containerRect.bottom - markerRect.height - margin;
                    marker.style.top = `${bottomEdge - containerRect.top}px`;
                }
                if (markerRect.top < containerRect.top + margin) {
                    marker.style.top = `${margin}px`;
                }
            }, 10);
        });
    }
    
    // 更新标记位置（响应式调整）
    updateMarkerPositions() {
        if (!this.mapImage || !this.mapImage.complete) return;
        
        // 获取新的尺寸信息
        const naturalWidth = this.mapImage.naturalWidth;
        const naturalHeight = this.mapImage.naturalHeight;
        const containerRect = this.mapContainer.getBoundingClientRect();
        const containerWidth = containerRect.width;
        const containerHeight = containerRect.height;
        
        // 计算新的缩放比例和偏移
        const imageRatio = naturalWidth / naturalHeight;
        const containerRatio = containerWidth / containerHeight;
        
        let displayWidth, displayHeight, offsetX, offsetY;
        
        if (imageRatio > containerRatio) {
            displayWidth = containerWidth;
            displayHeight = containerWidth / imageRatio;
            offsetX = 0;
            offsetY = (containerHeight - displayHeight) / 2;
        } else {
            displayHeight = containerHeight;
            displayWidth = containerHeight * imageRatio;
            offsetX = (containerWidth - displayWidth) / 2;
            offsetY = 0;
        }
        
        // 更新所有标记的位置
        const markers = this.mapContainer.getElementsByClassName('map-marker');
        Array.from(markers).forEach(marker => {
            // 从数据属性中获取原始百分比位置
            const percentX = parseFloat(marker.dataset.percentX) / 100;
            const percentY = parseFloat(marker.dataset.percentY) / 100;
            
            // 计算新的像素位置
            const pixelX = percentX * displayWidth + offsetX;
            const pixelY = percentY * displayHeight + offsetY;
            
            // 更新标记位置
            marker.style.left = `${pixelX}px`;
            marker.style.top = `${pixelY}px`;
        });
        
        // 调整边界
        this.adjustMarkersBoundaries();
    }
    
    // 显示标记表单
    showMarkerForm(x, y, clientX, clientY) {
        // 确保坐标参数是数字
        const percentX = parseFloat(x);
        const percentY = parseFloat(y);
        
        if (isNaN(percentX) || isNaN(percentY)) {
            console.error('标记坐标无效');
            return;
        }
        
        // 保存当前点击位置的百分比坐标
        this.currentMarkerX = percentX;
        this.currentMarkerY = percentY;
        
        // 重置表单
        document.getElementById('markerText').value = '';
        document.getElementById('markerScene').value = '';
        
        // 显示表单并设置位置
        const form = document.getElementById('markerForm');
        form.style.display = 'block';
        
        // 根据点击位置调整表单位置，确保在视口内
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const formRect = form.getBoundingClientRect();
        
        let formX = clientX;
        let formY = clientY;
        
        // 确保表单不超出右边界
        if (formX + formRect.width > viewportWidth) {
            formX = viewportWidth - formRect.width - 10;
        }
        
        // 确保表单不超出下边界
        if (formY + formRect.height > viewportHeight) {
            formY = viewportHeight - formRect.height - 10;
        }
        
        form.style.left = `${formX}px`;
        form.style.top = `${formY}px`;
    }
    
    // 隐藏标记表单
    hideMarkerForm() {
        document.getElementById('markerForm').style.display = 'none';
    }

    // 添加默认标记
    addDefaultMarkers() {
        // 默认标记配置
        this.defaultMarkers = [
            { x: "50.79", y: "94.88", text: "校门口", sceneId: "scene1" },
            { x: "53.09", y: "69.14", text: "操场", sceneId: "scene2" },
            { x: "64.39", y: "70.36", text: "教学楼", sceneId: "scene3" },
            { x: "67.89", y: "43.48", text: "餐厅门口", sceneId: "scene4" },
            { x: "51.19", y: "20.89", text: "水果店", sceneId: "scene5" },
            { x: "67.15", y: "27.63", text: "餐厅", sceneId: "scene6" },
            { x: "31.73", y: "71.98", text: "中餐实训室", sceneId: "scene11" },
            { x: "39.38", y: "55.67", text: "美容实训室", sceneId: "scene8" },
            { x: "39.38", y: "55.67", text: "画室", sceneId: "scene9" },
            { x: "26.80", y: "56.47", text: "汽修实训室", sceneId: "scene10" }
        ];
    }

    // 调试相关功能初始化
    initDebugMapFeatures() {
        // 创建3D样式的调试控制面板
        const debugPanel = document.createElement('div');
        debugPanel.id = 'mapDebugPanel';
        debugPanel.style.cssText = `
            position: fixed;
            background: rgba(0, 0, 0, 0.85);
            color: white;
            padding: 20px;
            border-radius: 10px;
            display: none;
            z-index: 1002;
            font-size: 14px;
            max-width: 350px;
            word-break: break-word;
            box-shadow: 0 5px 20px rgba(0,0,0,0.5);
            backdrop-filter: blur(5px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            transform: translateZ(0);
            transition: all 0.3s ease;
            left: 20px;
            top: 20px;
        `;
        debugPanel.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                <div style="font-weight: bold; font-size: 16px;">平面图标记调试面板</div>
                <div id="closeDebugPanel" style="cursor: pointer; width: 24px; height: 24px; display: flex; justify-content: center; align-items: center; background: rgba(255,255,255,0.1); border-radius: 50%;">×</div>
            </div>
            <div style="margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px solid rgba(255,255,255,0.1);">
                <div style="margin-bottom: 10px;">标记信息：</div>
                <div style="display: flex; margin-bottom: 8px;">
                    <div style="width: 80px;">标记文字：</div>
                    <div id="selectedMarkerText" style="flex: 1; color: #3498db;">未选择</div>
                </div>
                <div style="display: flex; margin-bottom: 8px;">
                    <div style="width: 80px;">场景ID：</div>
                    <div id="selectedMarkerScene" style="flex: 1; color: #3498db;">未选择</div>
                </div>
                <div style="display: flex; margin-bottom: 8px;">
                    <div style="width: 80px;">位置X%：</div>
                    <input id="markerPosX" type="number" min="0" max="100" step="0.1" style="flex: 1; background: rgba(255,255,255,0.1); color: white; border: none; padding: 5px; border-radius: 3px;">
                </div>
                <div style="display: flex; margin-bottom: 8px;">
                    <div style="width: 80px;">位置Y%：</div>
                    <input id="markerPosY" type="number" min="0" max="100" step="0.1" style="flex: 1; background: rgba(255,255,255,0.1); color: white; border: none; padding: 5px; border-radius: 3px;">
                </div>
            </div>
            <div style="display: flex; gap: 10px; margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px solid rgba(255,255,255,0.1);">
                <button id="updateMarker" style="flex: 1; background: #2ecc71; color: white; border: none; padding: 8px; border-radius: 5px; cursor: pointer; font-weight: bold;">更新位置</button>
                <button id="deleteMarker" style="flex: 1; background: #e74c3c; color: white; border: none; padding: 8px; border-radius: 5px; cursor: pointer; font-weight: bold;">删除标记</button>
            </div>
            <div style="margin-bottom: 15px;">
                <button id="addNewMarker" style="width: 100%; background: #3498db; color: white; border: none; padding: 8px; border-radius: 5px; cursor: pointer; font-weight: bold;">添加新标记</button>
            </div>
            <div style="margin-bottom: 15px;">
                <button id="exportMarkers" style="width: 100%; background: #9b59b6; color: white; border: none; padding: 8px; border-radius: 5px; cursor: pointer; font-weight: bold;">导出标记配置</button>
            </div>
            <div id="exportResult" style="display: none; margin-top: 10px; background: rgba(0,0,0,0.3); padding: 10px; border-radius: 5px; font-family: monospace; font-size: 12px; max-height: 200px; overflow-y: auto; white-space: pre-wrap; border: 1px solid rgba(255,255,255,0.1);"></div>
        `;
        document.body.appendChild(debugPanel);

        // 创建新标记表单
        const markerForm = document.createElement('div');
        markerForm.id = 'mapMarkerForm';
        markerForm.style.cssText = `
            position: fixed;
            background: rgba(0, 0, 0, 0.85);
            color: white;
            padding: 20px;
            border-radius: 10px;
            display: none;
            z-index: 1002;
            font-size: 14px;
            max-width: 300px;
            word-break: break-word;
            box-shadow: 0 5px 20px rgba(0,0,0,0.5);
            backdrop-filter: blur(5px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            transform: translateZ(0);
            transition: all 0.3s ease;
        `;
        markerForm.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                <div style="font-weight: bold; font-size: 16px;">添加新标记</div>
                <div id="closeMarkerForm" style="cursor: pointer; width: 24px; height: 24px; display: flex; justify-content: center; align-items: center; background: rgba(255,255,255,0.1); border-radius: 50%;">×</div>
            </div>
            <div style="margin-bottom: 15px;">
                <div style="margin-bottom: 8px;">标记文字：</div>
                <input id="newMarkerText" type="text" style="width: 100%; background: rgba(255,255,255,0.1); color: white; border: none; padding: 8px; border-radius: 5px; margin-bottom: 15px;">
                <div style="margin-bottom: 8px;">跳转场景：</div>
                <select id="newMarkerScene" style="width: 100%; background: rgba(255,255,255,0.1); color: white; border: none; padding: 8px; border-radius: 5px;">
                    <option value="">选择场景</option>
                    <option value="scene1">校门口</option>
                    <option value="scene2">操场</option>
                    <option value="scene3">教学楼</option>
                    <option value="scene4">餐厅门口</option>
                    <option value="scene5">水果店</option>
                    <option value="scene6">餐厅</option>
                    <option value="scene7">实训室</option>
                    <option value="scene8">美容实训室</option>
                    <option value="scene9">画室</option>
                    <option value="scene10">汽修实训室</option>
                    <option value="scene11">实训室2区</option>
                    <option value="scene9">中餐实训室</option>
                    <option value="scene9">上操场</option>
                </select>
            </div>
            <div style="display: flex; gap: 10px;">
                <button id="saveNewMarker" style="flex: 1; background: #2ecc71; color: white; border: none; padding: 8px; border-radius: 5px; cursor: pointer; font-weight: bold;">保存</button>
                <button id="cancelNewMarker" style="flex: 1; background: #7f8c8d; color: white; border: none; padding: 8px; border-radius: 5px; cursor: pointer; font-weight: bold;">取消</button>
            </div>
        `;
        document.body.appendChild(markerForm);

        // 选中的标记和位置记录
        let selectedMarker = null;
        let newMarkerPosition = { x: 0, y: 0 };
        let isDragging = false;
        let startX, startY;
        let dragMarker = null;

        // 切换调试面板显示/隐藏
        const toggleDebugPanel = () => {
            const panel = document.getElementById('mapDebugPanel');
            panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
        };

        // 更新调试面板信息
        const updateDebugPanel = (marker) => {
            const panel = document.getElementById('mapDebugPanel');
            const textEl = document.getElementById('selectedMarkerText');
            const sceneEl = document.getElementById('selectedMarkerScene');
            const posXEl = document.getElementById('markerPosX');
            const posYEl = document.getElementById('markerPosY');

            if (marker) {
                selectedMarker = marker;
                panel.style.display = 'block';
                textEl.textContent = marker.textContent;
                sceneEl.textContent = marker.dataset.sceneId || '未设置';
                posXEl.value = marker.dataset.percentX;
                posYEl.value = marker.dataset.percentY;

                // 高亮选中的标记
                marker.style.boxShadow = '0 0 0 3px rgba(52, 152, 219, 0.7)';
                marker.style.zIndex = '1005';
            } else {
                selectedMarker = null;
                // 清除所有标记的高亮状态
                const markers = document.getElementsByClassName('map-marker');
                Array.from(markers).forEach(m => {
                    m.style.boxShadow = '';
                    m.style.zIndex = '1001';
                });
            }
        };

        // 开始拖动标记
        const startDragging = (e) => {
            // 右键不触发拖动
            if (e.button === 2) return;

            const marker = e.target.closest('.map-marker');
            if (!marker) return;

            e.preventDefault();
            isDragging = true;
            dragMarker = marker;
            
            // 记录起始位置
            startX = e.clientX;
            startY = e.clientY;
            
            // 更新调试面板
            updateDebugPanel(marker);
            
            // 添加拖动样式
            marker.style.cursor = 'grabbing';
            marker.style.transition = 'none';
        };

        // 拖动标记
        const dragMarkFunc = (e) => {
            if (!isDragging || !dragMarker) return;

            e.preventDefault();
            
            // 计算偏移量
            const diffX = e.clientX - startX;
            const diffY = e.clientY - startY;
            
            // 获取容器和图片信息
            const containerRect = this.mapContainer.getBoundingClientRect();
            const naturalWidth = this.mapImage.naturalWidth;
            const naturalHeight = this.mapImage.naturalHeight;
            
            // 计算图片显示尺寸
            const imageRatio = naturalWidth / naturalHeight;
            const containerRatio = containerRect.width / containerRect.height;
            
            let displayWidth, displayHeight, offsetX, offsetY;
            
            if (imageRatio > containerRatio) {
                displayWidth = containerRect.width;
                displayHeight = containerRect.width / imageRatio;
                offsetX = 0;
                offsetY = (containerRect.height - displayHeight) / 2;
            } else {
                displayHeight = containerRect.height;
                displayWidth = containerRect.height * imageRatio;
                offsetX = (containerRect.width - displayWidth) / 2;
                offsetY = 0;
            }
            
            // 获取当前位置
            const currentLeft = parseFloat(dragMarker.style.left);
            const currentTop = parseFloat(dragMarker.style.top);
            
            // 计算新位置
            let newLeft = currentLeft + diffX;
            let newTop = currentTop + diffY;
            
            // 限制在图片区域内
            newLeft = Math.max(offsetX, Math.min(offsetX + displayWidth, newLeft));
            newTop = Math.max(offsetY, Math.min(offsetY + displayHeight, newTop));
            
            // 更新标记位置
            dragMarker.style.left = `${newLeft}px`;
            dragMarker.style.top = `${newTop}px`;
            
            // 更新百分比位置
            const percentX = ((newLeft - offsetX) / displayWidth * 100).toFixed(2);
            const percentY = ((newTop - offsetY) / displayHeight * 100).toFixed(2);
            
            dragMarker.dataset.percentX = percentX;
            dragMarker.dataset.percentY = percentY;
            
            // 更新面板显示
            document.getElementById('markerPosX').value = percentX;
            document.getElementById('markerPosY').value = percentY;
            
            // 更新起始位置
            startX = e.clientX;
            startY = e.clientY;
        };

        // 结束拖动
        const endDragging = (e) => {
            if (!isDragging) return;
            
            e.preventDefault();
            isDragging = false;
            
            if (dragMarker) {
                // 恢复样式
                dragMarker.style.cursor = 'pointer';
                dragMarker.style.transition = 'all 0.3s ease';
                
                // 保存新位置到markers数组
                const markerIndex = this.markers.findIndex(m => 
                    m.text === dragMarker.textContent && 
                    m.sceneId === dragMarker.dataset.sceneId
                );
                
                if (markerIndex !== -1) {
                    this.markers[markerIndex].x = dragMarker.dataset.percentX;
                    this.markers[markerIndex].y = dragMarker.dataset.percentY;
                    // 保存到localStorage
                    if (this.isDebugMode) {
                        localStorage.setItem('mapMarkers', JSON.stringify(this.markers));
                    }
                }
                
                dragMarker = null;
            }
        };

        // 右键菜单处理
        const handleRightClick = (e) => {
            e.preventDefault();
            
            // 检查是否点击到标记
            const marker = e.target.closest('.map-marker');
            if (marker) {
                // 显示调试面板并更新选中标记
                updateDebugPanel(marker);
            } else if (this.mapContainer.classList.contains('expanded')) {
                // 点击空白处，获取坐标添加新标记
                const containerRect = this.mapContainer.getBoundingClientRect();
                const naturalWidth = this.mapImage.naturalWidth;
                const naturalHeight = this.mapImage.naturalHeight;
                
                // 计算图片显示尺寸和偏移
                const imageRatio = naturalWidth / naturalHeight;
                const containerRatio = containerRect.width / containerRect.height;
                
                let displayWidth, displayHeight, offsetX, offsetY;
                
                if (imageRatio > containerRatio) {
                    displayWidth = containerRect.width;
                    displayHeight = containerRect.width / imageRatio;
                    offsetX = 0;
                    offsetY = (containerRect.height - displayHeight) / 2;
                } else {
                    displayHeight = containerRect.height;
                    displayWidth = containerRect.height * imageRatio;
                    offsetX = (containerRect.width - displayWidth) / 2;
                    offsetY = 0;
                }
                
                // 检查点击是否在图片区域内
                const clickX = e.clientX - containerRect.left;
                const clickY = e.clientY - containerRect.top;
                
                if (clickX >= offsetX && clickX <= offsetX + displayWidth &&
                    clickY >= offsetY && clickY <= offsetY + displayHeight) {
                    
                    // 计算百分比位置
                    const percentX = ((clickX - offsetX) / displayWidth * 100).toFixed(2);
                    const percentY = ((clickY - offsetY) / displayHeight * 100).toFixed(2);
                    
                    // 保存新标记位置并显示表单
                    newMarkerPosition = { x: percentX, y: percentY };
                    
                    // 设置表单位置
                    const form = document.getElementById('mapMarkerForm');
                    form.style.display = 'block';
                    form.style.left = `${e.clientX}px`;
                    form.style.top = `${e.clientY}px`;
                    
                    // 重置表单字段
                    document.getElementById('newMarkerText').value = '';
                    document.getElementById('newMarkerScene').value = '';
                    
                    // 聚焦到输入框
                    setTimeout(() => {
                        document.getElementById('newMarkerText').focus();
                    }, 100);
                }
            }
        };

        // 添加事件监听器
        this.mapContainer.addEventListener('mousedown', startDragging);
        document.addEventListener('mousemove', dragMarkFunc);
        document.addEventListener('mouseup', endDragging);
        this.mapContainer.addEventListener('contextmenu', handleRightClick);
        
        // 更新标记位置按钮
        document.getElementById('updateMarker').addEventListener('click', () => {
            if (!selectedMarker) return;
            
            const posX = parseFloat(document.getElementById('markerPosX').value);
            const posY = parseFloat(document.getElementById('markerPosY').value);
            
            if (isNaN(posX) || isNaN(posY) || posX < 0 || posX > 100 || posY < 0 || posY > 100) {
                alert('请输入有效的位置坐标（0-100之间）');
                return;
            }
            
            // 更新标记属性
            selectedMarker.dataset.percentX = posX.toFixed(2);
            selectedMarker.dataset.percentY = posY.toFixed(2);
            
            // 更新markers数组
            const markerIndex = this.markers.findIndex(m => 
                m.text === selectedMarker.textContent && 
                m.sceneId === selectedMarker.dataset.sceneId
            );
            
            if (markerIndex !== -1) {
                this.markers[markerIndex].x = posX.toFixed(2);
                this.markers[markerIndex].y = posY.toFixed(2);
                // 保存到localStorage
                if (this.isDebugMode) {
                    localStorage.setItem('mapMarkers', JSON.stringify(this.markers));
                }
            }
            
            // 重新渲染所有标记
            this.renderMarkers();
            
            // 更新成功提示
            const button = document.getElementById('updateMarker');
            const originalText = button.textContent;
            button.textContent = '✓ 已更新';
            button.style.background = '#27ae60';
            setTimeout(() => {
                button.textContent = originalText;
                button.style.background = '#2ecc71';
            }, 1500);
        });
        
        // 删除标记按钮
        document.getElementById('deleteMarker').addEventListener('click', () => {
            if (!selectedMarker) return;
            
            if (confirm(`确定要删除标记"${selectedMarker.textContent}"吗？`)) {
                // 从markers数组中删除
                this.markers = this.markers.filter(m => 
                    !(m.text === selectedMarker.textContent && m.sceneId === selectedMarker.dataset.sceneId)
                );
                
                // 保存到localStorage
                if (this.isDebugMode) {
                    localStorage.setItem('mapMarkers', JSON.stringify(this.markers));
                }
                
                // 隐藏调试面板
                document.getElementById('mapDebugPanel').style.display = 'none';
                
                // 重新渲染所有标记
                this.renderMarkers();
            }
        });
        
        // 添加新标记按钮
        document.getElementById('addNewMarker').addEventListener('click', () => {
            // 获取地图中心位置作为默认位置
            const containerRect = this.mapContainer.getBoundingClientRect();
            newMarkerPosition = { x: "50.00", y: "50.00" };
            
            // 显示新标记表单
            const form = document.getElementById('mapMarkerForm');
            form.style.display = 'block';
            form.style.left = `${containerRect.left + containerRect.width / 2}px`;
            form.style.top = `${containerRect.top + containerRect.height / 2}px`;
            
            // 重置表单字段
            document.getElementById('newMarkerText').value = '';
            document.getElementById('newMarkerScene').value = '';
            
            // 聚焦到输入框
            setTimeout(() => {
                document.getElementById('newMarkerText').focus();
            }, 100);
        });
        
        // 保存新标记
        document.getElementById('saveNewMarker').addEventListener('click', () => {
            const text = document.getElementById('newMarkerText').value.trim();
            const sceneId = document.getElementById('newMarkerScene').value;
            
            if (!text) {
                alert('请输入标记文字');
                return;
            }
            
            // 创建新标记
            const newMarker = {
                x: newMarkerPosition.x,
                y: newMarkerPosition.y,
                text: text,
                sceneId: sceneId
            };
            
            // 添加到markers数组
            this.markers.push(newMarker);
            
            // 保存到localStorage
            if (this.isDebugMode) {
                localStorage.setItem('mapMarkers', JSON.stringify(this.markers));
            }
            
            // 隐藏表单
            document.getElementById('mapMarkerForm').style.display = 'none';
            
            // 重新渲染所有标记
            this.renderMarkers();
        });
        
        // 取消添加新标记
        document.getElementById('cancelNewMarker').addEventListener('click', () => {
            document.getElementById('mapMarkerForm').style.display = 'none';
        });
        
        // 关闭新标记表单
        document.getElementById('closeMarkerForm').addEventListener('click', () => {
            document.getElementById('mapMarkerForm').style.display = 'none';
        });
        
        // 关闭调试面板
        document.getElementById('closeDebugPanel').addEventListener('click', () => {
            document.getElementById('mapDebugPanel').style.display = 'none';
            updateDebugPanel(null);
        });
        
        // 导出标记配置
        document.getElementById('exportMarkers').addEventListener('click', () => {
            const exportDiv = document.getElementById('exportResult');
            
            // 对标记排序，按场景ID排序
            const sortedMarkers = [...this.markers].sort((a, b) => {
                const sceneA = a.sceneId || '';
                const sceneB = b.sceneId || '';
                return sceneA.localeCompare(sceneB);
            });
            
            // 格式化为代码
            const markersCode = sortedMarkers.map(marker => {
                return `    { x: "${marker.x}", y: "${marker.y}", text: "${marker.text}", sceneId: "${marker.sceneId || ''}" }`;
            }).join(',\n');
            
            const codeOutput = `// 默认标记配置 - 替换到 addDefaultMarkers 方法中
this.defaultMarkers = [
${markersCode}
];`;
            
            // 显示结果
            exportDiv.textContent = codeOutput;
            exportDiv.style.display = 'block';
            
            // 创建复制按钮
            const copyBtn = document.createElement('button');
            copyBtn.textContent = '复制配置代码';
            copyBtn.style.cssText = `
                width: 100%;
                background: #3498db;
                color: white;
                border: none;
                padding: 8px;
                border-radius: 5px;
                cursor: pointer;
                margin-top: 10px;
                font-weight: bold;
            `;
            
            copyBtn.onclick = () => {
                // 复制到剪贴板
                navigator.clipboard.writeText(codeOutput).then(() => {
                    copyBtn.textContent = '✓ 已复制';
                    setTimeout(() => {
                        copyBtn.textContent = '复制配置代码';
                    }, 2000);
                }).catch(err => {
                    console.error('复制失败', err);
                    alert('复制失败，请手动复制代码');
                });
            };
            
            // 添加按钮
            const existingBtn = exportDiv.nextElementSibling;
            if (existingBtn && existingBtn.tagName === 'BUTTON') {
                existingBtn.remove();
            }
            
            exportDiv.parentNode.insertBefore(copyBtn, exportDiv.nextSibling);
        });
        
        // 添加快捷键支持
        document.addEventListener('keydown', (e) => {
            // Shift+D 显示/隐藏调试面板
            if (e.shiftKey && e.key === 'D') {
                toggleDebugPanel();
            }
            
            // ESC键关闭所有面板
            if (e.key === 'Escape') {
                document.getElementById('mapDebugPanel').style.display = 'none';
                document.getElementById('mapMarkerForm').style.display = 'none';
                updateDebugPanel(null);
            }
        });
    }
}

// 创建全景预览器实例
new PanoramaViewer();