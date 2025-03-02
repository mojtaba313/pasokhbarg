const fs = require("fs");
const path = require("path");

const ADDITIONAL_BASE_URL = "";

// فرمت‌های فایل‌هایی که می‌خواهیم پیدا کنیم
const TARGET_EXTENTIONS = [".js", ".ts", ".jsx", ".tsx", ".css"];
const OUTPUT_FILE_NAME = "merged_files.txt";

// تابع برای پیدا کردن تمام فایل‌ها با فرمت‌های مشخص
function findFiles(dir, extensions, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      findFiles(filePath, extensions, fileList);
    } else if (
      extensions.includes(path.extname(file)) &&
      !filePath.endsWith("app.js")
    ) {
      fileList.push(filePath);
    }
  });

  return fileList;
}

// تابع برای تبدیل مسیر کامل به مسیر نسبی
function getRelativePath(fullPath, baseDir) {
  return path.relative(baseDir, fullPath);
}

// تابع برای خواندن محتوای فایل و اضافه کردن به فایل خروجی
function mergeFiles(filePaths, outputFilePath, baseDir) {
  const outputStream = fs.createWriteStream(outputFilePath);

  filePaths.forEach((filePath) => {
    const relativePath = getRelativePath(filePath, baseDir);
    const content = fs.readFileSync(filePath, "utf8");
    outputStream.write(
      `\nthe codes of file with route : ${ADDITIONAL_BASE_URL}/${relativePath}\n :`
    );
    outputStream.write(content);
    outputStream.write(
      "\n----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------\n"
    );
  });

  outputStream.end();
}

// مسیر شروع جستجو و مسیر فایل خروجی
const startDir = process.cwd(); // مسیر فعلی
const outputFile = path.join(startDir, OUTPUT_FILE_NAME);

// پیدا کردن فایل‌ها (به جز app.js)
const files = findFiles(startDir, TARGET_EXTENTIONS);

// ادغام فایل‌ها و ایجاد فایل خروجی
mergeFiles(files, outputFile, startDir);

console.log(`SAVED IN ${outputFile} `);
