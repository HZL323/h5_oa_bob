import fs from 'fs';
import path from 'path';
import AdmZip from 'adm-zip';
import https from 'https';
import { exec } from 'child_process';
import { promisify } from 'util';
import http from 'http';
import qrcode from 'qrcode-terminal';
import { networkInterfaces } from 'os';
const execAsync = promisify(exec);
// 基础配置
const BASE_PATH = 'D:\\北京银行oa项目\\打包\\z-production';

// 获取下一个构建号
function getNextBuildNumber() {
    if (!fs.existsSync(BASE_PATH)) {
        fs.mkdirSync(BASE_PATH, { recursive: true });
        return 352;
    }

    const dirs = fs.readdirSync(BASE_PATH)
        .filter(dir => fs.statSync(path.join(BASE_PATH, dir)).isDirectory())
        .filter(dir => /^\d+$/.test(dir))
        .map(dir => parseInt(dir));

    return dirs.length > 0 ? Math.max(...dirs) + 1 : 352;
}

// 处理 zip 文件
async function updateZipFile(buildNumber, newDir) {
    try {
        // 在新版本目录下查找 zip 文件
        const files = fs.readdirSync(newDir);
        const zipFile = files.find(file => file.endsWith('.zip'));
        
        if (!zipFile) {
            throw new Error('未找到 zip 文件');
        }

        const zipPath = path.join(newDir, zipFile);
        console.log('找到 zip 文件:', zipPath);

        // 修改 zip 内容
        const zip = new AdmZip(zipPath);
        const versionName = `${Math.floor(buildNumber/100)}.${Math.floor((buildNumber/10)%10)}.${buildNumber%10}`;
        
        // 读取现有的 plugin.properties 内容
        const existingContent = zip.getEntry('plugin.properties')?.getData().toString('utf8') || '';
        
        // 使用正则表达式更新或添加 version_code 和 version_name
        let newContent = existingContent
            .replace(/^version_code=.*$/m, `version_code=${buildNumber}`)
            .replace(/^version_name=.*$/m, `version_name=${versionName}`);
            
        // 如果属性不存在，则添加到文件末尾
        if (!newContent.includes('version_code=')) {
            newContent += `\nversion_code=${buildNumber}`;
        }
        if (!newContent.includes('version_name=')) {
            newContent += `\nversion_name=${versionName}`;
        }
        
        zip.updateFile('plugin.properties', Buffer.from(newContent));
        zip.writeZip(zipPath);
        
        console.log('已更新 zip 文件中的 plugin.properties');
    } catch (error) {
        console.error('处理 zip 文件时出错:', error);
        throw error;
    }
}

// 获取本地IP地址
function getLocalIP() {
    const nets = networkInterfaces();
    for (const name of Object.keys(nets)) {
        for (const net of nets[name]) {
            if (net.family === 'IPv4' && !net.internal) {
                return net.address;
            }
        }
    }
    return 'localhost';
}

// 创建本地服务器来分享文件
async function shareFileLocally(filePath) {
    const fileName = path.basename(filePath);
    console.log('filePath:', filePath);
    const port = 3000;
    const ip = getLocalIP();
    
    const server = http.createServer((req, res) => {
        if (req.url === '/download') {
            res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
            res.setHeader('Content-Type', 'application/octet-stream');
            fs.createReadStream(filePath).pipe(res);
        } else {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(`
                <html>
                    <body>
                        <h1>点击下载文件：${fileName}</h1>
                        <a href="/download">下载</a>
                    </body>
                </html>
            `);
        }
    });

    server.listen(port, () => {
        const url = `http://${ip}:${port}`;
        console.log(`\n本地服务器已启动！`);
        console.log(`请在手机浏览器中访问: ${url}`);
        console.log('\n或扫描以下二维码：');
        qrcode.generate(url, { small: true });
        console.log('\n按 Ctrl+C 停止服务器...');
    });
}

// 添加新的函数来检查和修改文件
async function checkAndModifyFiles() {
    // 读取当前的 BASE_PATH
    const autoBuildContent = fs.readFileSync('auto_build.mjs', 'utf8');
    const basePath = autoBuildContent.match(/const BASE_PATH = ['"]([^'"]+)['"]/)[1];
    
    // 根据 BASE_PATH 确定要使用的 URL
    let targetUrl = '';
    if (basePath.includes('z-production')) {
        targetUrl = 'const URL = `http://app.xcoa.bj.bob.test`';
    } else if (basePath.includes('production')) {
        targetUrl = 'const URL = `http://oa.bj.bob`';
    } else if (basePath.includes('test')) {
        targetUrl = 'const URL = `http://10.51.228.84:8080`';
    } else if (basePath.includes('prerelease')) {
        targetUrl = 'const URL = `http://10.51.252.191:8089`';
    }

    // 修改 main.js
    const mainJsPath = 'src/main.js';
    let mainContent = fs.readFileSync(mainJsPath, 'utf8');
    
    if (basePath.includes('生产')) {
        // 生产环境：注释掉 VConsole
        mainContent = mainContent.replace(/Vue\.use\(new VConsose\(\)\)/, '//Vue.use(new VConsose())');
    } else {
        // 非生产环境：打开 VConsole
        mainContent = mainContent.replace(/\/\/Vue\.use\(new VConsose\(\)\)/, 'Vue.use(new VConsose())');
    }
    
    fs.writeFileSync(mainJsPath, mainContent);

    // 修改 query.js
    const queryJsPath = 'src/core/api/query.js';
    let queryContent = fs.readFileSync(queryJsPath, 'utf8');
    
    // 直接替换 URL
    queryContent = queryContent.replace(
        /const URL = `[^`]+`/,
        targetUrl
    );
    
    fs.writeFileSync(queryJsPath, queryContent);
    
    console.log('当前环境URL:', targetUrl);
    console.log('文件检查和修改完成');
}

// 修改 main 函数
async function main() {
    try {
        // 首先检查和修改文件
        await checkAndModifyFiles();
        
        // 0. 执行 npm run build
        console.log('执行 npm run build...');
        await execAsync('npm run build');

        // 1. 获取新的构建号
        const buildNumber = getNextBuildNumber();
        const newDir = path.join(BASE_PATH, buildNumber.toString());
        
        // 2. 确保目录存在
        if (!fs.existsSync(newDir)) {
            fs.mkdirSync(newDir, { recursive: true });
        }
        
        console.log(`请手动执行 Minxing.build 并将文件保存到目录: ${newDir}`);
        console.log('完成后按任意键继续...');
        
        // 等待用户输入
        await new Promise(resolve => process.stdin.once('data', resolve));
        
        // 3. 更新 zip 包中的 plugin.properties
        console.log('更新 zip 文件...');
        await updateZipFile(buildNumber, newDir);
        
        const files = fs.readdirSync(newDir);
        const zipFile = files.find(file => file.endsWith('.zip'));
        if (zipFile) {
            const zipPath = path.join(newDir, zipFile);
            console.log('准备分享文件...');
            await shareFileLocally(zipPath);
        }

        // 移除原来的完成提示，因为现在需要等待用户手动关闭服务器
    } catch (error) {
        console.error('发生错误:', error);
    }
}

main(); 