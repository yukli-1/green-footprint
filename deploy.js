import { execSync } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

console.log('开始构建和部署...');

// 构建项目
try {
  console.log('正在构建项目...');
  execSync('npm run build', { stdio: 'inherit' });
  
  // 读取构建后的index.html
  const indexPath = join(process.cwd(), 'dist', 'index.html');
  let indexContent = readFileSync(indexPath, 'utf8');
  
  console.log('构建成功！');
  console.log('请手动将 dist 文件夹的内容推送到 gh-pages 分支');
  console.log('或者使用以下命令（需要Git Bash）:');
  console.log('git subtree push --prefix dist origin gh-pages');
  
} catch (error) {
  console.error('构建失败:', error.message);
  process.exit(1);
}