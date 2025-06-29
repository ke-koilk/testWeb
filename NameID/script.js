// API配置
const API_TOKEN = "uskmBoJsO1MmEEhOuXIdQjI";
const BASE_URL = "https://api.vika.cn/fusion/v1/datasheets/dstmvARyqUT2ShZTxu/records";

// DOM元素
const loginSection = document.getElementById('loginSection');
const cardSection = document.getElementById('cardSection');
const nameInput = document.getElementById('nameInput');
const idInput = document.getElementById('idInput');
const loginBtn = document.getElementById('loginBtn');
const loginError = document.getElementById('loginError');
const logoutBtn = document.getElementById('logoutBtn');

const avatarEl = document.getElementById('avatar');
const userNameEl = document.getElementById('userName');
const userIdEl = document.getElementById('userId');
const userStudentIdEl = document.getElementById('userStudentId');
const userClassEl = document.getElementById('userClass');
const userDepartmentEl = document.getElementById('userDepartment');
const qrCodeEl = document.getElementById('qrCode');

// 初始化页面
document.addEventListener('DOMContentLoaded', () => {
    // 检查是否已登录
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser') || 'null');
    if (loggedInUser) {
        showCardSection();
        displayUserData(loggedInUser);
    }
    
    // 登录按钮事件
    loginBtn.addEventListener('click', handleLogin);
    
    // 登出按钮事件
    logoutBtn.addEventListener('click', handleLogout);
});

// 处理登录
async function handleLogin() {
    const name = nameInput.value.trim();
    const studentId = idInput.value.trim();
    
    if (!name || !studentId) {
        loginError.textContent = '请输入姓名和学号';
        return;
    }
    
    try {
        const url = `${BASE_URL}?filterByFormula=AND(姓名="${name}",学号="${studentId}")`;
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${API_TOKEN}`,
                'Content-Type': 'application/json'
            }
        });
        
        const data = await response.json();
        
        if (data.success && data.data.records.length > 0) {
            const userData = data.data.records[0].fields;
            // 保存登录状态
            localStorage.setItem('loggedInUser', JSON.stringify(userData));
            // 显示身份卡
            showCardSection();
            displayUserData(userData);
        } else {
            loginError.textContent = '姓名或学号不正确';
        }
    } catch (error) {
        console.error('登录失败:', error);
        loginError.textContent = '登录失败，请稍后再试';
    }
}

// 处理登出
function handleLogout() {
    localStorage.removeItem('loggedInUser');
    showLoginSection();
    // 清空输入框
    nameInput.value = '';
    idInput.value = '';
    loginError.textContent = '';
}

// 显示登录界面
function showLoginSection() {
    loginSection.classList.remove('hidden');
    cardSection.classList.add('hidden');
}

// 显示身份卡界面
function showCardSection() {
    loginSection.classList.add('hidden');
    cardSection.classList.remove('hidden');
}

// 显示用户数据
function displayUserData(userData) {
    // 设置用户信息
    userNameEl.textContent = userData.姓名 || '未知用户';
    userIdEl.textContent = userData.用户编号 || '无编号';
    userStudentIdEl.textContent = userData.学号 || '无学号';
    userClassEl.textContent = userData.班级 || '未知班级';
    userDepartmentEl.textContent = userData.所属部门 || '未知部门';
    
    // 设置头像
    if (userData.头像 && userData.头像.length > 0) {
        avatarEl.src = userData.头像[0].url;
    } else {
        avatarEl.src = 'placeholder.png';
    }
    
    // 生成二维码
    generateQRCode(userData.用户编号);
}

// 生成二维码
function generateQRCode(userId) {
    if (!userId) return;
    
    // 使用qrcode-generator库生成二维码
    const qr = qrcode(4, 'L');
    qr.addData(userId);
    qr.make();
    
    // 设置二维码图片
    qrCodeEl.src = qr.createDataURL();
}

// 显示错误信息
function showError(message) {
    userNameEl.textContent = '错误';
    userIdEl.textContent = message;
    userStudentIdEl.textContent = '';
    userClassEl.textContent = '';
    userDepartmentEl.textContent = '';
    avatarEl.src = 'placeholder.png';
    qrCodeEl.src = '';
}
